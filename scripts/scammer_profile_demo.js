/**
 * scammer_profile_demo.js — Demonstrates the scam cluster intelligence system.
 *
 * Creates 8 mock cases:
 *   - 3 from same domain family (fake-bank cluster)
 *   - 3 using same payment scheme (gift card network)
 *   - 2 isolated cases
 * Runs clustering → produces 2-3 cluster profiles.
 */

const fs = require('node:fs');
const path = require('node:path');
const { clusterCases, buildClusterProfile, formatClusterMarkdown } = require('../src/scammerProfile.js');

/* ── Mock Cases ── */

const mockCases = [
  // Cluster 1: Same domain family (secure-banking-verify.example)
  {
    id: 'case_demo_001',
    hostname: 'login.secure-banking-verify.example',
    url: 'https://login.secure-banking-verify.example/auth',
    title: 'Verify Your Account - Secure Banking',
    risk: 'high',
    score: 78,
    findings: [
      { type: 'domain', label: 'Brand impersonation pattern', weight: 22, evidence: 'login.secure-banking-verify.example' },
      { type: 'copy', label: 'Urgency pressure', weight: 12, evidence: 'account locked' },
      { type: 'impersonation', label: 'Trusted institution language', weight: 14, evidence: 'bank security' },
      { type: 'credential', label: 'Repeated credential/code request', weight: 16, evidence: '3 credential terms' }
    ],
    createdAt: '2026-06-15T10:30:00Z'
  },
  {
    id: 'case_demo_002',
    hostname: 'update.secure-banking-verify.example',
    url: 'https://update.secure-banking-verify.example/reset',
    title: 'Password Reset Required - Banking Security',
    risk: 'high',
    score: 72,
    findings: [
      { type: 'domain', label: 'Brand impersonation pattern', weight: 22, evidence: 'update.secure-banking-verify.example' },
      { type: 'copy', label: 'Urgency pressure', weight: 12, evidence: 'immediately' },
      { type: 'impersonation', label: 'Trusted institution language', weight: 14, evidence: 'fraud department' }
    ],
    createdAt: '2026-06-16T14:45:00Z'
  },
  {
    id: 'case_demo_003',
    hostname: 'verify.secure-banking-verify.example',
    url: 'https://verify.secure-banking-verify.example/otp',
    title: 'One-Time Code Verification - Bank',
    risk: 'high',
    score: 68,
    findings: [
      { type: 'domain', label: 'Brand impersonation pattern', weight: 22, evidence: 'verify.secure-banking-verify.example' },
      { type: 'credential', label: 'Repeated credential/code request', weight: 16, evidence: '2 credential terms' },
      { type: 'copy', label: 'Urgency pressure', weight: 12, evidence: 'within 24 hours' }
    ],
    createdAt: '2026-06-17T09:15:00Z'
  },

  // Cluster 2: Same payment scheme (gift card scams)
  {
    id: 'case_demo_004',
    hostname: 'prizes-winner-2026.top',
    url: 'https://prizes-winner-2026.top/claim',
    title: 'Congratulations! You Won $50,000!',
    risk: 'high',
    score: 82,
    findings: [
      { type: 'domain', label: 'Risky novelty top-level domain', weight: 10, evidence: 'prizes-winner-2026.top' },
      { type: 'payment', label: 'Unusual payment request', weight: 18, evidence: 'gift card' },
      { type: 'copy', label: 'Urgency pressure', weight: 12, evidence: 'limited time' },
      { type: 'payment', label: 'Unusual payment request', weight: 18, evidence: 'processing fee' }
    ],
    createdAt: '2026-06-14T08:00:00Z'
  },
  {
    id: 'case_demo_005',
    hostname: 'mega-prize-claim.click',
    url: 'https://mega-prize-claim.click/winners',
    title: 'Final Notice: Claim Your Prize Now',
    risk: 'high',
    score: 76,
    findings: [
      { type: 'domain', label: 'Risky novelty top-level domain', weight: 10, evidence: 'mega-prize-claim.click' },
      { type: 'payment', label: 'Unusual payment request', weight: 18, evidence: 'gift card' },
      { type: 'copy', label: 'Urgency pressure', weight: 12, evidence: 'final notice' },
      { type: 'payment', label: 'Unusual payment request', weight: 18, evidence: 'processing fee' }
    ],
    createdAt: '2026-06-15T12:30:00Z'
  },
  {
    id: 'case_demo_006',
    hostname: 'lucky-draw-rewards.xyz',
    url: 'https://lucky-draw-rewards.xyz/redeem',
    title: 'Act Now - Your Reward Expires Today',
    risk: 'high',
    score: 70,
    findings: [
      { type: 'domain', label: 'Risky novelty top-level domain', weight: 10, evidence: 'lucky-draw-rewards.xyz' },
      { type: 'payment', label: 'Unusual payment request', weight: 18, evidence: 'gift card' },
      { type: 'copy', label: 'Urgency pressure', weight: 12, evidence: 'act now' },
      { type: 'payment', label: 'Unusual payment request', weight: 18, evidence: 'processing fee' }
    ],
    createdAt: '2026-06-18T16:00:00Z'
  },

  // Isolated cases (should NOT cluster)
  {
    id: 'case_demo_007',
    hostname: 'support-apple-id-reset.zip',
    url: 'https://support-apple-id-reset.zip/verify',
    title: 'Apple ID Suspended - Verify Identity',
    risk: 'high',
    score: 74,
    findings: [
      { type: 'domain', label: 'Risky novelty top-level domain', weight: 10, evidence: 'support-apple-id-reset.zip' },
      { type: 'impersonation', label: 'Trusted institution language', weight: 14, evidence: 'apple support' },
      { type: 'copy', label: 'Urgency pressure', weight: 12, evidence: 'account suspended' },
      { type: 'payment', label: 'Unusual payment request', weight: 18, evidence: 'crypto' }
    ],
    createdAt: '2026-06-19T11:00:00Z'
  },
  {
    id: 'case_demo_008',
    hostname: 'fedex-redelivery-fee.mov',
    url: 'https://fedex-redelivery-fee.mov/pay',
    title: 'FedEx: Pay Redelivery Fee',
    risk: 'medium',
    score: 52,
    findings: [
      { type: 'domain', label: 'Risky novelty top-level domain', weight: 10, evidence: 'fedex-redelivery-fee.mov' },
      { type: 'impersonation', label: 'Trusted institution language', weight: 14, evidence: 'fedex' },
      { type: 'payment', label: 'Unusual payment request', weight: 18, evidence: 'zelle' }
    ],
    createdAt: '2026-06-20T07:45:00Z'
  }
];

