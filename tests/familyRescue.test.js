const test = require('node:test');
const assert = require('node:assert/strict');
const { generateRescueReceipt, formatReceiptPlainText } = require('../src/familyRescue.js');

test('generating a rescue receipt from scan results produces valid structure', () => {
  const scanResult = {
    url: 'https://fake-bank-login.example/verify',
    hostname: 'fake-bank-login.example',
    risk: 'high',
    score: 78,
    findings: [
      { type: 'credential', label: 'Repeated credential/code request', evidence: '3 credential terms', weight: 16 },
      { type: 'domain', label: 'Brand impersonation pattern', evidence: 'fake-bank-login.example', weight: 22 }
    ]
  };
  const receipt = generateRescueReceipt(scanResult);
  assert.ok(receipt.timestamp);
  assert.ok(new Date(receipt.timestamp).getTime() > 0);
  assert.equal(receipt.url, scanResult.url);
  assert.equal(receipt.hostname, scanResult.hostname);
  assert.equal(receipt.threatLevel, 'high');
  assert.ok(Array.isArray(receipt.signals));
  assert.ok(receipt.signals.length >= 1);
  assert.ok(typeof receipt.summary === 'string');
  assert.ok(receipt.summary.length > 0);
  assert.ok(Array.isArray(receipt.safeNextSteps));
  assert.ok(receipt.safeNextSteps.length >= 1);
});

test('receipt summary is plain English (no jargon, under 200 chars)', () => {
  const receipt = generateRescueReceipt({
    hostname: 'scam-site.example',
    risk: 'high',
    findings: [{ type: 'payment', label: 'Unusual payment request', evidence: 'gift card', weight: 18 }]
  });
  assert.ok(receipt.summary.length <= 200, `Summary too long: ${receipt.summary.length} chars`);
  const jargon = ['heuristic', 'vector', 'payload', 'obfuscation', 'phishing', 'malware'];
  for (const word of jargon) {
    assert.ok(!receipt.summary.toLowerCase().includes(word), `Summary contains jargon: "${word}"`);
  }
});

test('receipt safe-next-steps are actionable (array of strings)', () => {
  const receipt = generateRescueReceipt({
    hostname: 'fake-usps.example',
    risk: 'medium',
    findings: [{ type: 'impersonation', label: 'Trusted institution language', evidence: 'usps', weight: 14 }]
  });
  assert.ok(Array.isArray(receipt.safeNextSteps));
  assert.ok(receipt.safeNextSteps.length >= 1);
  for (const step of receipt.safeNextSteps) {
    assert.equal(typeof step, 'string');
    assert.ok(step.length > 10, 'Step too short to be actionable');
  }
});

test('receipt handles missing/partial scan data gracefully', () => {
  const receipt = generateRescueReceipt({});
  assert.ok(receipt.timestamp);
  assert.equal(receipt.url, '');
  assert.equal(receipt.hostname, '');
  assert.equal(receipt.threatLevel, 'unknown');
  assert.ok(Array.isArray(receipt.signals));
  assert.ok(typeof receipt.summary === 'string');
  assert.ok(Array.isArray(receipt.safeNextSteps));

  const receiptNull = generateRescueReceipt(null);
  assert.ok(receiptNull.timestamp);
  assert.ok(Array.isArray(receiptNull.safeNextSteps));
});

test('multiple receipts can be stored and retrieved', () => {
  const scans = [
    { hostname: 'scam1.example', risk: 'high', findings: [] },
    { hostname: 'scam2.example', risk: 'medium', findings: [] },
    { hostname: 'scam3.example', risk: 'low', findings: [] }
  ];
  const receipts = scans.map((s) => generateRescueReceipt(s));
  assert.equal(receipts.length, 3);
  const ids = receipts.map((r) => r.id);
  const uniqueIds = new Set(ids);
  assert.equal(uniqueIds.size, 3, 'Each receipt should have a unique ID');
  assert.equal(receipts[0].hostname, 'scam1.example');
  assert.equal(receipts[1].hostname, 'scam2.example');
  assert.equal(receipts[2].hostname, 'scam3.example');
});

test('formatReceiptPlainText produces readable output', () => {
  const receipt = generateRescueReceipt({
    url: 'https://bad-site.example/pay',
    hostname: 'bad-site.example',
    risk: 'high',
    findings: [{ type: 'payment', label: 'Unusual payment request', evidence: 'crypto', weight: 18 }]
  });
  const text = formatReceiptPlainText(receipt);
  assert.ok(text.includes('bad-site.example'));
  assert.ok(text.includes('high'));
  assert.ok(text.includes('Safe Next Steps'));
  assert.ok(!text.includes('Cloak'));
});
