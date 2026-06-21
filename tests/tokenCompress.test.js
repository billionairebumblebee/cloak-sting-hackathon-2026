const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
  riskCompressEvidence,
  verifyRiskPreservation,
  compressFindings,
  deduplicateFindings,
  truncateEvidence,
  cleanText,
  estimateTokens,
  charCount,
  REQUIRED_RISK_FIELDS
} = require('../src/tokenCompress.js');
const { normalizeReceiptToCase } = require('../src/caseStore.js');

const MOCK_RECEIPT = {
  id: 'sting-1718900000000',
  url: 'https://secure-bank-verify.example/login',
  hostname: 'secure-bank-verify.example',
  title: 'Bank Security Verification - Urgent',
  risk: 'high',
  score: 88,
  advice: 'Do not enter credentials. Verify through official app.',
  findings: [
    { type: 'urgency', label: 'Urgency pressure', evidence: 'act now or account locked', weight: 30 },
    { type: 'impersonation', label: 'Trusted institution language', evidence: 'bank of america security', weight: 25 },
    { type: 'credential', label: 'Credential harvesting', evidence: 'enter your SSN and password', weight: 35 },
    { type: 'payment', label: 'Financial request', evidence: 'verify debit card and PIN', weight: 30 },
    { type: 'urgency', label: 'Urgency pressure', evidence: 'failure to respond = termination', weight: 20 },
  ]
};

describe('tokenCompress', () => {
  it('riskCompressEvidence reduces char count', () => {
    const caseRecord = normalizeReceiptToCase(MOCK_RECEIPT);
    const { compressed, metrics } = riskCompressEvidence(caseRecord);
    assert.ok(metrics.reduction.chars > 0, 'Should reduce chars');
    assert.ok(metrics.reduction.charPercent > 0, 'Should have positive reduction percent');
    assert.ok(metrics.compressed.chars < metrics.raw.chars, 'Compressed should be smaller');
  });

  it('riskCompressEvidence preserves all required risk fields', () => {
    const caseRecord = normalizeReceiptToCase(MOCK_RECEIPT);
    const { compressed } = riskCompressEvidence(caseRecord);
    assert.ok(compressed.url, 'url preserved');
    assert.ok(compressed.hostname, 'hostname preserved');
    assert.ok(compressed.risk, 'risk preserved');
    assert.ok(compressed.score !== undefined, 'score preserved');
    assert.ok(compressed.brand, 'brand preserved');
    assert.ok(compressed.advice, 'advice preserved');
  });

  it('verifyRiskPreservation passes for valid compression', () => {
    const caseRecord = normalizeReceiptToCase(MOCK_RECEIPT);
    const { compressed } = riskCompressEvidence(caseRecord);
    const result = verifyRiskPreservation(compressed, caseRecord);
    assert.equal(result.valid, true);
    assert.equal(result.missing.length, 0);
  });

  it('verifyRiskPreservation detects missing fields', () => {
    const caseRecord = normalizeReceiptToCase(MOCK_RECEIPT);
    const broken = { score: 88, findings: [] };
    const result = verifyRiskPreservation(broken, caseRecord);
    assert.equal(result.valid, false);
    assert.ok(result.missing.includes('url'));
    assert.ok(result.missing.includes('hostname'));
  });

  it('compressFindings deduplicates and limits count', () => {
    const findings = [
      { type: 'urgency', label: 'Urgency pressure', evidence: 'act now', weight: 30 },
      { type: 'urgency', label: 'Urgency pressure', evidence: 'act now', weight: 30 },
      { type: 'urgency', label: 'Urgency pressure', evidence: 'act now!', weight: 25 },
      { type: 'payment', label: 'Payment', evidence: 'send money', weight: 20 },
    ];
    const result = compressFindings(findings, { maxFindings: 3 });
    assert.ok(result.length <= 3, 'Should limit to maxFindings');
    const evidences = result.map((f) => f.evidence);
    const unique = new Set(evidences);
    assert.equal(evidences.length, unique.size, 'Should deduplicate');
  });

  it('deduplicateFindings removes exact duplicates', () => {
    const findings = [
      { type: 'a', label: 'A', evidence: 'same' },
      { type: 'a', label: 'A', evidence: 'same' },
      { type: 'b', label: 'B', evidence: 'different' },
    ];
    const result = deduplicateFindings(findings);
    assert.equal(result.length, 2);
  });

  it('truncateEvidence respects maxLen', () => {
    const long = 'a'.repeat(200);
    const result = truncateEvidence(long, 50);
    assert.equal(result.length, 50);
    assert.ok(result.endsWith('...'));
  });

  it('truncateEvidence leaves short strings intact', () => {
    assert.equal(truncateEvidence('short', 50), 'short');
  });

  it('cleanText collapses whitespace', () => {
    assert.equal(cleanText('hello    world\n\nfoo\tbar'), 'hello world foo bar');
  });

  it('estimateTokens gives reasonable estimate', () => {
    const tokens = estimateTokens('hello world this is a test');
    assert.ok(tokens > 0);
    assert.ok(tokens < 20);
  });

  it('charCount returns JSON stringified length', () => {
    const obj = { a: 1, b: 'test' };
    assert.equal(charCount(obj), JSON.stringify(obj).length);
  });

  it('compression achieves meaningful reduction on realistic case', () => {
    const caseRecord = normalizeReceiptToCase(MOCK_RECEIPT);
    const { metrics } = riskCompressEvidence(caseRecord);
    assert.ok(metrics.reduction.charPercent >= 30, `Expected >=30% reduction, got ${metrics.reduction.charPercent}%`);
  });

  it('compressed output is valid JSON-serializable', () => {
    const caseRecord = normalizeReceiptToCase(MOCK_RECEIPT);
    const { compressed } = riskCompressEvidence(caseRecord);
    const json = JSON.stringify(compressed);
    const parsed = JSON.parse(json);
    assert.equal(parsed.url, compressed.url);
    assert.equal(parsed.risk, compressed.risk);
  });

  it('handles empty findings gracefully', () => {
    const caseRecord = normalizeReceiptToCase({ ...MOCK_RECEIPT, findings: [] });
    const { compressed, metrics } = riskCompressEvidence(caseRecord);
    assert.deepEqual(compressed.findings, []);
    assert.equal(metrics.findingsKept, 0);
  });

  it('sorts findings by weight (highest first)', () => {
    const caseRecord = normalizeReceiptToCase(MOCK_RECEIPT);
    const { compressed } = riskCompressEvidence(caseRecord);
    const weights = compressed.findings.map((f) => f.weight || 0);
    for (let i = 1; i < weights.length; i++) {
      assert.ok(weights[i] <= weights[i - 1], 'Findings should be sorted by weight descending');
    }
  });
});
