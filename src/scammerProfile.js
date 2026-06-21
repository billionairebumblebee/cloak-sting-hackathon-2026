/**
 * scammerProfile.js — Scam cluster intelligence
 *
 * Groups individual case reports into suspected scammer infrastructure profiles
 * based on shared indicators (hostnames, payment methods, language patterns).
 *
 * DISCLAIMER: Profiles represent suspected patterns from reported indicators
 * and require law-enforcement verification.
 */

const crypto = require('node:crypto');

const DISCLAIMER = 'This profile represents suspected patterns from reported indicators and requires law-enforcement verification.';

/* ── Helpers ── */

function rootDomain(hostname) {
  if (!hostname) return '';
  const parts = hostname.toLowerCase().replace(/^www\./, '').split('.');
  if (parts.length <= 2) return parts.join('.');
  return parts.slice(-2).join('.');
}

function domainFamily(hostname) {
  if (!hostname) return '';
  const root = rootDomain(hostname);
  const parts = hostname.toLowerCase().replace(/^www\./, '').split('.');
  if (parts.length > 2) return `*.${root}`;
  return root;
}

function extractPaymentMethods(findings) {
  const methods = new Set();
  const paymentTerms = ['wire transfer', 'gift card', 'crypto', 'bitcoin', 'zelle', 'cash app', 'processing fee'];
  for (const f of findings) {
    const ev = (f.evidence || '').toLowerCase();
    for (const term of paymentTerms) {
      if (ev.includes(term)) methods.add(term);
    }
  }
  return [...methods];
}

function extractPhones(caseRecord) {
  const text = `${caseRecord.title || ''} ${(caseRecord.findings || []).map(f => f.evidence).join(' ')}`;
  const matches = text.match(/\+?[\d\-().]{7,}/g) || [];
  return [...new Set(matches)];
}

function extractEmails(caseRecord) {
  const text = `${caseRecord.url || ''} ${caseRecord.title || ''} ${(caseRecord.findings || []).map(f => f.evidence).join(' ')}`;
  const matches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  return [...new Set(matches.map(e => e.toLowerCase()))];
}

function extractLanguagePatterns(findings) {
  const patterns = new Set();
  for (const f of findings) {
    if (f.type) patterns.add(f.type);
  }
  return [...patterns];
}

function generateClusterId() {
  return `cluster_${crypto.randomBytes(6).toString('hex')}`;
}

function generateClusterName(cases, index) {
  const types = new Set();
  for (const c of cases) {
    for (const f of (c.findings || [])) {
      if (f.type === 'ransom') types.add('Ransom');
      if (f.type === 'impersonation') types.add('Impersonation');
      if (f.type === 'payment') types.add('Payment');
      if (f.type === 'crypto-harvest') types.add('Crypto Harvest');
      if (f.type === 'domain') types.add('Domain');
    }
  }

  const hostnames = cases.map(c => c.hostname).filter(Boolean);
  if (hostnames.length > 0) {
    const root = rootDomain(hostnames[0]);
    if (root && cases.every(c => rootDomain(c.hostname) === root)) {
      return `Fake ${root.split('.')[0].charAt(0).toUpperCase() + root.split('.')[0].slice(1)} Cluster #${index}`;
    }
  }

  if (types.has('Ransom')) return `Ransom Threat Network #${index}`;
  if (types.has('Crypto Harvest')) return `Crypto Drain Cluster #${index}`;
  if (types.has('Payment')) return `Prize Claim Network #${index}`;
  if (types.has('Impersonation')) return `Fake Bank Cluster #${index}`;
  return `Suspected Scam Cluster #${index}`;
}

/* ── Core exports ── */

/**
 * Cluster cases by shared indicators.
 * Groups by: shared hostname root, shared payment methods, shared language patterns.
 */
function clusterCases(cases) {
  if (!cases || cases.length === 0) return [];

  const assigned = new Set();
  const clusters = [];

  // Pass 1: Group by shared hostname root domain
  const byDomain = {};
  for (const c of cases) {
    const family = domainFamily(c.hostname);
    if (family) {
      if (!byDomain[family]) byDomain[family] = [];
      byDomain[family].push(c);
    }
  }
  for (const [, group] of Object.entries(byDomain)) {
    if (group.length >= 2) {
      const ids = group.map(c => c.id);
      ids.forEach(id => assigned.add(id));
      clusters.push(group);
    }
  }

  // Pass 2: Group remaining by shared payment methods
  const remaining = cases.filter(c => !assigned.has(c.id));
  const byPayment = {};
  for (const c of remaining) {
    const methods = extractPaymentMethods(c.findings || []);
    const key = methods.sort().join('|');
    if (key) {
      if (!byPayment[key]) byPayment[key] = [];
      byPayment[key].push(c);
    }
  }
  for (const [, group] of Object.entries(byPayment)) {
    if (group.length >= 2) {
      const ids = group.map(c => c.id);
      ids.forEach(id => assigned.add(id));
      clusters.push(group);
    }
  }

  // Pass 3: Group remaining by shared language/signal patterns
  const stillRemaining = cases.filter(c => !assigned.has(c.id));
  const byPattern = {};
  for (const c of stillRemaining) {
    const patterns = extractLanguagePatterns(c.findings || []);
    const key = patterns.sort().join('|');
    if (key) {
      if (!byPattern[key]) byPattern[key] = [];
      byPattern[key].push(c);
    }
  }
  for (const [, group] of Object.entries(byPattern)) {
    if (group.length >= 2) {
      const ids = group.map(c => c.id);
      ids.forEach(id => assigned.add(id));
      clusters.push(group);
    }
  }

  return clusters;
}

