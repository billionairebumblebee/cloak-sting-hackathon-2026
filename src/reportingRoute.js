const AUTHORITY_CHANNELS = {
  FTC: {
    name: 'FTC ReportFraud',
    url: 'https://reportfraud.ftc.gov/',
    reason: 'Primary US consumer fraud reporting portal',
    howToFile: 'Visit reportfraud.ftc.gov, select the type of scam, and follow the guided form. Attach evidence from this report.'
  },
  IC3: {
    name: 'FBI Internet Crime Complaint Center (IC3)',
    url: 'https://www.ic3.gov/',
    reason: 'FBI portal for internet-enabled crime',
    howToFile: 'File a complaint at ic3.gov. Include the URL, scam details, and any financial loss information.'
  },
  CFPB: {
    name: 'Consumer Financial Protection Bureau',
    url: 'https://www.consumerfinance.gov/complaint/',
    reason: 'Reports involving banks, lenders, or financial products',
    howToFile: 'Submit a complaint at consumerfinance.gov/complaint. Select your financial product and describe the issue.'
  },
  FCC: {
    name: 'Federal Communications Commission',
    url: 'https://consumercomplaints.fcc.gov/',
    reason: 'Unwanted calls, spoofed numbers, and phone-based scams',
    howToFile: 'File a complaint at consumercomplaints.fcc.gov. Include the phone number, date/time of the call, and transcript if available.'
  },
  CARRIER_7726: {
    name: 'Forward to 7726 (SPAM)',
    url: '',
    reason: 'Report scam texts/calls directly to your wireless carrier',
    howToFile: 'Forward the suspicious text to 7726 (SPAM). Your carrier will investigate and may block the number.'
  },
  SEC: {
    name: 'Securities and Exchange Commission',
    url: 'https://www.sec.gov/tcr',
    reason: 'Investment fraud, securities violations, and crypto investment scams',
    howToFile: 'Submit a tip at sec.gov/tcr. Provide details about the investment scheme, promises made, and any wallet addresses involved.'
  },
  CFTC: {
    name: 'Commodity Futures Trading Commission',
    url: 'https://www.cftc.gov/complaint',
    reason: 'Crypto commodity fraud and futures/options scams',
    howToFile: 'File a complaint at cftc.gov/complaint. Include details about the crypto asset, platform, and any transactions.'
  },
  IC3_ROMANCE: {
    name: 'FBI IC3 — Romance Fraud',
    url: 'https://www.ic3.gov/',
    reason: 'Romance scams and confidence fraud reported through IC3',
    howToFile: 'File at ic3.gov, select "Romance Scam" as the crime type. Include communication history and any payment details.'
  },
  IDENTITY_THEFT: {
    name: 'IdentityTheft.gov',
    url: 'https://www.identitytheft.gov/',
    reason: 'Identity theft recovery and reporting',
    howToFile: 'Visit identitytheft.gov to create a personal recovery plan. The site generates an FTC Identity Theft Report and recovery steps.'
  },
  ECONSUMER: {
    name: 'eConsumer.gov (International)',
    url: 'https://econsumer.gov/',
    reason: 'Cross-border internet fraud involving international entities',
    howToFile: 'File a complaint at econsumer.gov. This portal is shared across 40+ countries for international fraud investigations.'
  }
};

const BRAND_ABUSE_FORMS = {
  paypal: { name: 'PayPal Abuse Report', url: 'https://www.paypal.com/us/security/report-suspicious-messages' },
  apple: { name: 'Apple Report Phishing', url: 'https://support.apple.com/en-us/102568' },
  microsoft: { name: 'Microsoft Report Abuse', url: 'https://www.microsoft.com/en-us/concern/scam' },
  google: { name: 'Google Report Phishing', url: 'https://safebrowsing.google.com/safebrowsing/report_phish/' },
  amazon: { name: 'Amazon Report Fraud', url: 'https://www.amazon.com/gp/help/customer/display.html?nodeId=G4YFYCCNUSENA23B' },
  usps: { name: 'USPS Report Mail Fraud', url: 'https://www.uspis.gov/report' },
  fedex: { name: 'FedEx Report Fraud', url: 'https://www.fedex.com/en-us/trust-center/report-fraud.html' },
  dhl: { name: 'DHL Report Fraud', url: 'https://www.dhl.com/us-en/home/footer/fraud-awareness.html' },
  bank: { name: 'Contact your bank/card issuer', url: '' },
  metamask: { name: 'MetaMask Report Phishing', url: 'https://github.com/MetaMask/eth-phishing-detect/issues/new' }
};

