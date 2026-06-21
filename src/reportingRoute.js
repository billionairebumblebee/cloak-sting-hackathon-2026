/**
 * Reporting Route — determines appropriate reporting channels for a scam case
 * and assembles an evidence packet. Does NOT submit anything to authorities.
 */

const CHANNELS = {
  ftc: { name: 'FTC ReportFraud', url: 'https://reportfraud.ftc.gov/', type: 'consumer-fraud' },
  ic3: { name: 'FBI IC3', url: 'https://www.ic3.gov/', type: 'internet-crime' },
  bankFraud: { name: 'Bank Fraud Department', url: '', type: 'financial' },
  carrierSpam: { name: 'Carrier Spam Reporting (7726/SPAM)', url: '', type: 'phone' },
  brandAbuse: { name: 'Impersonated Brand Abuse Team', url: '', type: 'brand' }
};

function getReportingChannels(caseRecord) {
  const channels = [];
  const jurisdiction = caseRecord?.jurisdiction || {};
  const findings = caseRecord?.findings || [];
  const findingTypes = findings.map((f) => f.type);

  const isUS = (jurisdiction.country || '').toLowerCase().includes('united states') ||
    /usps|irs|ftc|fbi/i.test(JSON.stringify(caseRecord));

  if (isUS) {
    channels.push(CHANNELS.ftc);
    channels.push(CHANNELS.ic3);
  }

  const isFinancial = findingTypes.includes('payment') ||
    findingTypes.includes('credential') ||
    findingTypes.includes('crypto-harvest');
  if (isFinancial) {
    channels.push(CHANNELS.bankFraud);
  }

  const isPhone = Boolean(caseRecord?.phoneScam) ||
    /phone|call|voice|sms|text message/i.test(JSON.stringify(findings));
  if (isPhone) {
    channels.push(CHANNELS.carrierSpam);
  }

  if (caseRecord?.suspectedBrand && caseRecord.suspectedBrand !== 'Unknown / needs review') {
    channels.push({ ...CHANNELS.brandAbuse, note: `Brand: ${caseRecord.suspectedBrand}` });
  }

  return channels;
}

function buildReportPacket(caseRecord, channels) {
  const suggestedChannels = channels || getReportingChannels(caseRecord);

  return {
    disclaimer: 'This packet suggests reporting channels only. No report has been submitted to any authority.',
    caseId: caseRecord?.id || 'unknown',
    generatedAt: new Date().toISOString(),
    evidence: {
      url: caseRecord?.url || '',
      hostname: caseRecord?.hostname || '',
      risk: caseRecord?.risk || 'unknown',
      score: caseRecord?.score || 0,
      findings: caseRecord?.findings || [],
      suspectedBrand: caseRecord?.suspectedBrand || '',
      jurisdiction: caseRecord?.jurisdiction || {}
    },
    suggestedChannels
  };
}

module.exports = { getReportingChannels, buildReportPacket };
