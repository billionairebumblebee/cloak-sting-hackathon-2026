const crypto = require('node:crypto');

const DISCLAIMER = 'This profile represents suspected patterns from reported indicators and requires law-enforcement verification.';

/* ── Scam-type vocabulary for cluster naming ── */
const SCAM_TYPE_LABELS = [
  ['Prize Claim Network', ['prize', 'lottery', 'winner', 'claim', 'sweepstakes']],
  ['Fake Bank Cluster', ['bank', 'account', 'verify', 'suspended', 'login']],
  ['Shipping Fee Ring', ['usps', 'fedex', 'dhl', 'shipping', 'redelivery', 'customs']],
  ['Tech Support Ring', ['microsoft', 'apple', 'support', 'virus', 'defender']],
  ['Crypto Drain Network', ['crypto', 'bitcoin', 'seed phrase', 'wallet', 'recovery phrase']],
  ['Romance Fraud Cluster', ['romance', 'dating', 'love', 'relationship', 'heart']],
  ['Ransom Threat Network', ['ransom', 'kidnap', 'hostage', 'wire the money', 'will be harmed']],
  ['Government Impersonation Ring', ['irs', 'fbi', 'embassy', 'consulate', 'police', 'public security']],
  ['Gift Card Scam Ring', ['gift card', 'itunes', 'google play', 'steam card']],
];

/* ── Payment-method extraction ── */
const PAYMENT_KEYWORDS = [
  { method: 'gift card', terms: ['gift card', 'itunes', 'google play', 'steam card', 'amazon card'] },
  { method: 'wire transfer', terms: ['wire transfer', 'wire the money', 'bank transfer'] },
  { method: 'crypto', terms: ['crypto', 'bitcoin', 'btc', 'ethereum', 'bitcoin wallet', 'crypto wallet'] },
  { method: 'cash app', terms: ['cash app', 'cashapp', 'venmo', 'zelle'] },
  { method: 'processing fee', terms: ['processing fee', 'redelivery fee', 'customs fee', 'pay to release'] },
];

/* ── Helpers ── */

function normalize(text) {
  return String(text || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function rootDomain(hostname) {
  const parts = String(hostname || '').toLowerCase().split('.');
  if (parts.length <= 2) return parts.join('.');
  return parts.slice(-2).join('.');
}

function generateClusterId(seed) {
  return `cluster_${crypto.createHash('sha256').update(seed).digest('hex').slice(0, 12)}`;
}

function caseText(c) {
  const findingsText = (c.findings || []).map((f) => `${f.label || ''} ${f.evidence || ''}`).join(' ');
  return normalize(`${c.hostname || ''} ${c.title || ''} ${c.url || ''} ${findingsText}`);
}

/* ── Extract payment methods from a single case ── */
function extractPaymentMethods(c) {
  const text = caseText(c);
  const methods = [];
  for (const { method, terms } of PAYMENT_KEYWORDS) {
    if (terms.some((t) => text.includes(t)) && !methods.includes(method)) {
      methods.push(method);
    }
  }
  return methods;
}

/* ── Determine primary scam type label for naming ── */
function inferScamType(text) {
  for (const [label, keywords] of SCAM_TYPE_LABELS) {
    if (keywords.some((kw) => text.includes(kw))) return label;
  }
  return 'Suspicious Activity Cluster';
}

/* ── Core: extract shared indicators from a set of cases ── */
function extractSharedIndicators(cases) {
  const domainCounts = {};
  const paymentCounts = {};
  const registrarHints = new Set();
  const hostingHints = new Set();
  const phones = new Set();
  const emails = new Set();
  const urgencyTerms = new Set();

  for (const c of cases) {
    const root = rootDomain(c.hostname);
    if (root) domainCounts[root] = (domainCounts[root] || 0) + 1;

    const payments = extractPaymentMethods(c);
    for (const p of payments) paymentCounts[p] = (paymentCounts[p] || 0) + 1;

    const text = caseText(c);

    const phoneMatches = text.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g) || [];
    for (const ph of phoneMatches) phones.add(ph);

    const emailMatches = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/g) || [];
    for (const em of emailMatches) emails.add(em);

    const urgencyList = ['act now', 'urgent', 'immediately', 'final notice', 'within 24 hours'];
    for (const u of urgencyList) {
      if (text.includes(u)) urgencyTerms.add(u);
    }

    /* Heuristic registrar/hosting hints from domain patterns */
    if (root.endsWith('.xyz') || root.endsWith('.top') || root.endsWith('.click') || root.endsWith('.zip')) {
      registrarHints.add('Cheap/novelty TLD registrar');
    }
    if (root.includes('-') && root.split('-').length >= 3) {
      hostingHints.add('Hyphen-stuffed domain pattern (possible bulk registration)');
    }
  }

  return {
    sharedDomains: Object.entries(domainCounts).filter(([, n]) => n >= 1).map(([d]) => d),
    sharedPaymentMethods: Object.entries(paymentCounts).filter(([, n]) => n >= 1).map(([m]) => m),
    registrarHints: [...registrarHints],
    hostingHints: [...hostingHints],
    linkedPhones: [...phones],
    linkedEmails: [...emails],
    urgencyLanguage: [...urgencyTerms],
  };
}

