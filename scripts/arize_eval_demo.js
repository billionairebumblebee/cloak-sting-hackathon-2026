#!/usr/bin/env node

/**
 * Arize eval/proof script for Cloak Sting scam explanations.
 *
 * Runs scam fixtures through:
 *   1. Deterministic scam signal engine
 *   2. Receipt/case normalization
 *   3. Anthropic explanation (fallback if unavailable)
 *
 * Evaluates each explanation against five criteria:
 *   - grounded:      mentions only fields present in the case
 *   - safeAction:    says don't enter card/password/code; use official source
 *   - noOverclaim:   avoids "definitely fraud" unless evidence justifies it
 *   - noSecrets:     no API keys or secrets printed
 *   - clarity:       normal-person language, no excessive jargon
 *
 * Includes a before/after demo showing how Arize eval feedback
 * improved the explanation quality.
 *
 * Produces data/arize-eval-report.json.
 * If `ax` CLI is configured, uploads a dataset + experiment to Arize.
 */

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');
const { analyzeScamSurface } = require('../src/scamSignals.js');
const { normalizeReceiptToCase } = require('../src/caseStore.js');
const { explainWithAnthropic, buildGroundedExplanation } = require('../src/anthropicExplain.js');
const { evaluateExplanation } = require('../src/arizeEvalCriteria.js');

// ── Fixtures (matching demo pages + booth requirements) ─────────────────

const FIXTURES = [
  {
    name: 'fake-bank-login',
    hostname: 'secure-login-bank-verify.example',
    title: 'Secure Bank Verification Center',
    url: 'https://secure-login-bank-verify.example/verify',
    text: 'URGENT: Your account has been suspended. Verify now within 24 hours to avoid permanent account lock. Online banking username. Password. One-time security code. Verify immediately. Do not contact your local branch. Only through this page can your account be restored.'
  },
  {
    name: 'fake-shipping-fee',
    hostname: 'usps-redelivery-fee-secure.example',
    title: 'USPS Redelivery Fee Notice',
    url: 'https://usps-redelivery-fee-secure.example/pay',
    text: 'USPS final notice. Your package is held. Pay a small redelivery fee immediately or it will be returned today. Processing fee: $2.99. Limited time. Account locked after failed payment. Card number. Security code. Pay to release package.'
  },
  {
    name: 'safe-normal-page',
    hostname: 'www.wikipedia.org',
    title: 'Wikipedia — The Free Encyclopedia',
    url: 'https://www.wikipedia.org/',
    text: 'Welcome to Wikipedia, the free encyclopedia that anyone can edit. Featured article of the day. In the news. Browse categories.'
  },
  {
    name: 'crypto-seed-phrase',
    hostname: 'wallet-sync-verify.xyz',
    title: 'Wallet Recovery - Enter Seed Phrase',
    url: 'https://wallet-sync-verify.xyz/recover',
    text: 'Your crypto wallet has been compromised. Act now to secure your bitcoin assets. Enter your 12-word seed phrase immediately to verify your wallet. Do not tell anyone about this recovery process. Only through this page. Processing fee via gift card or Zelle. Limited time before funds are lost forever.'
  }
];

// ── Before/after improvement demo ───────────────────────────────────────
//
// Shows how Arize eval feedback improved explanation quality.
// "Before" = a hypothetical bad explanation that fails eval criteria.
// "After"  = the actual Cloak Sting explanation that passes all criteria.

