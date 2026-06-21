const AUTHORITY_REGISTRY = {
  FTC: {
    name: 'FTC (Federal Trade Commission)',
    url: 'https://reportfraud.ftc.gov',
    howToFile: 'Visit reportfraud.ftc.gov, click "Report Now", and follow the guided questionnaire. Paste your STING report into the description field.',
  },
  IC3: {
    name: 'FBI IC3 (Internet Crime Complaint Center)',
    url: 'https://www.ic3.gov',
    howToFile: 'Go to ic3.gov, click "File a Complaint", create an account or log in, and complete the online form with your evidence.',
  },
  CFPB: {
    name: 'CFPB (Consumer Financial Protection Bureau)',
    url: 'https://www.consumerfinance.gov/complaint/',
    howToFile: 'Submit a complaint at consumerfinance.gov/complaint. Select the relevant financial product and describe the scam.',
  },
  FCC: {
    name: 'FCC (Federal Communications Commission)',
    url: 'https://consumercomplaints.fcc.gov',
    howToFile: 'File a complaint at consumercomplaints.fcc.gov. Select "Phone" as the category and describe the unwanted call or text.',
  },
  SEC: {
    name: 'SEC (Securities and Exchange Commission)',
    url: 'https://www.sec.gov/tcr',
    howToFile: 'Submit a tip at sec.gov/tcr. Describe the fraudulent investment scheme and include URLs, wallet addresses, and any communications.',
  },
  CFTC: {
    name: 'CFTC (Commodity Futures Trading Commission)',
    url: 'https://www.cftc.gov/complaint',
    howToFile: 'File at cftc.gov/complaint. Report crypto or commodity fraud with transaction details and wallet addresses.',
  },
  IDENTITY_THEFT: {
    name: 'IdentityTheft.gov',
    url: 'https://www.identitytheft.gov',
    howToFile: 'Visit identitytheft.gov to report and create a personalized recovery plan. The site will generate an FTC Identity Theft Report.',
  },
  ECONSUMER: {
    name: 'eConsumer.gov (International)',
    url: 'https://econsumer.gov',
    howToFile: 'Report cross-border scams at econsumer.gov. Your complaint is shared with consumer protection agencies in 40+ countries.',
  },
  CARRIER_7726: {
    name: 'Forward to 7726 (SPAM)',
    url: '',
    howToFile: 'Forward the suspicious text message to 7726 (SPAM). Your carrier will investigate the sender.',
  },
  IC3_ROMANCE: {
    name: 'FBI IC3 Romance Fraud Unit',
    url: 'https://www.ic3.gov',
    howToFile: 'File at ic3.gov and select "Romance Scam" as the crime type. Include all communication history and financial transactions.',
  },
};

const BRAND_ABUSE_URLS = {
  google: { name: 'Google Abuse Report', url: 'https://safebrowsing.google.com/safebrowsing/report_phish/' },
  apple: { name: 'Apple Phishing Report', url: 'https://support.apple.com/en-us/102568' },
  amazon: { name: 'Amazon Fraud Report', url: 'https://www.amazon.com/gp/help/customer/display.html?nodeId=G508510' },
  microsoft: { name: 'Microsoft Phishing Report', url: 'https://www.microsoft.com/en-us/concern/scam' },
  paypal: { name: 'PayPal Fraud Report', url: 'https://www.paypal.com/us/security/report-suspicious-messages' },
  usps: { name: 'USPS Fraud Report', url: 'https://www.uspis.gov/report' },
  fedex: { name: 'FedEx Fraud Report', url: 'https://www.fedex.com/en-us/trust-center/report-fraud.html' },
  dhl: { name: 'DHL Fraud Report', url: 'https://www.dhl.com/us-en/home/footer/fraud-awareness.html' },
};

