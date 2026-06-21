const SAFE_SYSTEM_PROMPT = [
  'You write calm consumer-safety explanations from deterministic scam findings.',
  'You do not identify private people, claim guilt, or invent evidence.',
  'Use only the provided case fields and findings.',
  'Return compact JSON with keys: summary, whyItMatters, safeNextSteps, reportingNote.'
].join(' ');

function buildGroundedExplanation(caseRecord) {
  const findingLabels = (caseRecord.findings || []).map((f) => f.label || f.type || 'Signal');
  const topFindings = findingLabels.slice(0, 3).join(', ') || 'no strong detector finding';
  const risk = `${caseRecord.risk || 'unknown'} risk (${Number(caseRecord.score || 0)}/100)`;
  return {
    provider: 'deterministic-local',
    summary: `cloak STING marked this as ${risk} based on observed signals: ${topFindings}.`,
    whyItMatters: 'The warning is based on page text, URL/domain patterns, payment or credential pressure, and other observed evidence — not on guessing who is behind it.',
    safeNextSteps: caseRecord.advice || 'Pause, do not share money/passwords/codes, and verify through an official app, typed website, or phone number from a trusted source.',
    reportingNote: 'If you report it, include the case ID, URL, timestamp, observed signals, and any screenshot/transcript you personally captured.'
  };
}

function compactCaseForPrompt(caseRecord) {
  return {
    caseId: caseRecord.id,
    source: caseRecord.source,
    url: caseRecord.url,
    hostname: caseRecord.hostname,
    title: caseRecord.title,
    risk: caseRecord.risk,
    score: caseRecord.score,
    suspectedBrand: caseRecord.suspectedBrand,
    jurisdiction: caseRecord.jurisdiction,
    findings: (caseRecord.findings || []).map((finding) => ({
      type: finding.type,
      label: finding.label,
      evidence: finding.evidence,
      weight: finding.weight
    })),
    advice: caseRecord.advice,
    safetyBoundary: caseRecord.safetyBoundary
  };
}

async function explainWithAnthropic(caseRecord, { env = process.env, fetchImpl = fetch } = {}) {
  const apiKey = env.ANTHROPIC_API_KEY || env.CLAUDE_API_KEY;
  if (!apiKey) {
    return buildGroundedExplanation(caseRecord);
  }

  const response = await fetchImpl('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': env.ANTHROPIC_VERSION || '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest',
      max_tokens: 500,
      temperature: 0.2,
      system: SAFE_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Explain this scam-risk case for a normal person. Stay grounded in this JSON only.\n${JSON.stringify(compactCaseForPrompt(caseRecord), null, 2)}`
      }]
    })
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    const errMsg = `Anthropic request failed: ${response.status} ${text}`.trim().slice(0, 300);
    try {
      const { captureError } = require('./sentry.js');
      captureError(new Error(errMsg), { component: 'anthropic-explain', caseId: caseRecord.id }).catch(() => {});
    } catch (_) {}
    return {
      ...buildGroundedExplanation(caseRecord),
      provider: 'deterministic-local-after-anthropic-error',
      anthropicError: errMsg
    };
  }

  const data = await response.json();
  const text = (data.content || []).map((item) => item.text || '').join('\n').trim();
  const parsed = parseJsonObject(text);
  if (!parsed) {
    return {
      ...buildGroundedExplanation(caseRecord),
      provider: 'deterministic-local-after-unparseable-anthropic',
      anthropicText: text.slice(0, 500)
    };
  }

  return {
    provider: 'anthropic',
    summary: String(parsed.summary || ''),
    whyItMatters: String(parsed.whyItMatters || ''),
    safeNextSteps: String(parsed.safeNextSteps || ''),
    reportingNote: String(parsed.reportingNote || ''),
    model: data.model || env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest'
  };
}

function parseJsonObject(text) {
  if (!text) return null;
  const trimmed = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  try { return JSON.parse(trimmed); } catch (_) {}
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch (_) { return null; }
}

module.exports = {
  SAFE_SYSTEM_PROMPT,
  buildGroundedExplanation,
  compactCaseForPrompt,
  explainWithAnthropic
};
