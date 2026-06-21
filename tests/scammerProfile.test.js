const test = require('node:test');
const assert = require('node:assert/strict');
const { clusterCases, buildClusterProfile } = require('../src/scammerProfile.js');

test('grouping cases by shared domain produces a cluster', () => {
  const cases = [
    { id: 'c1', url: 'https://fake-bank.example/a', hostname: 'fake-bank.example', score: 80, findings: [{type:'credential_harvesting',label:'Phishing',evidence:'password',weight:18}], timestamp: '2026-05-10T10:00:00Z' },
    { id: 'c2', url: 'https://fake-bank.example/b', hostname: 'fake-bank.example', score: 75, findings: [{type:'urgency',label:'Urgent',evidence:'act now',weight:14}], timestamp: '2026-05-15T10:00:00Z' }
  ];
  const clusters = clusterCases(cases);
  assert.ok(clusters.length >= 1);
  assert.ok(clusters[0].length >= 2);
});

test('cluster includes shared indicators (domains, IPs, payment methods)', () => {
  const cases = [
    { id: 'c1', url: 'https://scam-shop.net/1', hostname: 'scam-shop.net', score: 85, findings: [{type:'payment',label:'Gift card',evidence:'gift card',weight:18}], timestamp: '2026-05-01T10:00:00Z' },
    { id: 'c2', url: 'https://scam-shop.net/2', hostname: 'scam-shop.net', score: 82, findings: [{type:'payment',label:'Crypto',evidence:'bitcoin',weight:18}], timestamp: '2026-05-05T10:00:00Z' }
  ];
  const clusters = clusterCases(cases);
  const profile = buildClusterProfile(clusters[0]);
  assert.ok(profile.linkedDomains.length >= 1);
  assert.ok(profile.linkedDomains.includes('scam-shop.net'));
  assert.ok(profile.sharedInfrastructure);
});

test('cluster profile includes disclaimer text', () => {
  const cases = [
    { id: 'c1', url: 'https://a.example', hostname: 'a.example', score: 80, findings: [{type:'urgency',label:'Rush',evidence:'now',weight:14}], timestamp: '2026-05-01T10:00:00Z' },
    { id: 'c2', url: 'https://a.example/x', hostname: 'a.example', score: 70, findings: [{type:'urgency',label:'Rush',evidence:'quick',weight:14}], timestamp: '2026-05-03T10:00:00Z' }
  ];
  const clusters = clusterCases(cases);
  const profile = buildClusterProfile(clusters[0]);
  assert.ok(profile.disclaimer);
  assert.ok(profile.disclaimer.toLowerCase().includes('law-enforcement') || profile.disclaimer.toLowerCase().includes('verification') || profile.disclaimer.toLowerCase().includes('suspected'));
});

test('cluster with two cases from same domain returns valid profile', () => {
  const cases = [
    { id: 'c1', url: 'https://lone.example/a', hostname: 'lone.example', score: 60, findings: [{type:'urgency',label:'Rush',evidence:'now',weight:14}], timestamp: '2026-06-01T10:00:00Z' },
    { id: 'c2', url: 'https://lone.example/b', hostname: 'lone.example', score: 55, findings: [{type:'urgency',label:'Rush',evidence:'quick',weight:14}], timestamp: '2026-06-02T10:00:00Z' }
  ];
  const clusters = clusterCases(cases);
  assert.ok(clusters.length >= 1);
  const profile = buildClusterProfile(clusters[0]);
  assert.ok(profile.clusterId);
  assert.ok(profile.timeline);
});

test('cluster timeline shows first/last seen dates', () => {
  const cases = [
    { id: 'c1', url: 'https://x.example/1', hostname: 'x.example', score: 80, findings: [{type:'payment',label:'Pay',evidence:'wire',weight:18}], timestamp: '2026-03-01T10:00:00Z' },
    { id: 'c2', url: 'https://x.example/2', hostname: 'x.example', score: 75, findings: [{type:'payment',label:'Pay',evidence:'crypto',weight:18}], timestamp: '2026-06-01T10:00:00Z' }
  ];
  const clusters = clusterCases(cases);
  const profile = buildClusterProfile(clusters[0]);
  assert.ok(profile.timeline.firstSeen);
  assert.ok(profile.timeline.lastSeen);
  assert.ok(new Date(profile.timeline.firstSeen) <= new Date(profile.timeline.lastSeen));
});
