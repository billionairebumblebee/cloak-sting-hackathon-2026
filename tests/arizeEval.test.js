const test = require('node:test');
const assert = require('node:assert/strict');
const { analyzeScamSurface } = require('../src/scamSignals.js');
const { normalizeReceiptToCase } = require('../src/caseStore.js');
const { buildGroundedExplanation } = require('../src/anthropicExplain.js');

// ── Eval helpers (mirrored from scripts/arize_eval_demo.js) ─────────────

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

// ── Test cases ──────────────────────────────────────────────────────────────

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

test('grounded eval passes for benign case with no findings', () => {
  const receipt = analyzeScamSurface({
    hostname: 'www.bbc.com',
    title: 'BBC News',
    text: 'Latest headlines around the globe.'
  });
  const caseRecord = normalizeReceiptToCase(receipt);
  const explanation = buildGroundedExplanation(caseRecord);
  const result = evalGrounded(explanation, caseRecord);
  assert.ok(result.pass, result.reason);
});

test('full eval pipeline passes for hostage/ransom fixture', () => {
  const receipt = analyzeScamSurface({
    title: 'Urgent Family Emergency',
    text: 'We have your daughter. Do not call the police. Pay 5000 in bitcoin immediately. Wire the money via Zelle. Act now. Final notice. Keep this confidential.'
  });
  const caseRecord = normalizeReceiptToCase(receipt);
  const explanation = buildGroundedExplanation(caseRecord);

  assert.ok(evalGrounded(explanation, caseRecord).pass);
  assert.ok(evalSafeAction(explanation).pass);
  assert.ok(evalNoOverclaim(explanation).pass);
  assert.ok(evalNoSecrets(explanation).pass);
});

test('full eval pipeline passes for Chinese-language scam fixture', () => {
  const receipt = analyzeScamSurface({
    hostname: 'cn-embassy-notice.top',
    title: '中国大使馆紧急通知',
    text: '大使馆通知：您的包裹被警察扣留，涉嫌洗钱。请立即转账配合调查。Act now. Do not tell anyone. Wire transfer only.'
  });
  const caseRecord = normalizeReceiptToCase(receipt);
  const explanation = buildGroundedExplanation(caseRecord);

  assert.ok(evalGrounded(explanation, caseRecord).pass);
  assert.ok(evalSafeAction(explanation).pass);
  assert.ok(evalNoOverclaim(explanation).pass);
  assert.ok(evalNoSecrets(explanation).pass);
});
