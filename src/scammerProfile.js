/**
 * Scammer Profile — clusters cases by shared indicators to build suspected scam profiles.
 * Uses "suspected" language throughout; never names individuals.
 */

function clusterCases(cases) {
  if (!Array.isArray(cases) || cases.length === 0) return [];

  const domainMap = new Map();
  for (const c of cases) {
    const domain = c.hostname || '';
    if (!domain) continue;
    if (!domainMap.has(domain)) domainMap.set(domain, []);
    domainMap.get(domain).push(c);
  }

  const clusters = [];
  for (const [domain, grouped] of domainMap) {
    if (grouped.length > 0) {
      clusters.push({
        domain,
        cases: grouped,
        caseCount: grouped.length,
        sharedIndicators: extractSharedIndicators(grouped)
      });
    }
  }
  return clusters;
}

function extractSharedIndicators(cases) {
  const domains = new Set();
  const paymentMethods = new Set();
  const ips = new Set();

  for (const c of cases) {
    if (c.hostname) domains.add(c.hostname);
    if (c.ip) ips.add(c.ip);
    const findings = c.findings || [];
    for (const f of findings) {
      if (f.type === 'payment') paymentMethods.add(f.evidence);
    }
  }

  return {
    domains: [...domains],
    paymentMethods: [...paymentMethods],
    ips: [...ips]
  };
}

function buildClusterProfile(cluster) {
  const cases = cluster.cases || [];
  const timestamps = cases
    .map((c) => c.createdAt)
    .filter(Boolean)
    .sort();

  const firstSeen = timestamps[0] || null;
  const lastSeen = timestamps[timestamps.length - 1] || null;

  return {
    suspectedDomain: cluster.domain,
    caseCount: cluster.caseCount,
    sharedIndicators: cluster.sharedIndicators,
    timeline: { firstSeen, lastSeen },
    disclaimer: 'This is a suspected scam profile based on observed indicators. It does not identify any individual and should not be treated as a legal conclusion.'
  };
}

module.exports = { clusterCases, buildClusterProfile };
