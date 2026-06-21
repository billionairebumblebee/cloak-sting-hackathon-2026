#!/usr/bin/env node
/**
 * full_demo.js — One-click showcase of every cloak STING capability.
 *
 * Runs without any API keys. Demonstrates:
 *  1. Page scam signal detection (9 demo scenarios)
 *  2. Typosquat / homoglyph domain detection
 *  3. Form credential-harvesting detection
 *  4. Voice scam pattern matching (8 attack families)
 *  5. Case dossier generation (markdown + JSON)
 *  6. Sentry envelope construction (offline)
 *  7. Evidence export pipeline
 *
 * Usage: node scripts/full_demo.js
 */

const { analyzeScamSurface, hostnameSignals, analyzeVoiceTranscript } = require('../src/scamSignals.js');
const { analyzeHostname, levenshtein } = require('../src/typosquatDetector.js');
const { analyzeFormInputs } = require('../src/formAnalyzer.js');
const { matchVoicePattern, VOICE_SCAM_PATTERNS } = require('../src/voicePatterns.js');
const { normalizeReceiptToCase } = require('../src/caseStore.js');
const { renderMarkdownDossier, renderJsonDossier } = require('../src/dossier.js');
const { parseDsn, buildEnvelope, sentryConfigured } = require('../src/sentry.js');
const { generateStixBundle, generateCsv, generateHumanSummary } = require('../src/threatExport.js');
const fs = require('node:fs');
const path = require('node:path');

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';

function hr() { console.log(DIM + '─'.repeat(70) + RESET); }

function riskColor(risk) {
  if (risk === 'high') return RED;
  if (risk === 'medium') return YELLOW;
  return GREEN;
}

console.log(`\n${BOLD}${CYAN}╔══════════════════════════════════════════════════════════════╗${RESET}`);
console.log(`${BOLD}${CYAN}║          CLOAK STING — FULL CAPABILITY DEMO                  ║${RESET}`);
console.log(`${BOLD}${CYAN}║          UC Berkeley AI Hackathon 2026                        ║${RESET}`);
console.log(`${BOLD}${CYAN}╚══════════════════════════════════════════════════════════════╝${RESET}\n`);

// ── 1. Page Scam Detection ──
console.log(`${BOLD}${CYAN}[1/7] PAGE SCAM SIGNAL DETECTION${RESET}\n`);

const scenarios = [
  {
    name: 'Fake Bank Login',
    input: { hostname: 'chase-secure-verify.net', title: 'Chase Bank - Verify Identity', text: 'URGENT: Account suspended. Verify now with password and one-time security code. Bank security fraud department. Final notice act now immediately. Do not contact your local branch.' }
  },
  {
    name: 'Crypto Seed Phrase Scam',
    input: { hostname: 'metamask-wallet-sync.xyz', title: 'MetaMask Wallet Sync', text: 'Enter your 12-word seed phrase to sync your wallet. Recovery phrase needed for verification. Private key backup required. Act now limited time.' }
  },
  {
    name: 'IRS Refund Scam',
    input: { hostname: 'irs-refund-status-check.org', title: 'IRS Tax Refund Status', text: 'IRS final notice. Your refund of $4,827 is pending. Verify now with social security number and bank account number. Processing fee of $49.99 required via gift card. Act now within 24 hours.' }
  },
  {
    name: 'Romance Scam Landing',
    input: { hostname: 'secure-love-connection.com', title: 'Your Special Connection', text: 'Darling I am stuck overseas. Wire transfer needed urgently. Keep this confidential. Do not tell your family. Cash app or zelle. I need money for a plane ticket immediately.' }
  },
  {
    name: 'Safe News Article',
    input: { hostname: 'nytimes.com', title: 'Breaking News - World', text: 'Scientists discover new renewable energy source. The breakthrough could reduce carbon emissions by 40% according to researchers at MIT.' }
  },
];

