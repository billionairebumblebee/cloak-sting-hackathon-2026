const crypto = require('node:crypto');

/**
 * Family Rescue — shareable receipts for family members affected by scam encounters.
 * Produces plain-English summaries with no jargon.
 */

function receiptId() {
  return `receipt_${crypto.randomBytes(8).toString('hex')}`;
}

function generateRescueReceipt(scanResult) {
  const now = new Date().toISOString();
  const url = scanResult?.url || '';
  let hostname = scanResult?.hostname || '';
  if (!hostname && url) {
    try { hostname = new URL(url).hostname; } catch (_) {}
  }

  const threatLevel = scanResult?.risk || scanResult?.threatLevel || 'unknown';
  const signals = Array.isArray(scanResult?.findings)
    ? scanResult.findings.map((f) => f.label || f.type || 'signal')
    : [];

  const summary = buildPlainSummary(threatLevel, hostname, signals);
  const safeNextSteps = buildSafeNextSteps(threatLevel, scanResult);

  return {
    id: receiptId(),
    timestamp: now,
    url,
    hostname,
    threatLevel,
    signals,
    summary,
    safeNextSteps
  };
}

function buildPlainSummary(threatLevel, hostname, signals) {
  if (threatLevel === 'high') {
    const site = hostname || 'this website';
    return `This site (${site}) showed strong signs of a scam. Do not share personal info or money.`;
  }
  if (threatLevel === 'medium') {
    const site = hostname || 'this website';
    return `This site (${site}) has some warning signs. Verify before taking action.`;
  }
  return 'No strong scam indicators were found, but stay cautious online.';
}

function buildSafeNextSteps(threatLevel, scanResult) {
  const steps = [];
  if (threatLevel === 'high' || threatLevel === 'medium') {
    steps.push('Do not click links or download files from this site.');
    steps.push('Do not enter passwords, codes, or payment details.');
    steps.push('Contact the real company directly using their official website or phone number.');
  }
  if (threatLevel === 'high') {
    steps.push('If you already shared information, contact your bank or card provider immediately.');
    steps.push('Consider reporting this to the FTC at reportfraud.ftc.gov.');
  }
  if (steps.length === 0) {
    steps.push('Stay alert when asked for personal info or money online.');
    steps.push('When in doubt, verify by calling the company directly.');
  }
  return steps;
}

function formatReceiptPlainText(receipt) {
  const lines = [
    `--- Scan Receipt ---`,
    `Date: ${receipt.timestamp}`,
    `Site: ${receipt.hostname || receipt.url || 'Unknown'}`,
    `Threat Level: ${receipt.threatLevel}`,
    '',
    `Summary: ${receipt.summary}`,
    '',
    'Safe Next Steps:'
  ];
  for (const step of receipt.safeNextSteps) {
    lines.push(`  • ${step}`);
  }
  if (receipt.signals.length > 0) {
    lines.push('');
    lines.push('Warning Signs Found:');
    for (const signal of receipt.signals) {
      lines.push(`  - ${signal}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

module.exports = { generateRescueReceipt, formatReceiptPlainText };
