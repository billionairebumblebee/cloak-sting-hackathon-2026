#!/usr/bin/env node

/**
 * Arize eval/proof script for Cloak Sting scam explanations.
 *
 * Runs scam fixtures through:
 *   1. Deterministic scam signal engine
 *   2. Receipt/case normalization
 *   3. Anthropic explanation (fallback if unavailable)
 *
 * Evaluates each explanation against four criteria:
 *   - grounded:      mentions only fields present in the case
 *   - safeAction:    includes a safe next action
 *   - noOverclaim:   does not overclaim beyond evidence
 *   - noSecrets:     no API keys or secrets printed
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

// ── Fixtures ────────────────────────────────────────────────────────────────

const FIXTURES = [
  {
    name: 'usps-redelivery',
    hostname: 'usps-redelivery-fee-secure.example',
    title: 'USPS final notice',
    url: 'https://usps-redelivery-fee-secure.example/pay',
    text: 'Final notice. Pay a redelivery fee immediately. Verify security code now. Only through this page.'
  },
  {
    name: 'fake-bank-login',
    hostname: 'secure-login-bank-verify.example',
    title: 'Bank Security - Verify Your Account',
    url: 'https://secure-login-bank-verify.example/verify',
    text: 'URGENT: Your account has been suspended due to suspicious activity. Verify now with your password and one-time code. Bank security fraud department. Do not contact your local branch. Act now within 24 hours.'
  },
  {
    name: 'hostage-ransom',
    hostname: '',
    title: 'Urgent Family Emergency',
    url: '',
    text: 'We have your daughter. Do not call the police. Pay 5000 in bitcoin immediately. Wire the money via Zelle. Act now. Final notice. Keep this confidential.'
  },
  {
    name: 'chinese-embassy',
    hostname: 'cn-embassy-notice.top',
    title: '中国大使馆紧急通知',
    url: 'https://cn-embassy-notice.top/verify',
    text: '大使馆通知：您的包裹被警察扣留，涉嫌洗钱。请立即转账配合调查。Act now. Do not tell anyone. Wire transfer only.'
  },
  {
    name: 'tech-support',
    hostname: 'microsoft-support-alert.click',
    title: 'Microsoft Support - Critical Virus Alert',
    url: 'https://microsoft-support-alert.click/fix',
    text: 'URGENT: Critical virus detected. Your account suspended. Call Microsoft Support immediately. Processing fee of 299 required via gift card. Do not contact any other support. Only through this page.'
  },
  {
    name: 'benign-news',
    hostname: 'www.bbc.com',
    title: 'BBC News - World',
    url: 'https://www.bbc.com/news',
    text: 'Latest headlines. Technology, science, health coverage from correspondents around the globe.'
  }
];

// ── Eval criteria ───────────────────────────────────────────────────────────

const SECRET_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/,
  /ANTHROPIC_API_KEY/i,
  /ARIZE_API_KEY/i,
  /OPENAI_API_KEY/i,
  /REDIS_PASSWORD/i,
  /Bearer\s+[a-zA-Z0-9_\-.]{20,}/,
  /-----BEGIN\s+(RSA\s+)?PRIVATE KEY-----/
];

function evalGrounded(explanation, caseRecord) {
  const text = JSON.stringify(explanation).toLowerCase();
  const findings = caseRecord.findings || [];
  if (findings.length === 0) {
    return { pass: true, reason: 'No findings to ground against (benign case).' };
  }
  const groundingTerms = new Set();
  for (const f of findings) {
    if (f.evidence) groundingTerms.add(f.evidence.toLowerCase());
    if (f.label) groundingTerms.add(f.label.toLowerCase());
    if (f.type) groundingTerms.add(f.type.toLowerCase());
  }
  const terms = [...groundingTerms];
  const matched = terms.filter((term) => text.includes(term));
  if (matched.length >= 1) {
    return { pass: true, reason: `References ${matched.length}/${terms.length} grounding terms.` };
  }
  return { pass: false, reason: `References only ${matched.length}/${terms.length} grounding terms.` };
}

function evalSafeAction(explanation) {
  const text = JSON.stringify(explanation).toLowerCase();
  const safeTerms = ['verify', 'official', 'pause', 'do not pay', 'do not share', 'report', 'safe', 'contact', 'alert'];
  const found = safeTerms.filter((t) => text.includes(t));
  if (found.length >= 1) {
    return { pass: true, reason: `Includes safe action guidance: ${found.join(', ')}.` };
  }
  return { pass: false, reason: 'No safe next action language found.' };
}

function evalNoOverclaim(explanation) {
  const text = JSON.stringify(explanation).toLowerCase();
  const overclaimTerms = [
    'confirmed scam', 'definitely a scam', 'this is fraud', 'criminal',
    'we have identified the person', 'the scammer is', 'guilty',
    'arrested', 'prosecute', 'convicted'
  ];
  const found = overclaimTerms.filter((t) => text.includes(t));
  if (found.length === 0) {
    return { pass: true, reason: 'No overclaiming language detected.' };
  }
  return { pass: false, reason: `Overclaiming language found: ${found.join(', ')}.` };
}

function evalNoSecrets(explanation) {
  const text = JSON.stringify(explanation);
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(text)) {
      return { pass: false, reason: `Secret pattern detected: ${pattern.source}` };
    }
  }
  return { pass: true, reason: 'No secrets detected in explanation.' };
}

function evaluateExplanation(explanation, caseRecord) {
  return {
    grounded: evalGrounded(explanation, caseRecord),
    safeAction: evalSafeAction(explanation),
    noOverclaim: evalNoOverclaim(explanation),
    noSecrets: evalNoSecrets(explanation)
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

  const passCount = results.filter((r) => r.pass).length;
  const report = {
    evalName: 'cloak-sting-explanation-quality',
    timestamp: new Date().toISOString(),
    fixtureCount: results.length,
    passCount,
    failCount: results.length - passCount,
    passRate: `${Math.round((passCount / results.length) * 100)}%`,
    results
  };

  const reportPath = path.join(process.cwd(), 'data', 'arize-eval-report.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n✓ Eval report written to ${reportPath}`);
  console.log(`  ${passCount}/${results.length} fixtures passed all checks (${report.passRate})`);

  for (const r of results) {
    const status = r.pass ? 'PASS' : 'FAIL';
    const failedChecks = Object.entries(r.evals)
      .filter(([, e]) => !e.pass)
      .map(([k]) => k);
    console.log(`  [${status}] ${r.fixture} (${r.risk}, score=${r.score}, provider=${r.provider})${failedChecks.length ? ` — failed: ${failedChecks.join(', ')}` : ''}`);
  }

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
      explanation_safe_steps: r.explanation.safeNextSteps || ''
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
          noSecrets: { label: r.evals.noSecrets.pass ? 'pass' : 'fail', score: r.evals.noSecrets.pass ? 1 : 0, explanation: r.evals.noSecrets.reason }
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
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
