const test = require('node:test');
const assert = require('node:assert/strict');
const { getReportingChannels, buildReportPacket } = require('../src/reportingRoute.js');

test('US-based scam routes to FTC + IC3', () => {
  const caseRecord = {
    id: 'case_us01',
    hostname: 'fake-irs.example',
    jurisdiction: { country: 'United States', confidence: 'medium' },
    findings: [{ type: 'impersonation', label: 'IRS impersonation', evidence: 'irs', weight: 14 }]
  };
  const channels = getReportingChannels(caseRecord);
  const names = channels.map((c) => c.name);
  assert.ok(names.some((n) => n.includes('FTC')));
  assert.ok(names.some((n) => n.includes('IC3')));
});

test('financial scam includes bank fraud department', () => {
  const caseRecord = {
    id: 'case_fin01',
    hostname: 'pay-scam.example',
    jurisdiction: { country: 'Unknown', confidence: 'unknown' },
    findings: [{ type: 'payment', label: 'Unusual payment request', evidence: 'wire transfer', weight: 18 }]
  };
  const channels = getReportingChannels(caseRecord);
  const names = channels.map((c) => c.name);
  assert.ok(names.some((n) => n.toLowerCase().includes('bank fraud')));
});

test('phone scam includes carrier reporting (7726/SPAM)', () => {
  const caseRecord = {
    id: 'case_phone01',
    hostname: '',
    phoneScam: true,
    jurisdiction: { country: 'Unknown', confidence: 'unknown' },
    findings: [{ type: 'social-engineering', label: 'Phone pressure', evidence: 'do not hang up', weight: 12 }]
  };
  const channels = getReportingChannels(caseRecord);
  const names = channels.map((c) => c.name);
  assert.ok(names.some((n) => n.includes('7726') || n.includes('SPAM') || n.toLowerCase().includes('carrier')));
});

test('report packet includes case evidence + suggested channels', () => {
  const caseRecord = {
    id: 'case_pkt01',
    url: 'https://scam.example/pay',
    hostname: 'scam.example',
    risk: 'high',
    score: 85,
    findings: [{ type: 'payment', label: 'Unusual payment request', evidence: 'crypto', weight: 18 }],
    suspectedBrand: 'Unknown / needs review',
    jurisdiction: { country: 'United States', confidence: 'medium' }
  };
  const channels = getReportingChannels(caseRecord);
  const packet = buildReportPacket(caseRecord, channels);
  assert.ok(packet.evidence);
  assert.equal(packet.evidence.url, caseRecord.url);
  assert.equal(packet.evidence.hostname, caseRecord.hostname);
  assert.ok(Array.isArray(packet.evidence.findings));
  assert.ok(Array.isArray(packet.suggestedChannels));
  assert.ok(packet.suggestedChannels.length >= 1);
  assert.equal(packet.caseId, caseRecord.id);
});

test('no report claims actual submission to authorities', () => {
  const caseRecord = {
    id: 'case_discl01',
    hostname: 'scam.example',
    jurisdiction: { country: 'United States', confidence: 'medium' },
    findings: [{ type: 'payment', label: 'Payment scam', evidence: 'gift card', weight: 18 }]
  };
  const channels = getReportingChannels(caseRecord);
  const packet = buildReportPacket(caseRecord, channels);
  assert.ok(packet.disclaimer);
  assert.ok(packet.disclaimer.toLowerCase().includes('not') || packet.disclaimer.toLowerCase().includes('no'));
  assert.ok(packet.disclaimer.toLowerCase().includes('submitted') || packet.disclaimer.toLowerCase().includes('submit'));
  assert.ok(!JSON.stringify(packet).includes('Cloak'));
});
