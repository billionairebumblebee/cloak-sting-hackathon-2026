const { normalizeReceiptToCase } = require('../src/caseStore.js');
const { getReportingChannels, buildReportPacket, getAuthorityLinks, formatReportPlainText } = require('../src/reportingRoute.js');

function separator(title) {
  console.log('\n' + '='.repeat(60));
  console.log(`  ${title}`);
  console.log('='.repeat(60));
}

/* ── Case 1: Bank phishing ── */
separator('CASE 1: Bank Phishing Email');

const bankReceipt = {
  url: 'https://secure-bankofamerica-verify.click/login',
  hostname: 'secure-bankofamerica-verify.click',
  title: 'Bank of America - Verify Your Account',
  risk: 'high',
  score: 82,
  advice: 'Your real bank will never ask for your password by email. Call the number on your card.',
  findings: [
    { type: 'domain', label: 'Risky novelty top-level domain', weight: 10, evidence: '.click TLD' },
    { type: 'domain', label: 'Brand impersonation pattern', weight: 22, evidence: 'bankofamerica in hostname' },
    { type: 'impersonation', label: 'Trusted institution language', weight: 14, evidence: 'bank security' },
    { type: 'impersonation', label: 'Trusted institution language', weight: 14, evidence: 'fraud department' },
    { type: 'copy', label: 'Urgency pressure', weight: 12, evidence: 'verify now' },
    { type: 'payment', label: 'Unusual payment request', weight: 18, evidence: 'wire transfer' },
  ],
};

const bankCase = normalizeReceiptToCase(bankReceipt);
const bankChannels = getReportingChannels(bankCase);
const bankPacket = buildReportPacket(bankCase, bankChannels);

console.log('\nRouted to channels:');
for (const ch of bankPacket.recommendedChannels) {
  console.log(`  -> ${ch.name}${ch.url ? ' (' + ch.url + ')' : ''}`);
  console.log(`     Reason: ${ch.reason}`);
}

console.log('\nAuthority links:', getAuthorityLinks(bankChannels));
console.log('\n--- Plain Text Report ---');
console.log(formatReportPlainText(bankPacket));

/* ── Case 2: Crypto drain ── */
separator('CASE 2: Crypto Wallet Drain');

const cryptoReceipt = {
  url: 'https://metamask-security-update.xyz/verify-wallet',
  hostname: 'metamask-security-update.xyz',
  title: 'MetaMask Security Update - Enter Seed Phrase',
  risk: 'high',
  score: 90,
  advice: 'Legitimate companies do not demand crypto payments. This is irreversible and almost certainly fraud.',
  findings: [
    { type: 'domain', label: 'Risky novelty top-level domain', weight: 10, evidence: '.xyz TLD' },
    { type: 'crypto-harvest', label: 'Crypto credential harvesting', weight: 22, evidence: 'seed phrase' },
    { type: 'crypto-harvest', label: 'Crypto credential harvesting', weight: 22, evidence: 'enter your 12 words' },
    { type: 'copy', label: 'Urgency pressure', weight: 12, evidence: 'immediately' },
    { type: 'payment', label: 'Unusual payment request', weight: 18, evidence: 'bitcoin' },
    { type: 'credential', label: 'Repeated credential/code request', weight: 16, evidence: '3 credential terms' },
  ],
};

const cryptoCase = normalizeReceiptToCase(cryptoReceipt);
const cryptoChannels = getReportingChannels(cryptoCase);
const cryptoPacket = buildReportPacket(cryptoCase, cryptoChannels);

console.log('\nRouted to channels:');
for (const ch of cryptoPacket.recommendedChannels) {
  console.log(`  -> ${ch.name}${ch.url ? ' (' + ch.url + ')' : ''}`);
  console.log(`     Reason: ${ch.reason}`);
}

console.log('\nAuthority links:', getAuthorityLinks(cryptoChannels));

/* ── Case 3: Phone ransom scam ── */
separator('CASE 3: Phone Ransom / Extortion Call');

const phoneReceipt = {
  url: '',
  hostname: '',
  title: 'Voice call transcription',
  risk: 'high',
  score: 88,
  advice: 'Do not enter information, send money, or call numbers on this page. Verify through the official app or type the real website address yourself.',
  findings: [
    { type: 'ransom', label: 'Hostage / ransom threat', weight: 22, evidence: 'we have your daughter' },
    { type: 'ransom', label: 'Hostage / ransom threat', weight: 22, evidence: "don't call the police" },
    { type: 'ransom', label: 'Hostage / ransom threat', weight: 22, evidence: 'wire the money' },
    { type: 'payment', label: 'Unusual payment request', weight: 18, evidence: 'bitcoin' },
    { type: 'social-engineering', label: 'Social engineering tactic', weight: 12, evidence: 'stay on the line' },
    { type: 'deepfake', label: 'Possible AI deepfake/robocall indicator', weight: 8, evidence: 'this is not a recording' },
  ],
};

const phoneCase = normalizeReceiptToCase(phoneReceipt);
const phoneChannels = getReportingChannels(phoneCase);
const phonePacket = buildReportPacket(phoneCase, phoneChannels);

console.log('\nRouted to channels:');
for (const ch of phonePacket.recommendedChannels) {
  console.log(`  -> ${ch.name}${ch.url ? ' (' + ch.url + ')' : ''}`);
  console.log(`     Reason: ${ch.reason}`);
}

console.log('\nAuthority links:', getAuthorityLinks(phoneChannels));
console.log('\n--- Plain Text Report (Phone Ransom) ---');
console.log(formatReportPlainText(phonePacket));

separator('DEMO COMPLETE');
console.log('All three scam types routed successfully.\n');
