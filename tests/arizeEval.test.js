const test = require('node:test');
const assert = require('node:assert/strict');
const { analyzeScamSurface } = require('../src/scamSignals.js');
const { normalizeReceiptToCase } = require('../src/caseStore.js');
const { buildGroundedExplanation } = require('../src/anthropicExplain.js');
const {
  evalGrounded,
  evalSafeAction,
  evalNoOverclaim,
  evalNoSecrets,
  evalClarity,
  evaluateExplanation
} = require('../src/arizeEvalCriteria.js');

// ── Grounded ────────────────────────────────────────────────────────────────

test('grounded eval passes for deterministic explanation of high-risk case', () => {
  const receipt = analyzeScamSurface({
    hostname: 'usps-redelivery-fee-secure.example',
    title: 'USPS final notice',
    url: 'https://usps-redelivery-fee-secure.example/pay',
    text: 'Final notice. Pay a redelivery fee immediately. Verify security code now. Only through this page.'
  });
  const caseRecord = normalizeReceiptToCase(receipt);
  const explanation = buildGroundedExplanation(caseRecord);
  const result = evalGrounded(explanation, caseRecord);
  assert.ok(result.pass, result.reason);
});

test('grounded eval passes for benign case with no findings', () => {
  const receipt = analyzeScamSurface({
    hostname: 'www.wikipedia.org',
    title: 'Wikipedia',
    text: 'The free encyclopedia that anyone can edit.'
  });
  const caseRecord = normalizeReceiptToCase(receipt);
  const explanation = buildGroundedExplanation(caseRecord);
  const result = evalGrounded(explanation, caseRecord);
  assert.ok(result.pass, result.reason);
});

// ── Safe Action ─────────────────────────────────────────────────────────────

test('safeAction eval passes for deterministic explanation', () => {
  const receipt = analyzeScamSurface({
    title: 'Bank Security Alert',
    text: 'Account suspended. Verify now with password and OTP. Act now within 24 hours. Bank security fraud department.'
  });
  const caseRecord = normalizeReceiptToCase(receipt);
  const explanation = buildGroundedExplanation(caseRecord);
  const result = evalSafeAction(explanation);
  assert.ok(result.pass, result.reason);
});

test('safeAction eval fails for vague explanation without safe guidance', () => {
  const result = evalSafeAction({ summary: 'Something happened.', whyItMatters: 'Unknown.' });
  assert.ok(!result.pass, 'Should fail without safe action terms');
});

// ── No Overclaim ────────────────────────────────────────────────────────────

test('noOverclaim eval passes for deterministic explanation', () => {
  const receipt = analyzeScamSurface({
    title: 'Urgent',
    text: 'Wire transfer gift card do not tell act now final notice.'
  });
  const caseRecord = normalizeReceiptToCase(receipt);
  const explanation = buildGroundedExplanation(caseRecord);
  const result = evalNoOverclaim(explanation);
  assert.ok(result.pass, result.reason);
});

test('noOverclaim eval fails on overclaiming explanation', () => {
  const fakeExplanation = {
    summary: 'This is a confirmed scam. The scammer is guilty and should be arrested.',
    safeNextSteps: 'Report immediately.'
  };
  const result = evalNoOverclaim(fakeExplanation);
  assert.ok(!result.pass, 'Should fail for overclaiming language');
});

// ── No Secrets ──────────────────────────────────────────────────────────────

test('noSecrets eval passes for clean explanation', () => {
  const explanation = { summary: 'Scam signals detected.', safeNextSteps: 'Pause and verify.' };
  const result = evalNoSecrets(explanation);
  assert.ok(result.pass, result.reason);
});

test('noSecrets eval fails when API key is present', () => {
  const explanation = { summary: 'Key: sk-abcdefghijklmnopqrstuvwxyz12345' };
  const result = evalNoSecrets(explanation);
  assert.ok(!result.pass, 'Should fail when secret pattern is present');
});

// ── Clarity ─────────────────────────────────────────────────────────────────

test('clarity eval passes for deterministic explanation', () => {
  const receipt = analyzeScamSurface({
    hostname: 'secure-login-bank-verify.example',
    title: 'Bank Security',
    text: 'Account suspended. Verify now with password. Bank security fraud department. Act now within 24 hours.'
  });
  const caseRecord = normalizeReceiptToCase(receipt);
  const explanation = buildGroundedExplanation(caseRecord);
  const result = evalClarity(explanation);
  assert.ok(result.pass, result.reason);
});

