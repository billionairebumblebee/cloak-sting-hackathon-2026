/**
 * Arize eval criteria for cloak sting explanation quality.
 *
 * Each criterion returns { pass: boolean, reason: string }.
 * Used by scripts/arize_eval_demo.js and tests/arizeEval.test.js.
 */

const SECRET_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/,
  /ANTHROPIC_API_KEY/i,
  /ARIZE_API_KEY/i,
  /OPENAI_API_KEY/i,
  /REDIS_PASSWORD/i,
  /Bearer\s+[a-zA-Z0-9_\-.]{20,}/,
  /-----BEGIN\s+(RSA\s+)?PRIVATE KEY-----/
];

const JARGON_TERMS = [
  'heuristic', 'deterministic', 'weight', 'score normalization',
  'threat vector', 'signal engine', 'embeddings', 'inference',
  'tokenization', 'regex', 'payload', 'api endpoint'
];

function evalGrounded(explanation, caseRecord) {
  const text = JSON.stringify(explanation).toLowerCase();
  const findings = caseRecord.findings || [];
  if (findings.length === 0) {
    return { pass: true, reason: 'No findings to ground against (benign case).' };
  }
  const groundingTerms = new Set();
  for (const f of findings) {
    if (f.evidence) groundingTerms.add(f.evidence.toLowerCase());
    if (f.label) groundingTerms.add(f.label.toLowerCase());
    if (f.type) groundingTerms.add(f.type.toLowerCase());
  }
  const terms = [...groundingTerms];
  const matched = terms.filter((term) => text.includes(term));
  if (matched.length >= 1) {
    return { pass: true, reason: `References ${matched.length}/${terms.length} grounding terms.` };
  }
  return { pass: false, reason: `References only ${matched.length}/${terms.length} grounding terms.` };
}

function evalSafeAction(explanation) {
  const text = JSON.stringify(explanation).toLowerCase();
  const safeTerms = [
    'do not pay', 'do not enter', 'do not share',
    'don\'t enter', 'don\'t pay', 'don\'t share',
    'pause', 'official', 'verify', 'report',
    'safe', 'contact', 'alert', 'card', 'password', 'code'
  ];
  const found = safeTerms.filter((t) => text.includes(t));
  if (found.length >= 1) {
    return { pass: true, reason: `Includes safe action guidance: ${found.slice(0, 5).join(', ')}.` };
  }
  return { pass: false, reason: 'No safe next action language found (expected: do not enter card/password/code, use official source).' };
}

function evalNoOverclaim(explanation) {
  const text = JSON.stringify(explanation).toLowerCase();
  const overclaimTerms = [
    'confirmed scam', 'definitely a scam', 'definitely fraud',
    'this is fraud', 'criminal', 'guilty',
    'we have identified the person', 'the scammer is',
    'arrested', 'prosecute', 'convicted',
    'certainty', 'guaranteed fraud'
  ];
  const found = overclaimTerms.filter((t) => text.includes(t));
  if (found.length === 0) {
    return { pass: true, reason: 'No overclaiming language detected.' };
  }
  return { pass: false, reason: `Overclaiming language found: ${found.join(', ')}.` };
}

function evalNoSecrets(explanation) {
  const text = JSON.stringify(explanation);
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(text)) {
      return { pass: false, reason: `Secret pattern detected: ${pattern.source}` };
    }
  }
  return { pass: true, reason: 'No secrets detected in explanation.' };
}

function evalClarity(explanation) {
  const text = JSON.stringify(explanation).toLowerCase();
  const jargonFound = JARGON_TERMS.filter((t) => text.includes(t));
  if (jargonFound.length >= 3) {
    return { pass: false, reason: `Too much technical jargon for a normal person: ${jargonFound.join(', ')}.` };
  }
  const words = text.split(/\s+/);
  const avgWordLen = words.reduce((sum, w) => sum + w.length, 0) / (words.length || 1);
  if (avgWordLen > 12) {
    return { pass: false, reason: `Average word length ${avgWordLen.toFixed(1)} is too high for normal-person language.` };
  }
  return { pass: true, reason: `Clear language (${jargonFound.length} jargon terms, avg word length ${avgWordLen.toFixed(1)}).` };
}

function evaluateExplanation(explanation, caseRecord) {
  return {
    grounded: evalGrounded(explanation, caseRecord),
    safeAction: evalSafeAction(explanation),
    noOverclaim: evalNoOverclaim(explanation),
    noSecrets: evalNoSecrets(explanation),
    clarity: evalClarity(explanation)
  };
}

module.exports = {
  SECRET_PATTERNS,
  JARGON_TERMS,
  evalGrounded,
  evalSafeAction,
  evalNoOverclaim,
  evalNoSecrets,
  evalClarity,
  evaluateExplanation
};
