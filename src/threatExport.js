/**
 * Threat intelligence export for Cloak Sting.
 *
 * Generates structured threat intelligence reports in multiple formats:
 *  - STIX 2.1 (Structured Threat Information Expression)
 *  - CSV (for spreadsheet analysis)
 *  - Human-readable summary
 *
 * These exports enable law enforcement, banks, and platform abuse teams
 * to action the evidence Cloak Sting collects.
 */

function generateStixBundle(caseRecord) {
  const now = new Date().toISOString();
  const stixId = `indicator--${caseRecord.id}`;

  const objects = [];

  // Identity — the reporter (Cloak Sting)
  objects.push({
    type: 'identity',
    spec_version: '2.1',
    id: 'identity--cloak-sting-detector',
    created: now,
    modified: now,
    name: 'Cloak Sting Scam Detector',
    identity_class: 'system',
    description: 'Automated scam detection system from UC Berkeley AI Hackathon 2026'
  });

  // Indicator — the scam signals
  objects.push({
    type: 'indicator',
    spec_version: '2.1',
    id: stixId,
    created: caseRecord.createdAt || now,
    modified: now,
    name: `Scam indicator: ${caseRecord.suspectedBrand || 'Unknown'} impersonation`,
    description: `Risk ${caseRecord.risk} (${caseRecord.score}/100). ${caseRecord.findings.length} signals detected.`,
    indicator_types: mapToStixTypes(caseRecord),
    pattern: buildStixPattern(caseRecord),
    pattern_type: 'stix',
    valid_from: caseRecord.createdAt || now,
    labels: [`risk:${caseRecord.risk}`, `brand:${caseRecord.suspectedBrand || 'unknown'}`],
    created_by_ref: 'identity--cloak-sting-detector'
  });

  // Observable — the URL
  if (caseRecord.url) {
    objects.push({
      type: 'url',
      spec_version: '2.1',
      id: `url--${hashString(caseRecord.url)}`,
      value: caseRecord.url
    });
  }

  // Observable — the domain
  if (caseRecord.hostname) {
    objects.push({
      type: 'domain-name',
      spec_version: '2.1',
      id: `domain-name--${hashString(caseRecord.hostname)}`,
      value: caseRecord.hostname
    });
  }

  // Note — the evidence findings
  const findingsSummary = (caseRecord.findings || [])
    .map((f) => `[${f.type}] ${f.label}: ${f.evidence} (weight: ${f.weight})`)
    .join('\n');

  objects.push({
    type: 'note',
    spec_version: '2.1',
    id: `note--${hashString(caseRecord.id + '-findings')}`,
    created: now,
    modified: now,
    content: `Scam Signal Analysis:\n${findingsSummary}\n\nAdvice: ${caseRecord.advice || ''}`,
    object_refs: [stixId],
    created_by_ref: 'identity--cloak-sting-detector'
  });

  return {
    type: 'bundle',
    id: `bundle--${hashString(caseRecord.id)}`,
    objects
  };
}

function mapToStixTypes(caseRecord) {
  const types = new Set();
  for (const f of caseRecord.findings || []) {
    switch (f.type) {
      case 'domain': case 'typosquat': case 'combosquat': case 'homoglyph':
        types.add('malicious-activity');
        break;
      case 'payment': case 'crypto-harvest':
        types.add('malicious-activity');
        break;
      case 'impersonation':
        types.add('attribution');
        break;
      case 'credential': case 'form-field':
        types.add('malicious-activity');
        break;
      default:
        types.add('anomalous-activity');
    }
  }
  return [...types];
}

function buildStixPattern(caseRecord) {
  if (caseRecord.hostname) {
    return `[domain-name:value = '${caseRecord.hostname}']`;
  }
  if (caseRecord.url) {
    return `[url:value = '${caseRecord.url}']`;
  }
  return "[file:name = 'unknown']";
}

function hashString(input) {
  let hash = 0;
  const str = String(input);
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

function generateCsv(caseRecords) {
  const headers = ['Case ID', 'Risk', 'Score', 'URL', 'Hostname', 'Brand', 'Jurisdiction', 'Finding Count', 'Top Signal', 'Created At'];
  const rows = [headers.join(',')];

  const records = Array.isArray(caseRecords) ? caseRecords : [caseRecords];
  for (const c of records) {
    const topSignal = (c.findings || [])[0];
    rows.push([
      csvEscape(c.id),
      csvEscape(c.risk),
      c.score,
      csvEscape(c.url),
      csvEscape(c.hostname),
      csvEscape(c.suspectedBrand),
      csvEscape(c.jurisdiction?.country || 'Unknown'),
      (c.findings || []).length,
      csvEscape(topSignal ? `${topSignal.label}: ${topSignal.evidence}` : ''),
      csvEscape(c.createdAt)
    ].join(','));
  }

  return rows.join('\n');
}

function csvEscape(value) {
  const str = String(value || '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function generateHumanSummary(caseRecord) {
  const lines = [
    `CLOAK STING — THREAT INTELLIGENCE REPORT`,
    `═══════════════════════════════════════`,
    ``,
    `Case: ${caseRecord.id}`,
    `Date: ${caseRecord.createdAt}`,
    `Risk: ${(caseRecord.risk || '').toUpperCase()} (${caseRecord.score}/100)`,
    `URL: ${caseRecord.url || 'N/A'}`,
    `Domain: ${caseRecord.hostname || 'N/A'}`,
    `Suspected brand: ${caseRecord.suspectedBrand || 'Unknown'}`,
    `Jurisdiction: ${caseRecord.jurisdiction?.country || 'Unknown'}`,
    ``,
    `SIGNALS DETECTED (${(caseRecord.findings || []).length}):`,
  ];

  for (const f of caseRecord.findings || []) {
    lines.push(`  • [${f.type}] ${f.label} — "${f.evidence}" (weight: ${f.weight})`);
  }

  lines.push('');
  lines.push(`RECOMMENDED ACTION:`);
  lines.push(`  ${caseRecord.advice || 'Verify through official channels.'}`);
  lines.push('');
  lines.push(`REPORTING CHANNELS:`);
  for (const ch of caseRecord.reportingChannels || []) {
    lines.push(`  • ${ch.name}${ch.url ? ` — ${ch.url}` : ''}`);
  }
  lines.push('');
  lines.push(`SAFETY: ${caseRecord.safetyBoundary || 'Evidence record only.'}`);

  return lines.join('\n');
}

module.exports = {
  generateStixBundle,
  generateCsv,
  generateHumanSummary,
  hashString,
  csvEscape
};