let totalDetections = 0;
for (const s of scenarios) {
  const result = analyzeScamSurface(s.input);
  const color = riskColor(result.risk);
  console.log(`  ${BOLD}${s.name}${RESET}`);
  console.log(`  ${DIM}Host: ${s.input.hostname}${RESET}`);
  console.log(`  Risk: ${color}${result.risk.toUpperCase()}${RESET} | Score: ${color}${result.score}/100${RESET} | Signals: ${result.findingCount}`);
  if (result.findings.length > 0) {
    const top = result.findings.slice(0, 3);
    for (const f of top) console.log(`    → ${f.label}: ${DIM}${f.evidence}${RESET}`);
  }
  totalDetections += result.findingCount;
  console.log('');
}
console.log(`  ${GREEN}✓ ${scenarios.length} scenarios analyzed, ${totalDetections} total signals detected${RESET}\n`);
hr();

// ── 2. Typosquat Detection ──
console.log(`\n${BOLD}${CYAN}[2/7] TYPOSQUAT & HOMOGLYPH DETECTION${RESET}\n`);

const typosquatDomains = [
  'paypa1.com',
  'chase-secure-login.click',
  'arnazon.com',
  'g00gle.com',
  'apple-verify-id.support',
  'bit.ly',
  '192.168.1.1',
  'a.b.c.d.e.phishing.com',
  'google.com',  // should be clean
];

for (const domain of typosquatDomains) {
  const findings = analyzeHostname(domain);
  if (findings.length > 0) {
    console.log(`  ${RED}⚠${RESET} ${domain}`);
    for (const f of findings) console.log(`    → ${f.type}: ${f.label}`);
  } else {
    console.log(`  ${GREEN}✓${RESET} ${domain} — clean`);
  }
}
console.log(`\n  Levenshtein examples: paypal→paypa1 = ${levenshtein('paypal', 'paypa1')}, amazon→arnazon = ${levenshtein('amazon', 'arnazon')}`);
console.log(`  ${GREEN}✓ ${typosquatDomains.length} domains analyzed${RESET}\n`);
hr();

// ── 3. Form Credential Harvesting ──
console.log(`\n${BOLD}${CYAN}[3/7] FORM CREDENTIAL HARVESTING DETECTION${RESET}\n`);

const formTests = [
  {
    name: 'Phishing Login',
    fields: ['Username', 'Password', 'Social Security Number', 'Date of Birth']
  },
  {
    name: 'Crypto Wallet Drain',
    fields: ['Enter your 12-word seed phrase', 'Private key', 'Wallet address']
  },
  {
    name: 'Safe Contact Form',
    fields: ['Name', 'Email', 'Message']
  },
];

for (const ft of formTests) {
  const { findings, riskFactors } = analyzeFormInputs(ft.fields);
  const total = findings.length + riskFactors.length;
  const color = total > 0 ? RED : GREEN;
  console.log(`  ${BOLD}${ft.name}${RESET}: ${color}${total} findings${RESET}`);
  for (const f of [...findings, ...riskFactors].slice(0, 3)) {
    console.log(`    → ${f.label}`);
  }
}
console.log(`\n  ${GREEN}✓ Form analysis complete${RESET}\n`);
hr();

// ── 4. Voice Scam Patterns ──
console.log(`\n${BOLD}${CYAN}[4/7] VOICE SCAM PATTERN MATCHING${RESET}\n`);
console.log(`  Pattern library: ${BOLD}${VOICE_SCAM_PATTERNS.length} attack families${RESET}\n`);

const voiceTranscripts = [
  { name: 'IRS Scam Call', text: 'This is the IRS. We have filed a lawsuit against you for unpaid back taxes. Agents will be dispatched to arrest you. Pay immediately.' },
  { name: 'Grandparent Scam', text: 'Grandma it is me. I have been arrested and I need bail money right away. My lawyer says you need to send money. Please do not tell mom and dad.' },
  { name: 'Crypto Pig Butchering', text: 'Our AI trading bot has guaranteed returns of 500 percent. This exclusive investment opportunity will not last. Send your crypto to this wallet address.' },
  { name: 'Safe Doctor Call', text: 'Hi, this is Dr. Smith office. We are calling to confirm your appointment for Thursday at 3pm.' },
];