function detectSignalTypes(caseRecord) {
  const findings = caseRecord.findings || [];
  const types = new Set();
  for (const f of findings) {
    if (f.type) types.add(f.type);
    const label = (f.label || '').toLowerCase();
    const evidence = (f.evidence || '').toLowerCase();
    if (/crypto|bitcoin|wallet|seed phrase|private key/.test(evidence) || /crypto/.test(label)) types.add('crypto');
    if (/bank|financial|payment/.test(label) || /bank/.test(evidence)) types.add('financial');
    if (/phone|vishing|call|robocall/.test(label) || /phone|call/.test(evidence)) types.add('phone');
    if (/romance/.test(label) || /romance|dating|love/.test(evidence)) types.add('romance');
    if (/identity|credential|password|ssn|social security/.test(evidence)) types.add('identity');
    if (/ransom|hostage|kidnap/.test(evidence) || f.type === 'ransom') types.add('ransom');
    if (/impersonation/.test(f.type) || /impersonat/.test(label)) types.add('impersonation');
  }
  return types;
}

function detectBrandFromCase(caseRecord) {
  const haystack = [
    caseRecord.hostname || '',
    caseRecord.url || '',
    caseRecord.suspectedBrand || '',
    ...(caseRecord.findings || []).map((f) => `${f.label || ''} ${f.evidence || ''}`),
  ].join(' ').toLowerCase();
  const matched = [];
  for (const [brand] of Object.entries(BRAND_ABUSE_URLS)) {
    if (haystack.includes(brand)) matched.push(brand);
  }
  return matched;
}

function isInternational(caseRecord) {
  const jurisdiction = caseRecord.jurisdiction;
  if (!jurisdiction) return false;
  const country = (jurisdiction.country || '').toLowerCase();
  return country !== '' && !country.includes('united states') && country !== 'unknown';
}

function getReportingChannels(caseRecord) {
  const signalTypes = detectSignalTypes(caseRecord);
  const channels = [];

  channels.push({ key: 'FTC', reason: 'Primary US consumer fraud reporting authority' });
  channels.push({ key: 'IC3', reason: 'FBI internet crime complaint center for all online scams' });

  if (signalTypes.has('financial') || signalTypes.has('impersonation') || signalTypes.has('payment')) {
    channels.push({ key: 'CFPB', reason: 'Financial fraud or bank impersonation detected' });
  }

  if (signalTypes.has('phone') || signalTypes.has('ransom') || signalTypes.has('deepfake') || signalTypes.has('social-engineering')) {
    channels.push({ key: 'FCC', reason: 'Phone-based scam or vishing detected' });
    channels.push({ key: 'CARRIER_7726', reason: 'Forward suspicious texts/calls to your carrier' });
  }

  if (signalTypes.has('crypto') || signalTypes.has('crypto-harvest')) {
    channels.push({ key: 'SEC', reason: 'Crypto or investment fraud detected' });
    channels.push({ key: 'CFTC', reason: 'Crypto commodity fraud detected' });
  }

  if (signalTypes.has('romance')) {
    channels.push({ key: 'IC3_ROMANCE', reason: 'Romance scam indicators detected' });
  }

  if (signalTypes.has('identity') || signalTypes.has('credential')) {
    channels.push({ key: 'IDENTITY_THEFT', reason: 'Identity theft or credential harvesting detected' });
  }

  if (isInternational(caseRecord)) {
    channels.push({ key: 'ECONSUMER', reason: `International jurisdiction detected: ${caseRecord.jurisdiction.country}` });
  }

  const brands = detectBrandFromCase(caseRecord);
  for (const brand of brands) {
    const info = BRAND_ABUSE_URLS[brand];
    channels.push({ key: `BRAND_${brand.toUpperCase()}`, reason: `Impersonating ${brand} — report to their abuse team`, brandInfo: info });
  }

  return channels;
}

