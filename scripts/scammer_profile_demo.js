const fs = require('node:fs');
const path = require('node:path');
const { analyzeScamSurface } = require('../src/scamSignals.js');
const { normalizeReceiptToCase } = require('../src/caseStore.js');
const {
  clusterCases,
  buildClusterProfile,
  formatClusterMarkdown,
  DISCLAIMER,
} = require('../src/scammerProfile.js');

/* ── Mock scam cases with shared indicators for clustering ── */

function buildCase(input, notes) {
  const receipt = { ...input, ...analyzeScamSurface(input) };
  return normalizeReceiptToCase(receipt, { victimSafeNotes: notes });
}

const mockCases = [
  /* Domain family 1: subdomains of bank-verify-secure.example */
  buildCase(
    {
      hostname: 'login.bank-verify-secure.example',
      title: 'Urgent: Account Suspended — Verify Now',
      url: 'https://login.bank-verify-secure.example/verify',
      text: 'Your account has been suspended. Verify now within 24 hours or your funds will be frozen. Enter your password and one-time security code. Do not contact your branch.',
    },
    'Demo fixture: bank phishing variant A.'
  ),
  buildCase(
    {
      hostname: 'update.bank-verify-secure.example',
      title: 'Bank Security Alert — Immediate Action Required',
      url: 'https://update.bank-verify-secure.example/update',
      text: 'URGENT: Suspicious activity detected on your account. Verify your identity immediately. Wire transfer will be reversed unless you act now. Do not tell anyone about this process.',
    },
    'Demo fixture: bank phishing variant B — same domain family.'
  ),

  /* Domain family 2: subdomains of prize-claim.xyz (shared root domain + gift card payment) */
  buildCase(
    {
      hostname: 'winner.prize-claim.xyz',
      title: 'Congratulations! You Have Won $5,000,000!',
      url: 'https://winner.prize-claim.xyz/claim',
      text: 'You are our lucky winner! Claim your prize immediately. Pay $49.99 processing fee via gift card. Limited time offer — act now! Call 1-800-555-0199.',
    },
    'Demo fixture: lottery scam variant A.'
  ),
  buildCase(
    {
      hostname: 'official.prize-claim.xyz',
      title: 'Final Notice — Unclaimed Prize Award',
      url: 'https://official.prize-claim.xyz/final',
      text: 'FINAL NOTICE: Your sweepstakes prize expires in 24 hours. Send gift card codes to redeem. Processing fee required. Contact winner-support@prize-claim-network.xyz or call 1-800-555-0199.',
    },
    'Demo fixture: lottery scam variant B — same domain family.'
  ),

  /* Shared payment method cluster: crypto/bitcoin (different domains) */
  buildCase(
    {
      hostname: 'crypto-recovery-help.top',
      title: 'Recover Your Lost Crypto — Guaranteed',
      url: 'https://crypto-recovery-help.top/recover',
      text: 'We can recover your lost bitcoin wallet. Send 0.1 BTC processing fee to our bitcoin wallet address. Guaranteed recovery within 48 hours. Act now before your funds are lost forever.',
    },
    'Demo fixture: crypto recovery scam.'
  ),
  buildCase(
    {
      hostname: 'secure-investment-returns.click',
      title: 'Double Your Bitcoin — Limited Slots',
      url: 'https://secure-investment-returns.click/invest',
      text: 'Exclusive crypto investment opportunity. Send bitcoin to receive 3x returns immediately. Only 10 slots remaining. Wire transfer or crypto accepted. Do not tell anyone about this private opportunity.',
    },
    'Demo fixture: crypto investment scam — shares crypto payment with case above.'
  ),
];

/* ── Run clustering ── */

console.log('='.repeat(60));
console.log('STING — Scam Cluster Intelligence Demo');
console.log('='.repeat(60));
console.log(`\nAnalyzing ${mockCases.length} reported scam cases...\n`);

const clusters = clusterCases(mockCases);
console.log(`Identified ${clusters.length} suspected cluster(s).\n`);

const profiles = clusters.map((cluster, idx) => buildClusterProfile(cluster, idx));

/* ── Print cluster profiles ── */

for (const profile of profiles) {
  console.log('-'.repeat(60));
  console.log(formatClusterMarkdown(profile));
}

/* ── Save JSON output ── */

const outDir = path.join(process.cwd(), 'data');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'cluster-profiles-demo.json');
fs.writeFileSync(outPath, JSON.stringify(profiles, null, 2));
console.log('-'.repeat(60));
console.log(`\nCluster profiles saved to: ${outPath}`);
console.log(`\nDisclaimer: ${DISCLAIMER}`);
console.log();