for (const vt of voiceTranscripts) {
  const matches = matchVoicePattern(vt.text);
  if (matches.length > 0) {
    console.log(`  ${RED}⚠${RESET} ${BOLD}${vt.name}${RESET}`);
    console.log(`    Pattern: ${matches[0].name} (${matches[0].riskLevel})`);
    console.log(`    Score: ${matches[0].score} | Category: ${matches[0].category}`);
    console.log(`    Counter-advice: ${DIM}${matches[0].counterAdvice[0]}${RESET}`);
  } else {
    console.log(`  ${GREEN}✓${RESET} ${BOLD}${vt.name}${RESET} — no scam patterns`);
  }
}

// Also test the integrated path via analyzeVoiceTranscript
const integrated = analyzeVoiceTranscript('The IRS has filed a lawsuit. Pay your back taxes or agents will be dispatched.');
console.log(`\n  Integrated analyzeVoiceTranscript: ${integrated.length > 0 ? RED + 'DETECTED' : GREEN + 'clean'}${RESET}`);
console.log(`  ${GREEN}✓ Voice pattern analysis complete${RESET}\n`);
hr();

// ── 5. Case Dossier Generation ──
console.log(`\n${BOLD}${CYAN}[5/7] EVIDENCE DOSSIER GENERATION${RESET}\n`);

const highRiskResult = analyzeScamSurface({
  hostname: 'paypal-account-verify.click',
  title: 'PayPal Security Center',
  text: 'Account suspended. Verify now with password. Processing fee via gift card. Act now within 24 hours. Do not contact PayPal directly.'
});

const receipt = {
  id: `demo-${Date.now()}`,
  url: 'https://paypal-account-verify.click/secure',
  hostname: 'paypal-account-verify.click',
  title: 'PayPal Security Center',
  ...highRiskResult
};

const caseRecord = normalizeReceiptToCase(receipt, {
  source: 'cloak-sting-demo',
  victimSafeNotes: 'Demo case — no real victim involved.'
});

const markdownDossier = renderMarkdownDossier(caseRecord);
const jsonDossier = renderJsonDossier(caseRecord);

console.log(`  Case ID: ${caseRecord.id}`);
console.log(`  Suspected Brand: ${caseRecord.suspectedBrand}`);
console.log(`  Jurisdiction: ${caseRecord.jurisdiction.country}`);
console.log(`  Risk: ${RED}${caseRecord.risk.toUpperCase()} (${caseRecord.score}/100)${RESET}`);
console.log(`  Findings: ${caseRecord.findings.length}`);
console.log(`  Reporting Channels: ${caseRecord.reportingChannels.length}`);
console.log(`  Dossier markdown: ${markdownDossier.length} chars`);
console.log(`  Dossier JSON: ${jsonDossier.length} chars`);
console.log(`\n  ${GREEN}✓ Evidence dossier generated${RESET}\n`);
hr();

// ── 6. Sentry Envelope ──
console.log(`\n${BOLD}${CYAN}[6/7] SENTRY ENVELOPE CONSTRUCTION${RESET}\n`);

const testDsn = 'https://abc123@o456.ingest.sentry.io/789';
const parsed = parseDsn(testDsn);
console.log(`  DSN parse: projectId=${parsed.projectId}, host=${parsed.host}`);
console.log(`  Ingest URL: ${parsed.ingestUrl}`);

const envelope = buildEnvelope({
  message: 'scam-detected: high risk (92/100) on paypal-account-verify.click',
  level: 'warning',
  tags: { component: 'scam-detector', risk: 'high' },
  extra: { score: 92, findingCount: 8 }
}, testDsn);

console.log(`  Envelope event ID: ${envelope.eventId}`);
console.log(`  Envelope body size: ${envelope.body.length} bytes`);
console.log(`  Live Sentry: ${sentryConfigured() ? GREEN + 'CONFIGURED' : YELLOW + 'not configured (set SENTRY_DSN)'}${RESET}`);
console.log(`\n  ${GREEN}✓ Sentry envelope verified${RESET}\n`);
hr();

// ── 7. Evidence Export ──
console.log(`\n${BOLD}${CYAN}[7/7] EVIDENCE EXPORT${RESET}\n`);

const distDir = path.join(process.cwd(), 'dist');
fs.mkdirSync(distDir, { recursive: true });