function buildReportPacket(caseRecord, channels) {
  const recommendedChannels = channels.map((ch) => {
    if (ch.brandInfo) {
      return {
        name: ch.brandInfo.name,
        url: ch.brandInfo.url,
        reason: ch.reason,
        howToFile: `Report the phishing/scam page to ${ch.brandInfo.name} using the link above.`,
      };
    }
    const authority = AUTHORITY_REGISTRY[ch.key];
    if (!authority) return null;
    return {
      name: authority.name,
      url: authority.url,
      reason: ch.reason,
      howToFile: authority.howToFile,
    };
  }).filter(Boolean);

  const signals = (caseRecord.findings || []).map((f) => ({
    type: f.type,
    label: f.label,
    evidence: f.evidence,
    weight: f.weight,
  }));

  return {
    generatedAt: new Date().toISOString(),
    caseId: caseRecord.id || '',
    summary: buildSummary(caseRecord),
    evidence: {
      url: caseRecord.url || '',
      hostname: caseRecord.hostname || '',
      signals,
      screenshots_note: caseRecord.evidence?.screenshotCaptured
        ? 'Screenshot captured and stored locally.'
        : 'No screenshot was captured for this scan.',
    },
    recommendedChannels,
    disclaimer: 'This report was generated by STING scam detection software. Evidence has not been verified by law enforcement.',
    userNote: 'You can copy this report and paste it into the reporting forms above.',
  };
}

function buildSummary(caseRecord) {
  const risk = caseRecord.risk || 'unknown';
  const score = caseRecord.score || 0;
  const hostname = caseRecord.hostname || 'an unknown site';
  const findingCount = (caseRecord.findings || []).length;
  const topSignals = (caseRecord.findings || [])
    .sort((a, b) => (b.weight || 0) - (a.weight || 0))
    .slice(0, 3)
    .map((f) => f.label)
    .join(', ');

  return `STING detected a ${risk}-risk scam (score ${score}/100) on ${hostname}. ` +
    `${findingCount} warning signal(s) were found${topSignals ? ': ' + topSignals : ''}. ` +
    `${caseRecord.advice || 'Verify through official channels before taking any action.'}`;
}

function getAuthorityLinks(channels) {
  const links = {};
  for (const ch of channels) {
    if (ch.brandInfo) {
      links[ch.brandInfo.name] = ch.brandInfo.url;
      continue;
    }
    const authority = AUTHORITY_REGISTRY[ch.key];
    if (authority && authority.url) {
      links[authority.name] = authority.url;
    }
  }
  return links;
}

function formatReportPlainText(packet) {
  const lines = [
    '========================================',
    '  STING — Scam Report for Authorities',
    '========================================',
    '',
    `Generated: ${packet.generatedAt}`,
    `Case ID:   ${packet.caseId}`,
    '',
    '--- SUMMARY ---',
    packet.summary,
    '',
    '--- EVIDENCE ---',
    `URL:      ${packet.evidence.url}`,
    `Hostname: ${packet.evidence.hostname}`,
    `Signals:  ${packet.evidence.signals.length} detected`,
  ];

  for (const signal of packet.evidence.signals) {
    lines.push(`  - [${signal.type}] ${signal.label}: ${signal.evidence} (weight: ${signal.weight})`);
  }

  lines.push('', `Screenshots: ${packet.evidence.screenshots_note}`);
  lines.push('', '--- RECOMMENDED REPORTING CHANNELS ---');

  for (const ch of packet.recommendedChannels) {
    lines.push('');
    lines.push(`  ${ch.name}`);
    if (ch.url) lines.push(`  URL: ${ch.url}`);
    lines.push(`  Why: ${ch.reason}`);
    lines.push(`  How: ${ch.howToFile}`);
  }

  lines.push('', '--- DISCLAIMER ---', packet.disclaimer);
  lines.push('', '--- NOTE ---', packet.userNote);
  lines.push('', '========================================');
  return lines.join('\n');
}

if (typeof module !== 'undefined') {
  module.exports = { getReportingChannels, buildReportPacket, getAuthorityLinks, formatReportPlainText };
}
