const test = require('node:test');
const assert = require('node:assert/strict');
const { generateStixBundle, generateCsv, generateHumanSummary, csvEscape } = require('../src/threatExport.js');
const { normalizeReceiptToCase } = require('../src/caseStore.js');
const { analyzeScamSurface } = require('../src/scamSignals.js');

function makeSampleCase() {
  const analysis = analyzeScamSurface({
    hostname: 'paypal-secure-verify.click',
    title: 'PayPal Security',
    text: 'Account suspended. Verify now with password. Gift card payment. Act now within 24 hours.'
  });
  const receipt = {
    id: 'test-case-001',
    url: 'https://paypal-secure-verify.click/login',
    hostname: 'paypal-secure-verify.click',
    title: 'PayPal Security',
    ...analysis
  };
  return normalizeReceiptToCase(receipt, { source: 'test' });
}

test('STIX bundle has correct structure', () => {
  const caseRecord = makeSampleCase();
  const bundle = generateStixBundle(caseRecord);
  assert.equal(bundle.type, 'bundle');
  assert.ok(bundle.id.startsWith('bundle--'));
  assert.ok(bundle.objects.length >= 3);
});

test('STIX bundle contains identity', () => {
  const caseRecord = makeSampleCase();
  const bundle = generateStixBundle(caseRecord);
  const identity = bundle.objects.find((o) => o.type === 'identity');
  assert.ok(identity);
  assert.equal(identity.name, 'cloak STING Scam Detector');
});

test('STIX bundle contains indicator with risk labels', () => {
  const caseRecord = makeSampleCase();
  const bundle = generateStixBundle(caseRecord);
  const indicator = bundle.objects.find((o) => o.type === 'indicator');
  assert.ok(indicator);
  assert.ok(indicator.labels.some((l) => l.startsWith('risk:')));
  assert.ok(indicator.indicator_types.length > 0);
});

test('STIX bundle contains domain observable', () => {
  const caseRecord = makeSampleCase();
  const bundle = generateStixBundle(caseRecord);
  const domain = bundle.objects.find((o) => o.type === 'domain-name');
  assert.ok(domain);
  assert.equal(domain.value, 'paypal-secure-verify.click');
});

test('STIX bundle contains note with findings', () => {
  const caseRecord = makeSampleCase();
  const bundle = generateStixBundle(caseRecord);
  const note = bundle.objects.find((o) => o.type === 'note');
  assert.ok(note);
  assert.ok(note.content.includes('Scam Signal Analysis'));
});

test('CSV export has header row and data', () => {
  const caseRecord = makeSampleCase();
  const csv = generateCsv(caseRecord);
  const lines = csv.split('\n');
  assert.ok(lines[0].includes('Case ID'));
  assert.ok(lines.length >= 2);
  assert.ok(lines[1].includes('test-case-001'));
});

test('CSV export handles multiple records', () => {
  const records = [makeSampleCase(), makeSampleCase()];
  records[1].id = 'test-case-002';
  const csv = generateCsv(records);
  const lines = csv.split('\n');
  assert.equal(lines.length, 3);
});

test('csvEscape handles commas and quotes', () => {
  assert.equal(csvEscape('hello, world'), '"hello, world"');
  assert.equal(csvEscape('he said "hi"'), '"he said ""hi"""');
  assert.equal(csvEscape('simple'), 'simple');
});

test('human summary includes all sections', () => {
  const caseRecord = makeSampleCase();
  const summary = generateHumanSummary(caseRecord);
  assert.ok(summary.includes('CLOAK STING'));
  assert.ok(summary.includes('SIGNALS DETECTED'));
  assert.ok(summary.includes('RECOMMENDED ACTION'));
  assert.ok(summary.includes('REPORTING CHANNELS'));
  assert.ok(summary.includes('SAFETY'));
  assert.ok(summary.includes('test-case-001'));
});

test('human summary includes risk level', () => {
  const caseRecord = makeSampleCase();
  const summary = generateHumanSummary(caseRecord);
  assert.ok(summary.includes('HIGH') || summary.includes('MEDIUM'));
});