test('clarity eval fails for jargon-heavy explanation', () => {
  const jargonExplanation = {
    summary: 'The heuristic signal engine used deterministic score normalization with regex payload analysis via embeddings inference tokenization at the api endpoint.'
  };
  const result = evalClarity(jargonExplanation);
  assert.ok(!result.pass, 'Should fail with too much jargon');
});

// ── Full pipeline ───────────────────────────────────────────────────────────

test('full 5-criteria eval passes for fake-bank-login fixture', () => {
  const receipt = analyzeScamSurface({
    hostname: 'secure-login-bank-verify.example',
    title: 'Secure Bank Verification Center',
    text: 'URGENT: Your account has been suspended. Verify now within 24 hours. Password. One-time security code. Do not contact your local branch. Only through this page.'
  });
  const caseRecord = normalizeReceiptToCase(receipt);
  const explanation = buildGroundedExplanation(caseRecord);
  const evals = evaluateExplanation(explanation, caseRecord);
  for (const [criterion, result] of Object.entries(evals)) {
    assert.ok(result.pass, `${criterion}: ${result.reason}`);
  }
});

test('full 5-criteria eval passes for fake-shipping-fee fixture', () => {
  const receipt = analyzeScamSurface({
    hostname: 'usps-redelivery-fee-secure.example',
    title: 'USPS Redelivery Fee Notice',
    text: 'USPS final notice. Pay a redelivery fee immediately. Processing fee. Limited time. Security code. Pay to release package.'
  });
  const caseRecord = normalizeReceiptToCase(receipt);
  const explanation = buildGroundedExplanation(caseRecord);
  const evals = evaluateExplanation(explanation, caseRecord);
  for (const [criterion, result] of Object.entries(evals)) {
    assert.ok(result.pass, `${criterion}: ${result.reason}`);
  }
});

test('full 5-criteria eval passes for safe-normal-page fixture', () => {
  const receipt = analyzeScamSurface({
    hostname: 'www.wikipedia.org',
    title: 'Wikipedia',
    text: 'The free encyclopedia that anyone can edit. Browse categories.'
  });
  const caseRecord = normalizeReceiptToCase(receipt);
  const explanation = buildGroundedExplanation(caseRecord);
  const evals = evaluateExplanation(explanation, caseRecord);
  for (const [criterion, result] of Object.entries(evals)) {
    assert.ok(result.pass, `${criterion}: ${result.reason}`);
  }
});

test('full 5-criteria eval passes for crypto-seed-phrase fixture', () => {
  const receipt = analyzeScamSurface({
    hostname: 'wallet-sync-verify.xyz',
    title: 'Wallet Recovery - Enter Seed Phrase',
    text: 'Your crypto wallet compromised. Act now. Enter seed phrase immediately. Do not tell anyone. Only through this page. Processing fee via gift card or Zelle. Limited time.'
  });
  const caseRecord = normalizeReceiptToCase(receipt);
  const explanation = buildGroundedExplanation(caseRecord);
  const evals = evaluateExplanation(explanation, caseRecord);
  for (const [criterion, result] of Object.entries(evals)) {
    assert.ok(result.pass, `${criterion}: ${result.reason}`);
  }
});

// ── Before/after improvement ────────────────────────────────────────────────

test('before-arize explanation fails multiple criteria, after-arize passes all', () => {
  const receipt = analyzeScamSurface({
    hostname: 'secure-login-bank-verify.example',
    title: 'Bank Security',
    text: 'URGENT: Account suspended. Verify now with password and OTP. Bank security fraud department. Do not contact branch. Act now within 24 hours.'
  });
  const caseRecord = normalizeReceiptToCase(receipt);

  const badExplanation = {
    provider: 'hypothetical-v0',
    summary: 'This is definitely a scam. The criminal is guilty. Our heuristic signal engine used deterministic score normalization with regex payload analysis at the api endpoint with embeddings inference tokenization.',
    whyItMatters: 'Confirmed scam.',
    safeNextSteps: 'Avoid.',
    reportingNote: 'Report.'
  };
  const badEvals = evaluateExplanation(badExplanation, caseRecord);
  const badPassCount = Object.values(badEvals).filter((e) => e.pass).length;

  const goodExplanation = buildGroundedExplanation(caseRecord);
  const goodEvals = evaluateExplanation(goodExplanation, caseRecord);
  const goodPassCount = Object.values(goodEvals).filter((e) => e.pass).length;

  assert.ok(badPassCount < goodPassCount, `Bad explanation should pass fewer criteria (${badPassCount}) than good (${goodPassCount})`);
  assert.equal(goodPassCount, 5, 'Good explanation should pass all 5 criteria');
});