const DISCLAIMER = 'STING does not submit reports on your behalf. These are official channels where you can file.';

function inferScamCategories(caseRecord) {
  const categories = new Set();
  const findings = caseRecord.findings || [];
  const allText = [
    caseRecord.title || '',
    caseRecord.url || '',
    caseRecord.hostname || '',
    ...findings.map((f) => `${f.type || ''} ${f.label || ''} ${f.evidence || ''}`)
  ].join(' ').toLowerCase();

  categories.add('general');

  if (findings.some((f) => f.type === 'payment') || /bank|credit card|wire transfer|zelle|cash app/i.test(allText)) {
    categories.add('financial');
  }
  if (findings.some((f) => f.type === 'crypto-harvest') || /crypto|bitcoin|ethereum|seed phrase|wallet|defi/i.test(allText)) {
    categories.add('crypto');
  }
  if (findings.some((f) => f.type === 'ransom') || /ransom|hostage|kidnap|phone.*threat/i.test(allText)) {
    categories.add('phone');
  }
  if (/romance|dating|love|relationship|lonely/i.test(allText)) {
    categories.add('romance');
  }
  if (/identity|ssn|social security|driver.?s? license|passport number/i.test(allText)) {
    categories.add('identity');
  }
  if (findings.some((f) => f.type === 'impersonation') || /impersonat|brand|fake.*support/i.test(allText)) {
    categories.add('impersonation');
  }

  const jurisdiction = caseRecord.jurisdiction || {};
  if (jurisdiction.country && !jurisdiction.country.includes('United States') && jurisdiction.country !== 'Unknown') {
    categories.add('international');
  }

  return categories;
}

function detectBrandFromCase(caseRecord) {
  const haystack = [
    caseRecord.hostname || '',
    caseRecord.title || '',
    caseRecord.suspectedBrand || '',
    ...(caseRecord.findings || []).map((f) => f.evidence || '')
  ].join(' ').toLowerCase();

  const brands = Object.keys(BRAND_ABUSE_FORMS);
  return brands.filter((b) => haystack.includes(b));
}

function getReportingChannels(caseRecord) {
  const categories = inferScamCategories(caseRecord);
  const channels = [];

  if (categories.has('general')) {
    channels.push({ ...AUTHORITY_CHANNELS.FTC });
    channels.push({ ...AUTHORITY_CHANNELS.IC3 });
  }
  if (categories.has('financial')) {
    channels.push({ ...AUTHORITY_CHANNELS.CFPB });
  }
  if (categories.has('phone')) {
    channels.push({ ...AUTHORITY_CHANNELS.FCC });
    channels.push({ ...AUTHORITY_CHANNELS.CARRIER_7726 });
  }
  if (categories.has('crypto')) {
    channels.push({ ...AUTHORITY_CHANNELS.SEC });
    channels.push({ ...AUTHORITY_CHANNELS.CFTC });
  }
  if (categories.has('romance')) {
    channels.push({ ...AUTHORITY_CHANNELS.IC3_ROMANCE });
  }
  if (categories.has('identity')) {
    channels.push({ ...AUTHORITY_CHANNELS.IDENTITY_THEFT });
  }
  if (categories.has('international')) {
    channels.push({ ...AUTHORITY_CHANNELS.ECONSUMER });
  }
  if (categories.has('impersonation')) {
    const brands = detectBrandFromCase(caseRecord);
    for (const brand of brands) {
      const form = BRAND_ABUSE_FORMS[brand];
      channels.push({
        name: form.name,
        url: form.url,
        reason: `Report impersonation of ${brand}`,
        howToFile: form.url ? `Visit ${form.url} and follow their abuse reporting process.` : 'Contact the brand directly through their official website.'
      });
    }
  }

  return channels;
}