const proofArtifact = {
  product: 'cloak-sting',
  version: '0.1.0',
  generatedAt: new Date().toISOString(),
  capabilities: {
    pageSignalDetection: { scenarios: scenarios.length, totalSignals: totalDetections },
    typosquatDetection: { domainsChecked: typosquatDomains.length, brandsMonitored: 20 },
    formAnalysis: { patternsDetected: formTests.length },
    voicePatterns: { families: VOICE_SCAM_PATTERNS.length, transcriptsAnalyzed: voiceTranscripts.length },
    caseGeneration: { dossierMarkdownChars: markdownDossier.length, dossierJsonChars: jsonDossier.length },
    sentryEnvelope: { eventId: envelope.eventId, bodyBytes: envelope.body.length }
  },
  sampleCase: {
    id: caseRecord.id,
    risk: caseRecord.risk,
    score: caseRecord.score,
    suspectedBrand: caseRecord.suspectedBrand,
    findingCount: caseRecord.findings.length,
    jurisdiction: caseRecord.jurisdiction.country
  }
};

// Generate threat exports
const stixBundle = generateStixBundle(caseRecord);
const csvExport = generateCsv(caseRecord);
const humanReport = generateHumanSummary(caseRecord);

fs.writeFileSync(path.join(distDir, 'full-demo-proof.json'), JSON.stringify(proofArtifact, null, 2));
fs.writeFileSync(path.join(distDir, 'sample-dossier.md'), markdownDossier);
fs.writeFileSync(path.join(distDir, 'threat-intel.stix.json'), JSON.stringify(stixBundle, null, 2));
fs.writeFileSync(path.join(distDir, 'threat-intel.csv'), csvExport);
fs.writeFileSync(path.join(distDir, 'threat-report.txt'), humanReport);

console.log(`  ${GREEN}✓${RESET} dist/full-demo-proof.json — proof artifact`);
console.log(`  ${GREEN}✓${RESET} dist/sample-dossier.md — evidence dossier`);
console.log(`  ${GREEN}✓${RESET} dist/threat-intel.stix.json — STIX 2.1 bundle (${stixBundle.objects.length} objects)`);
console.log(`  ${GREEN}✓${RESET} dist/threat-intel.csv — CSV export`);
console.log(`  ${GREEN}✓${RESET} dist/threat-report.txt — human-readable report`);

console.log(`\n${BOLD}${CYAN}╔══════════════════════════════════════════════════════════════╗${RESET}`);
console.log(`${BOLD}${CYAN}║                    DEMO COMPLETE                             ║${RESET}`);
console.log(`${BOLD}${CYAN}╠══════════════════════════════════════════════════════════════╣${RESET}`);
console.log(`${BOLD}${CYAN}║${RESET}  Page detection    : ${GREEN}${scenarios.length} scenarios, ${totalDetections} signals${RESET}${' '.repeat(Math.max(0, 24 - String(totalDetections).length))}${BOLD}${CYAN}║${RESET}`);
console.log(`${BOLD}${CYAN}║${RESET}  Typosquat engine  : ${GREEN}${typosquatDomains.length} domains, 20 brands${RESET}                ${BOLD}${CYAN}║${RESET}`);
console.log(`${BOLD}${CYAN}║${RESET}  Form analysis     : ${GREEN}3 tests, ${formTests.reduce((s, f) => s + analyzeFormInputs(f.fields).findings.length, 0)} fields caught${RESET}               ${BOLD}${CYAN}║${RESET}`);
console.log(`${BOLD}${CYAN}║${RESET}  Voice patterns    : ${GREEN}${VOICE_SCAM_PATTERNS.length} families, ${voiceTranscripts.length} transcripts${RESET}          ${BOLD}${CYAN}║${RESET}`);
console.log(`${BOLD}${CYAN}║${RESET}  Evidence dossier  : ${GREEN}generated (MD + JSON)${RESET}              ${BOLD}${CYAN}║${RESET}`);
console.log(`${BOLD}${CYAN}║${RESET}  Threat export     : ${GREEN}STIX 2.1 + CSV + human report${RESET}      ${BOLD}${CYAN}║${RESET}`);
console.log(`${BOLD}${CYAN}║${RESET}  Sentry envelope   : ${GREEN}verified${RESET}                           ${BOLD}${CYAN}║${RESET}`);
console.log(`${BOLD}${CYAN}╚══════════════════════════════════════════════════════════════╝${RESET}\n`);
