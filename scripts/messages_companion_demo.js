#!/usr/bin/env node
/**
 * messages_companion_demo.js — CLI demo of the STING Messages Companion.
 *
 * Feeds sample text messages through the STING scoring engine and shows
 * how a companion inbox would sort and quarantine suspicious SMS.
 *
 * Usage: node scripts/messages_companion_demo.js
 */

const { analyzeScamSurface, scoreText } = require('../src/scamSignals.js');

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';

function hr() { console.log(DIM + '\u2500'.repeat(60) + RESET); }

const messages = [
  { sender: 'Mom', body: 'Hey honey, dinner at 7?' },
  { sender: 'USPS', body: 'Your package cannot be delivered. Click here to reschedule: bit.ly/usps-redeliver. Redelivery fee of $1.99 required. Act now or package will be returned.' },
  { sender: 'Bank Alert', body: 'Unusual activity detected on your account. Verify now to avoid suspension: secure-bank-verify.com. Bank security fraud department. Account locked within 24 hours if unverified.' },
  { sender: 'Sarah', body: 'Running 10 min late!' },
  { sender: 'Prize Center', body: 'Congratulations! You won $500K! Claim within 24hrs at prize-claim-center.com. Processing fee of $49.99 via gift card required. Act now \u2014 limited time offer. Do not tell anyone until verified.' },
];

console.log(`\n${BOLD}${CYAN}\u2554${'═'.repeat(58)}\u2557${RESET}`);
console.log(`${BOLD}${CYAN}\u2551   STING Messages Companion \u2014 CLI Demo${' '.repeat(19)}\u2551${RESET}`);
console.log(`${BOLD}${CYAN}\u255A${'═'.repeat(58)}\u255D${RESET}\n`);

const quarantined = [];
const safe = [];

for (const msg of messages) {
  const result = analyzeScamSurface({ text: msg.body });
  const isQuarantine = result.risk === 'high' || result.risk === 'medium';
  const verdict = isQuarantine ? 'QUARANTINE' : 'SAFE';
  const color = result.risk === 'high' ? RED : result.risk === 'medium' ? YELLOW : GREEN;
  const topSignal = result.findings.length > 0
    ? result.findings.reduce((a, b) => a.weight >= b.weight ? a : b).label
    : 'None';

  console.log(`  ${BOLD}${msg.sender}${RESET}`);
  console.log(`  ${DIM}${msg.body.length > 60 ? msg.body.slice(0, 57) + '...' : msg.body}${RESET}`);
  console.log(`  Verdict: ${color}${BOLD}${verdict}${RESET} | Score: ${color}${result.score}/100${RESET} | Top signal: ${topSignal}`);
  console.log('');

  if (isQuarantine) {
    quarantined.push({ sender: msg.sender, score: result.score, risk: result.risk });
  } else {
    safe.push({ sender: msg.sender, score: result.score });
  }
}

hr();
console.log(`\n${BOLD}${CYAN}Sorted Inbox${RESET}\n`);

console.log(`  ${GREEN}${BOLD}Safe Messages${RESET}`);
for (const m of safe) {
  console.log(`    ${GREEN}\u2713${RESET} ${m.sender} (score: ${m.score})`);
}

console.log(`\n  ${RED}${BOLD}Quarantined Messages${RESET}`);
for (const m of quarantined) {
  const color = m.risk === 'high' ? RED : YELLOW;
  console.log(`    ${color}\u26A0${RESET} ${m.sender} (score: ${m.score}, ${m.risk} risk)`);
}

console.log(`\n${BOLD}${CYAN}\u2554${'═'.repeat(58)}\u2557${RESET}`);
console.log(`${BOLD}${CYAN}\u2551${RESET}  ${GREEN}${safe.length} safe${RESET} | ${RED}${quarantined.length} quarantined${RESET} | ${messages.length} total${' '.repeat(20)}${BOLD}${CYAN}\u2551${RESET}`);
console.log(`${BOLD}${CYAN}\u255A${'═'.repeat(58)}\u255D${RESET}\n`);
