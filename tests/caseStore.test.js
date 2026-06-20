const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { LocalCaseStore, RedisClientCaseStore, normalizeReceiptToCase, inferBrand, inferJurisdiction } = require('../src/caseStore.js');
const { renderMarkdownDossier, renderJsonDossier } = require('../src/dossier.js');

test('normalizes threat receipt into authority-safe case record', () => {
  const record = normalizeReceiptToCase({
    url: 'https://usps-redelivery-fee.example/pay',
    hostname: 'usps-redelivery-fee.example',
    title: 'USPS final notice',
    risk: 'high',
    score: 72,
    advice: 'Do not pay on this page.',
    findings: [{ type: 'payment', label: 'Unusual payment request', evidence: 'redelivery fee', weight: 18 }]
  });
  assert.equal(record.suspectedBrand, 'USPS');
  assert.equal(record.jurisdiction.country, 'United States');
  assert.ok(record.reportingChannels.some((channel) => channel.name.includes('FTC')));
  assert.match(record.safetyBoundary, /Does not identify/);
});

test('local case store persists records without Redis config', () => {
  const filePath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'cloak-cases-')), 'cases.json');
  const store = new LocalCaseStore(filePath);
  const record = normalizeReceiptToCase({ id: 'r1', url: 'https://example.com', hostname: 'example.com', risk: 'low', score: 0 });
  const result = store.saveCase(record);
  assert.equal(result.backend, 'local-json');
  assert.equal(store.getCase(record.id).id, record.id);
});

test('dossier renderers include reporting and safety sections', () => {
  const record = normalizeReceiptToCase({
    id: 'r2',
    url: 'https://secure-bank-verify.example',
    hostname: 'secure-bank-verify.example',
    title: 'Bank Security',
    risk: 'high',
    score: 88,
    findings: [{ type: 'credential', label: 'Credential request', evidence: 'password and code', weight: 16 }]
  });
  record.explanation = {
    summary: 'High-risk credential pressure.',
    whyItMatters: 'It asks for sensitive codes.',
    safeNextSteps: 'Use official bank app.',
    reportingNote: 'Attach URL and case ID.'
  };
  const md = renderMarkdownDossier(record);
  const json = renderJsonDossier(record);
  assert.match(md, /Observed Scam Signals/);
  assert.match(md, /Grounded Explanation/);
  assert.match(md, /High-risk credential pressure/);
  assert.match(md, /Reporting Channels/);
  assert.match(md, /Safety Boundary/);
  assert.equal(JSON.parse(json).id, record.id);
});

test('jurisdiction inference stays cautious when unknown', () => {
  const jurisdiction = inferJurisdiction({ hostname: 'random-domain.example', findings: [] });
  assert.equal(jurisdiction.country, 'Unknown');
  assert.equal(jurisdiction.confidence, 'unknown');
});

test('brand inference avoids unsupported claims', () => {
  assert.equal(inferBrand({ hostname: 'unknown.example', findings: [] }), 'Unknown / needs review');
});

test('redis client store detects Redis Cloud host/port/password config', () => {
  const store = new RedisClientCaseStore({
    username: 'default',
    password: 'not-a-real-secret',
    host: 'redis.example.com',
    port: '1234'
  });
  assert.equal(store.isConfigured(), true);
  assert.deepEqual(store.clientOptions(), {
    username: 'default',
    password: 'not-a-real-secret',
    socket: { host: 'redis.example.com', port: 1234 }
  });
});
