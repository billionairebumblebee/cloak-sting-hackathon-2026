const test = require('node:test');
const assert = require('node:assert/strict');
const { generateFamilyPacket, formatPacketPlainText, validatePacket } = require('../src/familyRescue.js');

test('generating a rescue receipt from scan results produces valid structure', () => {
  const scan = { url: 'https://fake-bank.example/login', hostname: 'fake-bank.example', score: 85, level: 'HIGH', findings: [{type:'credential_harvesting',label:'Asks for SSN',evidence:'enter your ssn',weight:18}] };
  const pkt = generateFamilyPacket(scan);
  assert.ok(pkt.id);
  assert.ok(pkt.createdAt);
  assert.ok(pkt.whatHappened);
  assert.ok(pkt.riskLevel);
  assert.ok(pkt.whatToDo);
  assert.ok(pkt.signalsDetected);
});

test('receipt summary is plain English (no jargon, under 200 chars)', () => {
  const scan = { url: 'https://scam.example', hostname: 'scam.example', score: 70, level: 'MEDIUM', findings: [{type:'urgency',label:'Urgency',evidence:'act now',weight:14}] };
  const pkt = generateFamilyPacket(scan);
  assert.ok(pkt.whatHappened.length <= 300);
  assert.ok(!pkt.whatHappened.includes('credential_harvesting'));
  assert.ok(!pkt.whatHappened.includes('threat vector'));
});

test('receipt safe-next-steps are actionable (array of strings)', () => {
  const scan = { url: 'https://x.example', hostname: 'x.example', score: 90, level: 'HIGH', findings: [{type:'payment',label:'Gift card',evidence:'buy gift cards',weight:18}] };
  const pkt = generateFamilyPacket(scan);
  assert.ok(Array.isArray(pkt.whatToDo));
  assert.ok(pkt.whatToDo.length >= 1);
  assert.ok(pkt.whatToDo.every(s => typeof s === 'string'));
});

test('receipt handles missing/partial scan data gracefully', () => {
  const scan = { url: '', hostname: '', score: 0, level: 'LOW', findings: [] };
  const pkt = generateFamilyPacket(scan);
  assert.ok(pkt.id);
  assert.ok(pkt.whatHappened);
  assert.ok(Array.isArray(pkt.whatToDo));
});

test('multiple receipts can be stored and retrieved', () => {
  const scans = [
    { url: 'https://a.example', hostname: 'a.example', score: 80, level: 'HIGH', findings: [{type:'urgency',label:'Rush',evidence:'now',weight:14}] },
    { url: 'https://b.example', hostname: 'b.example', score: 60, level: 'MEDIUM', findings: [{type:'payment',label:'Pay',evidence:'wire',weight:18}] }
  ];
  const packets = scans.map(s => generateFamilyPacket(s));
  assert.equal(packets.length, 2);
  assert.notEqual(packets[0].id, packets[1].id);
});

test('formatReceiptPlainText produces readable output', () => {
  const scan = { url: 'https://fake.example', hostname: 'fake.example', score: 85, level: 'HIGH', findings: [{type:'credential_harvesting',label:'Phishing',evidence:'enter password',weight:18}] };
  const pkt = generateFamilyPacket(scan);
  const text = formatPacketPlainText(pkt);
  assert.ok(typeof text === 'string');
  assert.ok(text.length > 50);
  assert.ok(text.includes('STING'));
});
