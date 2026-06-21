const test = require('node:test');
const assert = require('node:assert/strict');
const { getReportingChannels, buildReportPacket } = require('../src/reportingRoute.js');

test('US-based scam routes to FTC + IC3', () => {
  const caseRecord = {
    id: 'case_us01', hostname: 'fake-irs.example',
    findings: [{ type: 'impersonation', label: 'IRS impersonation', evidence: 'irs', weight: 14 }]
  };
  const channels = getReportingChannels(caseRecord);
  const names = channels.map((c) => c.name);
  assert.ok(names.some((n) => n.includes('FTC')));
  assert.ok(names.some((n) => n.includes('IC3')));
});

test('financial scam includes bank fraud department', () => {
  const caseRecord = {
    id: 'case_fin01', hostname: 'pay-scam.example',
    findings: [{ type: 'payment', label: 'Unusual payment request', evidence: 'wire transfer', weight: 18 }]
  };
  const channels = getReportingChannels(caseRecord);
  const names = channels.map((c) => c.name.toLowerCase());
  assert.ok(names.some((n) => n.includes('financial') || n.includes('cfpb') || n.includes('consumer')));
});

test('phone scam includes carrier reporting (7726/SPAM)', () => {
  const caseRecord = {
    id: 'case_phone01', hostname: 'scam.example',
    findings: [{ type: 'ransom', label: 'Phone threat', evidence: 'phone threat ransom demand', weight: 20 }]
  };
  const channels = getReportingChannels(caseRecord);
  const names = channels.map((c) => c.name.toLowerCase());
  assert.ok(names.some((n) => n.includes('7726') || n.includes('spam') || n.includes('carrier') || n.includes('fcc')));
});

test('report packet includes case evidence + suggested channels', () => {
  const caseRecord = {
    id: 'case_pkt01', url: 'https://scam.example/pay', hostname: 'scam.example',
    score: 85, findings: [{ type: 'payment', label: 'Unusual payment request', evidence: 'crypto', weight: 18 }]
  };
  const channels = getReportingChannels(caseRecord);
  const packet = buildReportPacket(caseRecord, channels);
  assert.ok(packet.evidence);
  assert.equal(packet.evidence.url, caseRecord.url);
  assert.equal(packet.evidence.hostname, caseRecord.hostname);
  assert.ok(Array.isArray(packet.evidence.signals));
  assert.ok(Array.isArray(packet.recommendedChannels));
  assert.ok(packet.recommendedChannels.length >= 1);
  assert.equal(packet.caseId, caseRecord.id);
});

test('no report claims actual submission to authorities', () => {
  const caseRecord = {
    id: 'case_discl01', hostname: 'scam.example',
    findings: [{ type: 'payment', label: 'Payment scam', evidence: 'gift card', weight: 18 }]
  };
  const channels = getReportingChannels(caseRecord);
  const packet = buildReportPacket(caseRecord, channels);
  assert.ok(packet.disclaimer);
  assert.ok(packet.disclaimer.toLowerCase().includes('not'));
  assert.ok(!JSON.stringify(packet).includes('Cloak'));
});
