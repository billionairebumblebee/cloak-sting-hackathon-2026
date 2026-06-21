const test = require('node:test');
const assert = require('node:assert/strict');
const { analyzeFormInputs, extractInputLabels } = require('../src/formAnalyzer.js');

test('detects SSN field', () => {
  const { findings } = analyzeFormInputs(['Enter your Social Security Number']);
  assert.ok(findings.some((f) => f.label.includes('Social Security')));
});

test('detects credit card + CVV combo', () => {
  const { findings } = analyzeFormInputs(['Credit Card Number', 'CVV', 'Expiration Date']);
  assert.ok(findings.some((f) => f.category === 'financial'));
  assert.ok(findings.length >= 3);
});

test('detects seed phrase harvesting', () => {
  const { findings, riskFactors } = analyzeFormInputs(['Enter your 12-word seed phrase', 'Recovery phrase']);
  assert.ok(findings.some((f) => f.category === 'crypto'));
  assert.ok(riskFactors.some((f) => f.type === 'form-crypto'));
});

test('flags financial + identity combo', () => {
  const { riskFactors } = analyzeFormInputs([
    'Social Security Number',
    'Credit Card Number',
    'CVV',
    'Date of Birth'
  ]);
  assert.ok(riskFactors.some((f) => f.type === 'form-combo'));
});

test('flags excessive sensitive fields', () => {
  const { riskFactors } = analyzeFormInputs([
    'SSN', 'Credit Card', 'CVV', 'Passport Number', 'DOB'
  ]);
  assert.ok(riskFactors.some((f) => f.type === 'form-excessive'));
});

test('detects OTP/MFA field', () => {
  const { findings } = analyzeFormInputs(['Enter one-time verification code']);
  assert.ok(findings.some((f) => f.label.includes('One-time')));
});

test('no findings for safe inputs', () => {
  const { findings } = analyzeFormInputs(['First Name', 'Email Address', 'Message']);
  assert.equal(findings.length, 0);
});

test('empty input returns empty', () => {
  const { findings } = analyzeFormInputs([]);
  assert.equal(findings.length, 0);
});

test('extractInputLabels extracts sensitive lines', () => {
  const text = 'Welcome to our site\nEnter your passcode here\nYour name\nSSN required\nEnter one-time verification code\nSubmit';
  const labels = extractInputLabels(text);
  assert.ok(labels.some((l) => l.toLowerCase().includes('ssn')));
  assert.ok(labels.some((l) => l.toLowerCase().includes('verification code')));
});
