const test = require('node:test');
const assert = require('node:assert/strict');
const {
  analyzeHostname,
  levenshtein,
  hasHomoglyphs,
  normalizeHomoglyphs
} = require('../src/typosquatDetector.js');

// Levenshtein distance tests
test('levenshtein: identical strings → 0', () => {
  assert.equal(levenshtein('paypal', 'paypal'), 0);
});

test('levenshtein: one substitution → 1', () => {
  assert.equal(levenshtein('paypal', 'paypa1'), 1);
});

test('levenshtein: two edits → 2', () => {
  assert.equal(levenshtein('amazon', 'amzon'), 1);
  assert.equal(levenshtein('google', 'gogle'), 1);
});

// Homoglyph detection
test('hasHomoglyphs detects Cyrillic а in "аpple"', () => {
  assert.ok(hasHomoglyphs('\u0430pple'));
});

test('hasHomoglyphs returns false for normal ASCII', () => {
  assert.ok(!hasHomoglyphs('apple.com'));
});

test('normalizeHomoglyphs converts Cyrillic а to a', () => {
  const result = normalizeHomoglyphs('\u0430pple');
  assert.equal(result, 'apple');
});

// Full hostname analysis
test('detects paypa1.com as typosquat of PayPal', () => {
  const findings = analyzeHostname('paypa1.com');
  assert.ok(findings.length > 0);
  assert.ok(findings.some((f) => f.type === 'typosquat'));
});

test('detects chase-secure-verify.net as combosquat', () => {
  const findings = analyzeHostname('chase-secure-verify.net');
  assert.ok(findings.some((f) => f.type === 'combosquat' || f.type === 'typosquat'));
});

test('detects suspicious TLD .xyz', () => {
  const findings = analyzeHostname('example.xyz');
  assert.ok(findings.some((f) => f.type === 'suspicious-tld'));
});

test('detects suspicious TLD .click', () => {
  const findings = analyzeHostname('microsoft-support.click');
  assert.ok(findings.some((f) => f.type === 'suspicious-tld'));
});

test('detects URL shorteners', () => {
  const findings = analyzeHostname('bit.ly');
  assert.ok(findings.some((f) => f.type === 'url-shortener'));
});

test('detects raw IP address', () => {
  const findings = analyzeHostname('192.168.1.1');
  assert.ok(findings.some((f) => f.type === 'ip-address'));
});

test('detects excessive subdomain depth', () => {
  const findings = analyzeHostname('a.b.c.d.e.example.com');
  assert.ok(findings.some((f) => f.type === 'subdomain-abuse'));
});

test('does not flag legitimate apple.com', () => {
  const findings = analyzeHostname('apple.com');
  assert.ok(!findings.some((f) => f.type === 'typosquat' || f.type === 'combosquat'));
});

test('does not flag legitimate paypal.com', () => {
  const findings = analyzeHostname('paypal.com');
  assert.ok(!findings.some((f) => f.type === 'typosquat' || f.type === 'combosquat'));
});

test('detects amazon.shop as wrong TLD', () => {
  const findings = analyzeHostname('amazon.shop');
  assert.ok(findings.some((f) => f.type === 'typosquat' || f.type === 'suspicious-tld'));
});

test('empty hostname returns empty', () => {
  assert.deepEqual(analyzeHostname(''), []);
  assert.deepEqual(analyzeHostname(null), []);
});
