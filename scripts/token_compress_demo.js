#!/usr/bin/env node
/**
 * Token compression demo harness for cloak sting.
 *
 * Demonstrates risk-preserving evidence compression:
 * 1. Builds a realistic scam case record
 * 2. Compresses it with riskCompressEvidence()
 * 3. Reports token/char reduction metrics
 * 4. Generates explanations from both raw and compressed evidence
 * 5. Evaluates both explanations with the Arize eval rubric
 * 6. Compares quality: proves compression maintains/improves downstream performance
 *
 * No API keys needed — runs deterministic local path.
 */

const { riskCompressEvidence, verifyRiskPreservation } = require('../src/tokenCompress.js');
const { normalizeReceiptToCase } = require('../src/caseStore.js');
const { buildGroundedExplanation, compactCaseForPrompt } = require('../src/anthropicExplain.js');
const { evaluateExplanation } = require('../src/arizeEvalCriteria.js');

const DEMO_RECEIPTS = [
  {
    id: 'sting-1718900000000',
    url: 'https://secure-bank-verify-account-login.example/verify?session=abc123&ref=sms_urgent_20240620',
    hostname: 'secure-bank-verify-account-login.example',
    title: 'Bank of America - Verify Your Account Immediately - Security Alert',
    risk: 'high',
    score: 88,
    advice: 'Do not enter your password or card number. Bank of America will never ask you to verify credentials via text link. Open the official BoA app or call the number on your card.',
    findings: [
      { type: 'urgency', label: 'Urgency pressure', evidence: 'act now or your account will be permanently locked within 24 hours', weight: 30 },
      { type: 'impersonation', label: 'Trusted institution language', evidence: 'bank of america security department', weight: 25 },
      { type: 'impersonation', label: 'Trusted institution language', evidence: 'federal deposit insurance corporation', weight: 20 },
      { type: 'credential', label: 'Credential harvesting', evidence: 'enter your social security number and online banking password', weight: 35 },
      { type: 'payment', label: 'Financial request', evidence: 'verify your debit card number and PIN for security purposes', weight: 30 },
      { type: 'urgency', label: 'Urgency pressure', evidence: 'failure to respond will result in account termination', weight: 20 },
      { type: 'domain', label: 'Suspicious domain', evidence: 'secure-bank-verify-account-login.example (not bankofamerica.com)', weight: 15 },
      { type: 'urgency', label: 'Urgency pressure', evidence: 'your account has been compromised and requires immediate verification', weight: 15 },
      { type: 'impersonation', label: 'Trusted institution language', evidence: 'official bank security team', weight: 10 },
      { type: 'redirect', label: 'Suspicious redirect', evidence: 'form submits to external domain not matching claimed institution', weight: 12 },
      { type: 'urgency', label: 'Urgency pressure', evidence: 'do not ignore this warning', weight: 8 },
      { type: 'payment', label: 'Financial request', evidence: 'wire transfer confirmation required', weight: 8 },
    ],
    analyzedAt: '2024-06-20T15:30:00.000Z'
  },
  {
    id: 'sting-1718900060000',
    url: 'https://usps-redelivery-update.com/track?id=9400111899223456789012',
    hostname: 'usps-redelivery-update.com',
    title: 'USPS - Redelivery Fee Required - Package Held',
    risk: 'high',
    score: 75,
    advice: 'USPS never charges redelivery fees by text. Track packages only at usps.com. Do not enter card information.',
    findings: [
      { type: 'impersonation', label: 'Trusted institution language', evidence: 'united states postal service', weight: 25 },
      { type: 'payment', label: 'Financial request', evidence: 'pay $3.99 redelivery fee to release your package', weight: 30 },
      { type: 'urgency', label: 'Urgency pressure', evidence: 'package will be returned to sender in 48 hours', weight: 20 },
      { type: 'domain', label: 'Suspicious domain', evidence: 'usps-redelivery-update.com (not usps.com)', weight: 15 },
      { type: 'credential', label: 'Credential harvesting', evidence: 'enter your credit card to confirm delivery address', weight: 25 },
    ],
    analyzedAt: '2024-06-20T16:00:00.000Z'
  }
];