/**
 * Extract shared indicators across a group of cases.
 */
function extractSharedIndicators(cases) {
  const allDomains = new Set();
  const allPhones = new Set();
  const allEmails = new Set();
  const allPaymentMethods = new Set();
  const hostingIndicators = new Set();
  const registrarIndicators = new Set();

  for (const c of cases) {
    if (c.hostname) allDomains.add(c.hostname.toLowerCase());
    for (const phone of extractPhones(c)) allPhones.add(phone);
    for (const email of extractEmails(c)) allEmails.add(email);
    for (const method of extractPaymentMethods(c.findings || [])) allPaymentMethods.add(method);

    // Infer hosting/registrar from domain patterns
    const host = (c.hostname || '').toLowerCase();
    if (host.includes('.xyz') || host.includes('.top') || host.includes('.click')) {
      registrarIndicators.add('Cheap novelty TLD registrar');
    }
    if (host.split('-').length >= 3) {
      hostingIndicators.add('Bulk-generated subdomain pattern');
    }
  }

  return {
    linkedDomains: [...allDomains],
    linkedPhones: [...allPhones],
    linkedEmails: [...allEmails],
    sharedInfrastructure: {
      hosting: [...hostingIndicators].join('; ') || 'Unknown',
      registrar: [...registrarIndicators].join('; ') || 'Unknown',
      paymentMethods: [...allPaymentMethods]
    }
  };
}

/**
 * Build a timeline from cases' timestamps.
 */
function buildTimeline(cases) {
  const timestamps = cases
    .map(c => c.createdAt || c.timestamp || c.analyzedAt)
    .filter(Boolean)
    .map(t => new Date(t).getTime())
    .filter(t => !isNaN(t))
    .sort((a, b) => a - b);

  if (timestamps.length === 0) {
    return { firstSeen: null, lastSeen: null, totalReports: cases.length };
  }

  return {
    firstSeen: new Date(timestamps[0]).toISOString(),
    lastSeen: new Date(timestamps[timestamps.length - 1]).toISOString(),
    totalReports: cases.length
  };
}

/**
 * Build a full cluster profile from a group of related cases.
 */
function buildClusterProfile(cluster, index = 1) {
  const indicators = extractSharedIndicators(cluster);
  const timeline = buildTimeline(cluster);

  const maxScore = Math.max(...cluster.map(c => c.score || 0));
  let riskLevel = 'low';
  if (maxScore >= 65) riskLevel = 'critical';
  else if (maxScore >= 45) riskLevel = 'high';
  else if (maxScore >= 25) riskLevel = 'medium';

  return {
    clusterId: generateClusterId(),
    clusterName: generateClusterName(cluster, index),
    linkedDomains: indicators.linkedDomains,
    linkedPhones: indicators.linkedPhones,
    linkedEmails: indicators.linkedEmails,
    sharedInfrastructure: indicators.sharedInfrastructure,
    timeline,
    riskLevel,
    disclaimer: DISCLAIMER
  };
}

/**
 * Format a cluster profile as readable Markdown.
 */
function formatClusterMarkdown(profile) {
  const lines = [];
  lines.push(`# ${profile.clusterName}`);
  lines.push('');
  lines.push(`**Cluster ID:** ${profile.clusterId}`);
  lines.push(`**Risk Level:** ${profile.riskLevel.toUpperCase()}`);
  lines.push(`**Total Reports:** ${profile.timeline.totalReports}`);
  lines.push('');

  lines.push('## Timeline');
  lines.push(`- First seen: ${profile.timeline.firstSeen || 'Unknown'}`);
  lines.push(`- Last seen: ${profile.timeline.lastSeen || 'Unknown'}`);
  lines.push('');

  lines.push('## Linked Domains');
  if (profile.linkedDomains.length > 0) {
    for (const d of profile.linkedDomains) lines.push(`- ${d}`);
  } else {
    lines.push('- None identified');
  }
  lines.push('');

  lines.push('## Linked Contact Indicators');
  if (profile.linkedPhones.length > 0) {
    lines.push('**Phones:**');
    for (const p of profile.linkedPhones) lines.push(`- ${p}`);
  }
  if (profile.linkedEmails.length > 0) {
    lines.push('**Emails:**');
    for (const e of profile.linkedEmails) lines.push(`- ${e}`);
  }
  if (profile.linkedPhones.length === 0 && profile.linkedEmails.length === 0) {
    lines.push('- None extracted from reports');
  }
  lines.push('');

  lines.push('## Shared Infrastructure');
  lines.push(`- Hosting: ${profile.sharedInfrastructure.hosting}`);
  lines.push(`- Registrar: ${profile.sharedInfrastructure.registrar}`);
  if (profile.sharedInfrastructure.paymentMethods.length > 0) {
    lines.push(`- Payment methods: ${profile.sharedInfrastructure.paymentMethods.join(', ')}`);
  }
  lines.push('');

  lines.push('## Disclaimer');
  lines.push('');
  lines.push(`> ${profile.disclaimer}`);
  lines.push('');

  return lines.join('\n');
}

module.exports = {
  clusterCases,
  buildClusterProfile,
  extractSharedIndicators,
  buildTimeline,
  formatClusterMarkdown
};