/* ── Core: cluster cases by shared indicators ── */
function clusterCases(cases) {
  if (!Array.isArray(cases) || cases.length === 0) return [];

  const assigned = new Set();
  const clusters = [];

  /* Pass 1: group by shared root domain */
  const domainGroups = {};
  for (const c of cases) {
    const root = rootDomain(c.hostname);
    if (!root) continue;
    if (!domainGroups[root]) domainGroups[root] = [];
    domainGroups[root].push(c);
  }

  for (const [, group] of Object.entries(domainGroups)) {
    if (group.length >= 2) {
      const ids = group.map((c) => c.id || c.hostname);
      clusters.push({ cases: group, basis: 'shared-domain' });
      for (const id of ids) assigned.add(id);
    }
  }

  /* Pass 2: group remaining cases by shared payment method */
  const remaining = cases.filter((c) => !assigned.has(c.id || c.hostname));
  const paymentGroups = {};
  for (const c of remaining) {
    const methods = extractPaymentMethods(c);
    for (const m of methods) {
      if (!paymentGroups[m]) paymentGroups[m] = [];
      paymentGroups[m].push(c);
    }
  }

  for (const [, group] of Object.entries(paymentGroups)) {
    if (group.length >= 2) {
      const deduped = [];
      for (const c of group) {
        const id = c.id || c.hostname;
        if (!assigned.has(id)) {
          deduped.push(c);
          assigned.add(id);
        }
      }
      if (deduped.length >= 2) {
        clusters.push({ cases: deduped, basis: 'shared-payment-method' });
      }
    }
  }

  /* Pass 3: remaining unclustered cases become singleton clusters */
  for (const c of cases) {
    const id = c.id || c.hostname;
    if (!assigned.has(id)) {
      clusters.push({ cases: [c], basis: 'unclustered' });
      assigned.add(id);
    }
  }

  return clusters;
}

/* ── Core: build timeline from case timestamps ── */
function buildTimeline(cases) {
  const timestamps = cases
    .map((c) => c.createdAt || c.timestamp || c.analyzedAt)
    .filter(Boolean)
    .map((t) => new Date(t))
    .filter((d) => !isNaN(d.getTime()))
    .sort((a, b) => a - b);

  if (timestamps.length === 0) {
    return { firstSeen: 'unknown', lastSeen: 'unknown', totalReports: cases.length };
  }

  return {
    firstSeen: timestamps[0].toISOString(),
    lastSeen: timestamps[timestamps.length - 1].toISOString(),
    totalReports: cases.length,
  };
}