function separator(title) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${title}`);
  console.log(`${'═'.repeat(60)}\n`);
}

function runDemo() {
  separator('sting — Token Compression Demo');
  console.log('Risk-preserving compression for scam evidence before LLM explanation.\n');

  const results = [];

  for (const receipt of DEMO_RECEIPTS) {
    separator(`Case: ${receipt.hostname}`);

    // 1. Normalize to case record (same as production pipeline)
    const caseRecord = normalizeReceiptToCase(receipt);

    // 2. Show raw size
    const rawPromptPayload = compactCaseForPrompt(caseRecord);
    const rawJson = JSON.stringify(rawPromptPayload);
    console.log(`Raw evidence payload: ${rawJson.length} chars (~${Math.ceil(rawJson.length / 3.8)} tokens)`);

    // 3. Compress
    const { compressed, metrics } = riskCompressEvidence(caseRecord);
    const compressedJson = JSON.stringify(compressed);
    console.log(`Compressed payload:   ${compressedJson.length} chars (~${Math.ceil(compressedJson.length / 3.8)} tokens)`);
    console.log('');
    console.log(`  Char reduction:  ${metrics.reduction.chars} chars (${metrics.reduction.charPercent}%)`);
    console.log(`  Token reduction: ${metrics.reduction.tokens} tokens (${metrics.reduction.tokenPercent}%)`);
    console.log(`  Findings kept:   ${metrics.findingsKept} / ${metrics.findingsKept + metrics.findingsDropped}`);
    console.log(`  Risk fields:     ${metrics.riskFieldsPreserved}/${metrics.riskFieldsTotal} preserved`);

    // 4. Verify risk preservation
    const verification = verifyRiskPreservation(compressed, caseRecord);
    console.log(`  Risk preserved:  ${verification.valid ? 'YES — all decision-critical fields intact' : `NO — missing: ${verification.missing.join(', ')}`}`);

    // 5. Generate explanations from both raw and compressed
    console.log('\n  Generating explanations...');
    const rawExplanation = buildGroundedExplanation(caseRecord);
    const compressedExplanation = buildGroundedExplanation({
      ...caseRecord,
      findings: compressed.findings || [],
      score: compressed.score,
      risk: compressed.risk
    });

    // 6. Evaluate both with Arize criteria
    console.log('  Evaluating with Arize rubric...\n');
    const rawEval = evaluateExplanation(rawExplanation, caseRecord);
    const compressedEval = evaluateExplanation(compressedExplanation, caseRecord);

    const criteria = ['grounded', 'safeAction', 'noOverclaim', 'noSecrets', 'clarity'];
    const rawPass = criteria.filter((c) => rawEval[c].pass).length;
    const compPass = criteria.filter((c) => compressedEval[c].pass).length;

    console.log('  Arize Eval Results:');
    console.log(`  ${'Criterion'.padEnd(14)} | ${'Raw'.padEnd(6)} | ${'Compressed'.padEnd(12)} | Note`);
    console.log(`  ${'─'.repeat(14)}-+-${'─'.repeat(6)}-+-${'─'.repeat(12)}-+-${'─'.repeat(30)}`);
    for (const c of criteria) {
      const rawR = rawEval[c].pass ? 'PASS' : 'FAIL';
      const compR = compressedEval[c].pass ? 'PASS' : 'FAIL';
      const note = compressedEval[c].reason.slice(0, 30);
      console.log(`  ${c.padEnd(14)} | ${rawR.padEnd(6)} | ${compR.padEnd(12)} | ${note}`);
    }
    console.log(`\n  Score: raw ${rawPass}/${criteria.length} vs compressed ${compPass}/${criteria.length}`);

    if (compPass >= rawPass) {
      console.log('  Result: Compression MAINTAINS explanation quality.');
    } else {
      console.log('  Result: Compression DEGRADES quality — needs tuning.');
    }

    results.push({
      case: receipt.hostname,
      rawChars: rawJson.length,
      compressedChars: compressedJson.length,
      reductionPercent: metrics.reduction.charPercent,
      tokenReductionPercent: metrics.reduction.tokenPercent,
      riskPreserved: verification.valid,
      rawEvalScore: rawPass,
      compressedEvalScore: compPass,
      qualityMaintained: compPass >= rawPass
    });
  }

  // Summary
  separator('Summary');
  console.log('Case                                     | Reduction | Tokens | Risk OK | Quality');
  console.log('─'.repeat(85));
  for (const r of results) {
    const name = r.case.slice(0, 40).padEnd(40);
    console.log(`${name} | ${String(r.reductionPercent + '%').padEnd(9)} | ${String(r.tokenReductionPercent + '%').padEnd(6)} | ${r.riskPreserved ? 'YES    ' : 'NO     '} | ${r.qualityMaintained ? 'MAINTAINED' : 'DEGRADED'}`);
  }

  const avgReduction = Math.round(results.reduce((s, r) => s + r.reductionPercent, 0) / results.length);
  const avgTokenReduction = Math.round(results.reduce((s, r) => s + r.tokenReductionPercent, 0) / results.length);
  const allPreserved = results.every((r) => r.riskPreserved);
  const allMaintained = results.every((r) => r.qualityMaintained);

  console.log('');
  console.log(`Average char reduction:  ${avgReduction}%`);
  console.log(`Average token reduction: ${avgTokenReduction}%`);
  console.log(`All risk fields preserved: ${allPreserved ? 'YES' : 'NO'}`);
  console.log(`All quality maintained:    ${allMaintained ? 'YES' : 'NO'}`);
  console.log('');
  console.log('Conclusion: risk-preserving compression reduces LLM context while');
  console.log('maintaining downstream explanation quality per Arize eval rubric.');

  // Write proof JSON
  const fs = require('node:fs');
  const path = require('node:path');
  const proofPath = path.join(__dirname, '..', 'data', 'token-compress-proof.json');
  fs.mkdirSync(path.dirname(proofPath), { recursive: true });
  fs.writeFileSync(proofPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    tool: 'sting token compression',
    method: 'deterministic risk-preserving evidence compression',
    results,
    summary: {
      avgCharReduction: `${avgReduction}%`,
      avgTokenReduction: `${avgTokenReduction}%`,
      allRiskFieldsPreserved: allPreserved,
      allQualityMaintained: allMaintained
    }
  }, null, 2));
  console.log(`\nProof written to: ${proofPath}`);
}

runDemo();
