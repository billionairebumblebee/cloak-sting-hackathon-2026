/**
 * Risk-preserving evidence compression for LLM context.
 *
 * Compresses messy scam evidence into a smaller LLM-ready payload while
 * preserving decision-critical risk facts: URL, hostname, impersonated brand,
 * urgency/payment/credential signals, exact scam quotes, risk score, and
 * safe next steps.
 *
 * Deterministic — no LLM calls, no network, no randomness.
 */

const REQUIRED_RISK_FIELDS = [
  'url', 'hostname', 'risk', 'score', 'suspectedBrand', 'advice'
];

const FINDING_KEEP_FIELDS = ['type', 'label', 'evidence', 'weight'];

const NOISE_PATTERNS = [
  /\s{2,}/g,
  /[\r\n]+/g,
  /\t+/g,
];

function charCount(obj) {
  return JSON.stringify(obj).length;
}

function estimateTokens(text) {
  if (!text) return 0;
  const str = typeof text === 'string' ? text : JSON.stringify(text);
  return Math.ceil(str.length / 3.8);
}

function deduplicateFindings(findings) {
  const seen = new Set();
  return findings.filter((f) => {
    const key = `${(f.type || '').toLowerCase()}|${(f.label || '').toLowerCase()}|${(f.evidence || '').toLowerCase().slice(0, 50)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function truncateEvidence(evidence, maxLen = 120) {
  if (!evidence || evidence.length <= maxLen) return evidence;
  return evidence.slice(0, maxLen - 3) + '...';
}

function cleanText(text) {
  if (!text) return text;
  let cleaned = text;
  for (const pattern of NOISE_PATTERNS) {
    cleaned = cleaned.replace(pattern, ' ');
  }
  return cleaned.trim();
}

function compressFindings(findings, { maxFindings = 8, maxEvidenceLen = 120 } = {}) {
  if (!Array.isArray(findings) || findings.length === 0) return [];

  const deduped = deduplicateFindings(findings);

  const sorted = deduped.sort((a, b) => (b.weight || 0) - (a.weight || 0));

  const top = sorted.slice(0, maxFindings);

  return top.map((f) => {
    const compressed = {};
    for (const key of FINDING_KEEP_FIELDS) {
      if (f[key] !== undefined && f[key] !== null && f[key] !== '') {
        compressed[key] = key === 'evidence'
          ? truncateEvidence(cleanText(String(f[key])), maxEvidenceLen)
          : f[key];
      }
    }
    return compressed;
  });
}

function compressJurisdiction(jurisdiction) {
  if (!jurisdiction) return undefined;
  if (jurisdiction.country === 'Unknown' && jurisdiction.confidence === 'unknown') return undefined;
  return `${jurisdiction.country} (${jurisdiction.confidence})`;
}

/**
 * Deterministic risk-preserving compression of a case record for LLM context.
 *
 * Strips metadata, deduplicates findings, truncates evidence strings,
 * collapses whitespace, and removes non-risk fields — while preserving
 * every decision-critical fact the LLM needs to produce a grounded explanation.
 *
 * @param {object} caseRecord - Full normalized case record from caseStore
 * @param {object} [options] - Compression options
 * @param {number} [options.maxFindings=8] - Max findings to keep
 * @param {number} [options.maxEvidenceLen=120] - Max chars per evidence string
 * @returns {object} { compressed, metrics }
 */
function riskCompressEvidence(caseRecord, options = {}) {
  const { maxFindings = 8, maxEvidenceLen = 120 } = options;

  const rawChars = charCount(caseRecord);
  const rawTokens = estimateTokens(caseRecord);

  const compressed = {
    id: caseRecord.id,
    url: caseRecord.url,
    hostname: caseRecord.hostname,
    title: caseRecord.title ? cleanText(caseRecord.title).slice(0, 100) : undefined,
    risk: caseRecord.risk,
    score: caseRecord.score,
    brand: caseRecord.suspectedBrand,
    jurisdiction: compressJurisdiction(caseRecord.jurisdiction),
    findings: compressFindings(caseRecord.findings, { maxFindings, maxEvidenceLen }),
    advice: caseRecord.advice ? cleanText(caseRecord.advice).slice(0, 200) : undefined,
    safetyBoundary: 'Evidence only. No legal conclusions.'
  };

  Object.keys(compressed).forEach((k) => {
    if (compressed[k] === undefined || compressed[k] === null || compressed[k] === '') {
      delete compressed[k];
    }
  });

  const compressedChars = charCount(compressed);
  const compressedTokens = estimateTokens(compressed);

  const metrics = {
    raw: { chars: rawChars, estimatedTokens: rawTokens },
    compressed: { chars: compressedChars, estimatedTokens: compressedTokens },
    reduction: {
      chars: rawChars - compressedChars,
      charPercent: rawChars > 0 ? Math.round(((rawChars - compressedChars) / rawChars) * 100) : 0,
      tokens: rawTokens - compressedTokens,
      tokenPercent: rawTokens > 0 ? Math.round(((rawTokens - compressedTokens) / rawTokens) * 100) : 0
    },
    findingsKept: compressed.findings ? compressed.findings.length : 0,
    findingsDropped: (caseRecord.findings || []).length - (compressed.findings ? compressed.findings.length : 0),
    riskFieldsPreserved: REQUIRED_RISK_FIELDS.filter((f) => {
      if (f === 'suspectedBrand') return compressed.brand !== undefined;
      return compressed[f] !== undefined;
    }).length,
    riskFieldsTotal: REQUIRED_RISK_FIELDS.length
  };

  return { compressed, metrics };
}

/**
 * Verify that compressed evidence preserves all decision-critical fields.
 * Returns { valid, missing } where missing lists any risk fields that were lost.
 */
function verifyRiskPreservation(compressed, originalCaseRecord) {
  const missing = [];

  if (!compressed.url && originalCaseRecord.url) missing.push('url');
  if (!compressed.hostname && originalCaseRecord.hostname) missing.push('hostname');
  if (!compressed.risk && originalCaseRecord.risk) missing.push('risk');
  if (compressed.score === undefined && originalCaseRecord.score !== undefined) missing.push('score');
  if (!compressed.brand && originalCaseRecord.suspectedBrand && originalCaseRecord.suspectedBrand !== 'Unknown / needs review') missing.push('suspectedBrand');

  const origFindings = originalCaseRecord.findings || [];
  const compFindings = compressed.findings || [];
  if (origFindings.length > 0 && compFindings.length === 0) missing.push('findings');

  return { valid: missing.length === 0, missing };
}

module.exports = {
  riskCompressEvidence,
  verifyRiskPreservation,
  compressFindings,
  deduplicateFindings,
  truncateEvidence,
  cleanText,
  estimateTokens,
  charCount,
  REQUIRED_RISK_FIELDS
};