/* ── Core: build a cluster profile ── */
function buildClusterProfile(cluster, index) {
  const { cases, basis } = cluster;
  const combinedText = cases.map((c) => caseText(c)).join(' ');
  const scamType = inferScamType(combinedText);
  const clusterNum = (index != null ? index : Math.floor(Math.random() * 100)) + 1;
  const indicators = extractSharedIndicators(cases);
  const timeline = buildTimeline(cases);

  /* Determine risk level from case scores */
  const scores = cases.map((c) => Number(c.score || 0)).filter((s) => s > 0);
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  let riskLevel = 'low';
  if (avgScore >= 65) riskLevel = 'high';
  else if (avgScore >= 35) riskLevel = 'medium';

  const seed = cases.map((c) => c.id || c.hostname || '').sort().join('|');

  return {
    clusterId: generateClusterId(seed),
    name: `${scamType} #${clusterNum}`,
    clusterBasis: basis,
    linkedDomains: indicators.sharedDomains,
    linkedPhones: indicators.linkedPhones,
    linkedEmails: indicators.linkedEmails,
    sharedInfrastructure: {
      hosting: indicators.hostingHints.join('; ') || 'No shared hosting pattern detected',
      registrar: indicators.registrarHints.join('; ') || 'No shared registrar pattern detected',
      paymentMethods: indicators.sharedPaymentMethods,
    },
    urgencyLanguage: indicators.urgencyLanguage,
    timeline,
    riskLevel,
    caseCount: cases.length,
    caseIds: cases.map((c) => c.id).filter(Boolean),
    disclaimer: DISCLAIMER,
  };
}

/* ── Core: format cluster profile as markdown ── */
function formatClusterMarkdown(profile) {
  const domains = profile.linkedDomains.length > 0
    ? profile.linkedDomains.map((d) => `  - ${d}`).join('\n')
    : '  - None identified';

  const phones = profile.linkedPhones.length > 0
    ? profile.linkedPhones.map((p) => `  - ${p}`).join('\n')
    : '  - None identified';

  const emails = profile.linkedEmails.length > 0
    ? profile.linkedEmails.map((e) => `  - ${e}`).join('\n')
    : '  - None identified';

  const payments = profile.sharedInfrastructure.paymentMethods.length > 0
    ? profile.sharedInfrastructure.paymentMethods.map((m) => `  - ${m}`).join('\n')
    : '  - None identified';

  const urgency = profile.urgencyLanguage && profile.urgencyLanguage.length > 0
    ? profile.urgencyLanguage.map((u) => `  - "${u}"`).join('\n')
    : '  - None identified';

  return (
    `# Suspected Scam Cluster: ${profile.name}\n\n` +
    `> ⚠️ ${profile.disclaimer}\n\n` +
    `## Cluster Overview\n\n` +
    `- **Cluster ID:** ${profile.clusterId}\n` +
    `- **Cluster basis:** ${profile.clusterBasis}\n` +
    `- **Risk level:** ${profile.riskLevel}\n` +
    `- **Total reports:** ${profile.timeline.totalReports}\n` +
    `- **First seen:** ${profile.timeline.firstSeen}\n` +
    `- **Last seen:** ${profile.timeline.lastSeen}\n\n` +
    `## Linked Domains\n\n${domains}\n\n` +
    `## Linked Phone Numbers\n\n${phones}\n\n` +
    `## Linked Email Addresses\n\n${emails}\n\n` +
    `## Shared Infrastructure\n\n` +
    `- **Hosting:** ${profile.sharedInfrastructure.hosting}\n` +
    `- **Registrar:** ${profile.sharedInfrastructure.registrar}\n` +
    `- **Payment methods:**\n${payments}\n\n` +
    `## Urgency Language Patterns\n\n${urgency}\n\n` +
    `## Case IDs in Cluster\n\n` +
    (profile.caseIds.length > 0
      ? profile.caseIds.map((id) => `- ${id}`).join('\n')
      : '- No case IDs recorded') +
    `\n\n---\n\n_${profile.disclaimer}_\n`
  );
}

module.exports = {
  clusterCases,
  buildClusterProfile,
  extractSharedIndicators,
  buildTimeline,
  formatClusterMarkdown,
  DISCLAIMER,
};