/* ── Run Clustering ── */

console.log('═══════════════════════════════════════════════════════════');
console.log(' STING — Scam Infrastructure Profile Clustering Demo');
console.log('═══════════════════════════════════════════════════════════\n');

console.log(`Input: ${mockCases.length} reported cases\n`);
console.log('Running cluster analysis...\n');

const clusters = clusterCases(mockCases);

console.log(`Result: ${clusters.length} suspected cluster(s) identified\n`);
console.log('───────────────────────────────────────────────────────────\n');

const profiles = [];

for (let i = 0; i < clusters.length; i++) {
  const profile = buildClusterProfile(clusters[i], i + 1);
  profiles.push(profile);

  const md = formatClusterMarkdown(profile);
  console.log(md);
  console.log('───────────────────────────────────────────────────────────\n');
}

/* ── Save output ── */

const outputDir = path.join(process.cwd(), 'data');
fs.mkdirSync(outputDir, { recursive: true });

const outputPath = path.join(outputDir, 'cluster-profiles-demo.json');
const output = {
  generatedAt: new Date().toISOString(),
  totalCasesAnalyzed: mockCases.length,
  clustersFound: clusters.length,
  profiles,
  disclaimer: 'This profile represents suspected patterns from reported indicators and requires law-enforcement verification.'
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`Saved cluster profiles to: ${outputPath}`);
console.log('\nDisclaimer: Profiles represent suspected patterns. Verification by authorities required.');