function buildReportPacket(caseRecord, channels) {
  const signals = (caseRecord.findings || []).map((f) => ({
    type: f.type,
    label: f.label,
    evidence: f.evidence,
    weight: f.weight
  }));

  return {
    generatedAt: new Date().toISOString(),
    caseId: caseRecord.id || 'unknown',
    summary: buildSummary(caseRecord),
    evidence: {
      url: caseRecord.url || '',
      hostname: caseRecord.hostname || '',
      signals,
      screenshots_note: caseRecord.evidence && caseRecord.evidence.screenshotCaptured
        ? 'Screenshot captured and stored with case record.'
        : 'No screenshot captured. Consider taking a screenshot before the page is taken down.'
    },
    recommendedChannels: channels.map((ch) => ({
      name: ch.name,
      url: ch.url,
      reason: ch.reason,
      howToFile: ch.howToFile
    })),
    disclaimer: DISCLAIMER,
    userNote: 'Copy this report and paste into the forms above.'
  };
}

function buildSummary(caseRecord) {
  const risk = caseRecord.risk || 'unknown';
  const score = caseRecord.score || 0;
  const brand = caseRecord.suspectedBrand || 'Unknown';
  const findingCount = (caseRecord.findings || []).length;
  const hostname = caseRecord.hostname || 'unknown site';
  const types = [...new Set((caseRecord.findings || []).map((f) => f.type))];

  let summary = `STING detected a ${risk}-risk scam (score ${score}/100) on "${hostname}".`;
  summary += ` ${findingCount} signal${findingCount !== 1 ? 's' : ''} identified`;
  if (types.length > 0) {
    summary += ` across categories: ${types.join(', ')}`;
  }
  summary += '.';
  if (brand && brand !== 'Unknown / needs review') {
    summary += ` Suspected brand impersonation: ${brand}.`;
  }
  return summary;
}

function getAuthorityLinks(channels) {
  return channels
    .filter((ch) => ch.url)
    .map((ch) => ({
      name: ch.name,
      url: ch.url,
      reason: ch.reason
    }));
}

function formatReportPlainText(packet) {
  const lines = [];
  lines.push('='.repeat(60));
  lines.push('STING AUTHORITY REPORT');
  lines.push('='.repeat(60));
  lines.push('');
  lines.push(`Generated: ${packet.generatedAt}`);
  lines.push(`Case ID:   ${packet.caseId}`);
  lines.push('');
  lines.push('--- SUMMARY ---');
  lines.push(packet.summary);
  lines.push('');
  lines.push('--- EVIDENCE ---');
  lines.push(`URL:      ${packet.evidence.url}`);
  lines.push(`Hostname: ${packet.evidence.hostname}`);
  lines.push(`Signals:  ${packet.evidence.signals.length} detected`);
  for (const sig of packet.evidence.signals) {
    lines.push(`  - [${sig.type}] ${sig.label}: "${sig.evidence}" (weight ${sig.weight})`);
  }
  lines.push(`Note:     ${packet.evidence.screenshots_note}`);
  lines.push('');
  lines.push('--- RECOMMENDED REPORTING CHANNELS ---');
  for (let i = 0; i < packet.recommendedChannels.length; i++) {
    const ch = packet.recommendedChannels[i];
    lines.push(`${i + 1}. ${ch.name}`);
    if (ch.url) lines.push(`   URL: ${ch.url}`);
    lines.push(`   Why: ${ch.reason}`);
    lines.push(`   How: ${ch.howToFile}`);
    lines.push('');
  }
  lines.push('--- DISCLAIMER ---');
  lines.push(packet.disclaimer);
  lines.push('');
  lines.push('--- NOTE ---');
  lines.push(packet.userNote);
  lines.push('');
  lines.push('='.repeat(60));
  return lines.join('\n');
}

module.exports = {
  getReportingChannels,
  buildReportPacket,
  getAuthorityLinks,
  formatReportPlainText,
  AUTHORITY_CHANNELS,
  BRAND_ABUSE_FORMS,
  DISCLAIMER
};
