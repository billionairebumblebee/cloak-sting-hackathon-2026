function renderMarkdownDossier(caseRecord) {
  const findings = (caseRecord.findings || [])
    .map((f) => `- **${f.label || f.type || 'Signal'}** (${f.type || 'unknown'}): ${f.evidence || 'observed'} — weight ${f.weight || 0}`)
    .join('\n') || '- No findings recorded.';

  const channels = (caseRecord.reportingChannels || [])
    .map((c) => `- **${c.name}**${c.url ? ` — ${c.url}` : ''}: ${c.use}`)
    .join('\n') || '- No reporting channels recorded.';

  const explanation = caseRecord.explanation
    ? `## Grounded Explanation\n\n` +
      `- Summary: ${caseRecord.explanation.summary || ''}\n` +
      `- Why it matters: ${caseRecord.explanation.whyItMatters || ''}\n` +
      `- Safe next steps: ${caseRecord.explanation.safeNextSteps || ''}\n` +
      `- Reporting note: ${caseRecord.explanation.reportingNote || ''}\n\n`
    : '';

  return `# cloak STING Evidence Dossier\n\n` +
    explanation +
    `## Case Summary\n\n` +
    `- Case ID: ${caseRecord.id}\n` +
    `- Created: ${caseRecord.createdAt}\n` +
    `- Risk: ${caseRecord.risk} (${caseRecord.score}/100)\n` +
    `- Page: ${caseRecord.title || 'Untitled'}\n` +
    `- URL: ${caseRecord.url}\n` +
    `- Hostname: ${caseRecord.hostname}\n` +
    `- Suspected impersonated brand: ${caseRecord.suspectedBrand}\n` +
    `- Jurisdiction clue: ${caseRecord.jurisdiction.country} (${caseRecord.jurisdiction.confidence}; ${caseRecord.jurisdiction.basis})\n\n` +
    `## Observed Scam Signals\n\n${findings}\n\n` +
    `## Recommended Safe Next Steps\n\n${caseRecord.advice || 'Verify through an official channel before continuing.'}\n\n` +
    `## Reporting Channels\n\n${channels}\n\n` +
    `## Victim / Family Notes\n\n${caseRecord.victimSafeNotes || '_No additional notes recorded._'}\n\n` +
    `## Safety Boundary\n\n${caseRecord.safetyBoundary}\n\n` +
    `## Evidence Handling\n\nThis dossier records observed page/audio evidence and detector findings. It should be reviewed by a human before submission to a bank, platform, or authority.\n`;
}

function renderJsonDossier(caseRecord) {
  return JSON.stringify(caseRecord, null, 2);
}

module.exports = { renderMarkdownDossier, renderJsonDossier };
