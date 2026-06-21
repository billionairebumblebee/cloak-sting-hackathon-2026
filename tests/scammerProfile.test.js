const test = require('node:test');
const assert = require('node:assert/strict');
const { clusterCases, buildClusterProfile } = require('../src/scammerProfile.js');

test('grouping cases by shared domain produces a cluster', () => {
  const cases = [
    { hostname: 'scam-domain.example', findings: [], createdAt: '2026-06-01T10:00:00Z' },
    { hostname: 'scam-domain.example', findings: [], createdAt: '2026-06-02T10:00:00Z' },
    { hostname: 'other.example', findings: [], createdAt: '2026-06-03T10:00:00Z' }
  ];
  const clusters = clusterCases(cases);
  assert.ok(clusters.length >= 1);
  const mainCluster = clusters.find((c) => c.domain === 'scam-domain.example');
  assert.ok(mainCluster);
  assert.equal(mainCluster.caseCount, 2);
});

test('cluster includes shared indicators (domains, IPs, payment methods)', () => {
  const cases = [
    {
      hostname: 'evil-pay.example',
      ip: '192.168.1.100',
      findings: [{ type: 'payment', evidence: 'gift card', weight: 18 }],
      createdAt: '2026-06-01T10:00:00Z'
    },
    {
      hostname: 'evil-pay.example',
      ip: '192.168.1.100',
      findings: [{ type: 'payment', evidence: 'crypto', weight: 18 }],
      createdAt: '2026-06-02T10:00:00Z'
    }
  ];
  const clusters = clusterCases(cases);
  const cluster = clusters[0];
  assert.ok(cluster.sharedIndicators);
  assert.ok(cluster.sharedIndicators.domains.includes('evil-pay.example'));
  assert.ok(cluster.sharedIndicators.ips.includes('192.168.1.100'));
  assert.ok(cluster.sharedIndicators.paymentMethods.length >= 1);
});

test('cluster profile includes disclaimer text', () => {
  const cluster = {
    domain: 'phish.example',
    cases: [{ hostname: 'phish.example', createdAt: '2026-06-01T10:00:00Z', findings: [] }],
    caseCount: 1,
    sharedIndicators: { domains: ['phish.example'], ips: [], paymentMethods: [] }
  };
  const profile = buildClusterProfile(cluster);
  assert.ok(profile.disclaimer);
  assert.ok(profile.disclaimer.toLowerCase().includes('suspected'));
  assert.ok(!profile.disclaimer.includes('Cloak'));
});

test('cluster with single case returns minimal profile', () => {
  const cases = [
    { hostname: 'single-case.example', findings: [], createdAt: '2026-06-10T08:00:00Z' }
  ];
  const clusters = clusterCases(cases);
  assert.equal(clusters.length, 1);
  const profile = buildClusterProfile(clusters[0]);
  assert.equal(profile.caseCount, 1);
  assert.equal(profile.suspectedDomain, 'single-case.example');
  assert.ok(profile.disclaimer);
});

test('cluster timeline shows first/last seen dates', () => {
  const cases = [
    { hostname: 'timeline.example', findings: [], createdAt: '2026-05-15T10:00:00Z' },
    { hostname: 'timeline.example', findings: [], createdAt: '2026-06-20T14:00:00Z' },
    { hostname: 'timeline.example', findings: [], createdAt: '2026-06-01T12:00:00Z' }
  ];
  const clusters = clusterCases(cases);
  const profile = buildClusterProfile(clusters[0]);
  assert.ok(profile.timeline);
  assert.equal(profile.timeline.firstSeen, '2026-05-15T10:00:00Z');
  assert.equal(profile.timeline.lastSeen, '2026-06-20T14:00:00Z');
});