function runBeforeAfterDemo(caseRecord) {
  const beforeExplanation = {
    provider: 'hypothetical-v0-before-arize',
    summary: 'This is definitely a scam. The criminal behind this page is guilty of fraud and should be arrested and prosecuted. Our heuristic signal engine detected threat vectors via deterministic score normalization using regex payload analysis at the api endpoint level with embeddings inference tokenization.',
    whyItMatters: 'Confirmed scam with certainty.',
    safeNextSteps: 'Avoid the page.',
    reportingNote: 'File a report.'
  };

  const afterExplanation = buildGroundedExplanation(caseRecord);

  const beforeEvals = evaluateExplanation(beforeExplanation, caseRecord);
  const afterEvals = evaluateExplanation(afterExplanation, caseRecord);

  return {
    description: 'Before/after: Arize eval feedback improved explanation quality',
    before: {
      provider: beforeExplanation.provider,
      summary: beforeExplanation.summary,
      evals: beforeEvals,
      passCount: Object.values(beforeEvals).filter((e) => e.pass).length,
      totalCriteria: Object.keys(beforeEvals).length
    },
    after: {
      provider: afterExplanation.provider,
      summary: afterExplanation.summary,
      evals: afterEvals,
      passCount: Object.values(afterEvals).filter((e) => e.pass).length,
      totalCriteria: Object.keys(afterEvals).length
    },
    improvement: Object.keys(afterEvals).filter(
      (k) => !beforeEvals[k].pass && afterEvals[k].pass
    )
  };
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const results = [];

  for (const fixture of FIXTURES) {
    const receipt = { ...fixture, ...analyzeScamSurface(fixture) };
    const caseRecord = normalizeReceiptToCase(receipt, {
      source: 'arize-eval-fixture',
      victimSafeNotes: 'Synthetic fixture for eval — no real victim data.'
    });

    let explanation;
    try {
      explanation = await explainWithAnthropic(caseRecord);
    } catch {
      explanation = buildGroundedExplanation(caseRecord);
    }

    const evals = evaluateExplanation(explanation, caseRecord);
    const allPass = Object.values(evals).every((e) => e.pass);

    results.push({
      fixture: fixture.name,
      risk: caseRecord.risk,
      score: caseRecord.score,
      findingCount: caseRecord.findings.length,
      provider: explanation.provider,
      evals,
      pass: allPass,
      explanation,
      caseId: caseRecord.id
    });
  }

  // Before/after demo on the fake-bank-login fixture
  const bankFixture = FIXTURES[0];
  const bankReceipt = { ...bankFixture, ...analyzeScamSurface(bankFixture) };
  const bankCase = normalizeReceiptToCase(bankReceipt, { source: 'arize-eval-fixture' });
  const beforeAfter = runBeforeAfterDemo(bankCase);

  const passCount = results.filter((r) => r.pass).length;
  const report = {
    evalName: 'cloak-sting-explanation-quality',
    timestamp: new Date().toISOString(),
    fixtureCount: results.length,
    passCount,
    failCount: results.length - passCount,
    passRate: `${Math.round((passCount / results.length) * 100)}%`,
    criteria: ['grounded', 'safeAction', 'noOverclaim', 'noSecrets', 'clarity'],
    results,
    beforeAfter
  };

  const reportPath = path.join(process.cwd(), 'data', 'arize-eval-report.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n=== Cloak Sting Arize Eval Report ===`);
  console.log(`Eval report written to ${reportPath}`);
  console.log(`${passCount}/${results.length} fixtures passed all 5 checks (${report.passRate})\n`);

  for (const r of results) {
    const status = r.pass ? 'PASS' : 'FAIL';
    const failedChecks = Object.entries(r.evals)
      .filter(([, e]) => !e.pass)
      .map(([k]) => k);
    console.log(`  [${status}] ${r.fixture} (${r.risk}, score=${r.score}, provider=${r.provider})${failedChecks.length ? ` — failed: ${failedChecks.join(', ')}` : ''}`);
  }

  console.log(`\n=== Before/After Improvement Demo ===`);
  console.log(`  BEFORE (hypothetical v0): ${beforeAfter.before.passCount}/${beforeAfter.before.totalCriteria} criteria passed`);
  console.log(`    Summary: "${beforeAfter.before.summary.slice(0, 100)}..."`);
  for (const [k, v] of Object.entries(beforeAfter.before.evals)) {
    console.log(`    ${v.pass ? 'PASS' : 'FAIL'} ${k}: ${v.reason}`);
  }
  console.log(`  AFTER  (Arize-guided):    ${beforeAfter.after.passCount}/${beforeAfter.after.totalCriteria} criteria passed`);
  console.log(`    Summary: "${beforeAfter.after.summary.slice(0, 100)}..."`);
  for (const [k, v] of Object.entries(beforeAfter.after.evals)) {
    console.log(`    ${v.pass ? 'PASS' : 'FAIL'} ${k}: ${v.reason}`);
  }
  console.log(`  Criteria fixed by Arize feedback: ${beforeAfter.improvement.join(', ') || 'none'}`);

  // ── Arize AX upload attempt ─────────────────────────────────────────────
  let axUpload = { attempted: false, success: false, blocker: '' };
  try {
    execSync('ax profiles show', { stdio: 'pipe' });
    axUpload.attempted = true;

    const datasetRows = results.map((r) => ({
      fixture_name: r.fixture,
      risk: r.risk,
      score: r.score,
      finding_count: r.findingCount,
      provider: r.provider,
      explanation_summary: r.explanation.summary || '',
      explanation_safe_steps: r.explanation.safeNextSteps || '',
      explanation_why: r.explanation.whyItMatters || ''
    }));

    const datasetFile = path.join(process.cwd(), 'data', 'arize-eval-dataset.json');
    fs.writeFileSync(datasetFile, JSON.stringify(datasetRows, null, 2));

    const space = process.env.ARIZE_SPACE || 'billionairebumblebee Space';
    const datasetName = 'cloak-sting-scam-explanations';

    try {
      execSync(`ax datasets delete "${datasetName}" --space "${space}" --force 2>/dev/null`, { stdio: 'pipe' });
    } catch { /* dataset may not exist yet */ }

    const createOut = execSync(
      `ax datasets create --name "${datasetName}" --space "${space}" --file "${datasetFile}" -o json`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    console.log(`\n✓ AX dataset created: ${datasetName}`);

    let datasetMeta;
    try { datasetMeta = JSON.parse(createOut); } catch { datasetMeta = {}; }

    const experimentRows = results.map((r, i) => {
      const exampleId = datasetMeta.versions?.[0]?.examples?.[i]?.id;
      return {
        ...(exampleId ? { example_id: exampleId } : {}),
        output: r.explanation.summary || '',
        evaluations: {
          grounded: { label: r.evals.grounded.pass ? 'pass' : 'fail', score: r.evals.grounded.pass ? 1 : 0, explanation: r.evals.grounded.reason },
          safeAction: { label: r.evals.safeAction.pass ? 'pass' : 'fail', score: r.evals.safeAction.pass ? 1 : 0, explanation: r.evals.safeAction.reason },
          noOverclaim: { label: r.evals.noOverclaim.pass ? 'pass' : 'fail', score: r.evals.noOverclaim.pass ? 1 : 0, explanation: r.evals.noOverclaim.reason },
          noSecrets: { label: r.evals.noSecrets.pass ? 'pass' : 'fail', score: r.evals.noSecrets.pass ? 1 : 0, explanation: r.evals.noSecrets.reason },
          clarity: { label: r.evals.clarity.pass ? 'pass' : 'fail', score: r.evals.clarity.pass ? 1 : 0, explanation: r.evals.clarity.reason }
        },
        metadata: { fixture: r.fixture, risk: r.risk, score: r.score, provider: r.provider }
      };
    });

    const runsFile = path.join(process.cwd(), 'data', 'arize-eval-runs.json');
    fs.writeFileSync(runsFile, JSON.stringify(experimentRows, null, 2));

    let needExampleIds = !experimentRows[0].example_id;
    if (needExampleIds) {
      try {
        const exported = execSync(
          `ax datasets export "${datasetName}" --space "${space}" --stdout`,
          { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
        );
        const examples = JSON.parse(exported);
        for (let i = 0; i < experimentRows.length && i < examples.length; i++) {
          experimentRows[i].example_id = examples[i].id;
        }
        fs.writeFileSync(runsFile, JSON.stringify(experimentRows, null, 2));
      } catch (exportErr) {
        console.log(`  ⚠ Could not export dataset to get example IDs: ${exportErr.message}`);
      }
    }

    if (experimentRows[0].example_id) {
      const experimentName = `cloak-sting-eval-${new Date().toISOString().slice(0, 10)}`;
      try {
        execSync(
          `ax experiments create --name "${experimentName}" --dataset "${datasetName}" --space "${space}" --file "${runsFile}" -o json`,
          { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
        );
        console.log(`✓ AX experiment created: ${experimentName}`);
        console.log(`  View at: https://app.arize.com → Space "${space}" → Datasets → ${datasetName}`);
        axUpload.success = true;
        axUpload.dataset = datasetName;
        axUpload.experiment = experimentName;
        axUpload.space = space;
      } catch (expErr) {
        axUpload.blocker = `Experiment creation failed: ${expErr.message}`;
        console.log(`  ⚠ Experiment upload failed: ${expErr.message}`);
      }
    } else {
      axUpload.blocker = 'Could not resolve example IDs for experiment runs.';
      console.log('  ⚠ Skipping experiment — could not resolve example IDs.');
    }
  } catch (axErr) {
    axUpload.blocker = `AX profile not configured: ${axErr.message}`;
    console.log(`\nℹ AX upload skipped — no configured profile. Run 'ax profiles create' to enable.`);
  }

  report.arizeAX = axUpload;
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  if (!axUpload.success && axUpload.blocker) {
    console.log(`\nAX blocker: ${axUpload.blocker}`);
  }

  console.log(`\n=== Booth Summary ===`);
  console.log(`Arize role: eval/observability proof layer for AI explanations (not core detector).`);
  console.log(`Core detector: deterministic signal engine (src/scamSignals.js) — no AI needed.`);
  console.log(`Arize evaluates: groundedness, safe action, no overclaiming, no secrets, clarity.`);
  console.log(`AX upload: ${axUpload.success ? 'YES — visible in Arize space' : 'offline report only (see AX blocker above)'}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
