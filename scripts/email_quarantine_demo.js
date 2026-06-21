#!/usr/bin/env node
/**
 * email_quarantine_demo.js — CLI demonstration of STING email quarantine.
 *
 * Analyzes 6 email subjects + bodies through the STING scoring engine
 * and prints sender, subject, verdict, score, and top signal.
 *
 * Usage: node scripts/email_quarantine_demo.js
 */

const { analyzeScamSurface, scoreText } = require('../src/scamSignals.js');

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';

function hr() { console.log(DIM + '\u2500'.repeat(70) + RESET); }

const emails = [
  {
    from: 'Sarah Chen',
    subject: 'Lunch tomorrow?',
    body: 'Hey! Want to grab lunch tomorrow at that new Thai place on Market St? I heard their pad thai is amazing. Let me know if noon works for you.'
  },
  {
    from: 'Apple Support',
    subject: 'Your Apple ID has been locked! Verify immediately',
    body: 'Dear Customer, Your Apple ID has been locked due to suspicious activity. You must verify your identity immediately or your account will be permanently suspended. Click here to verify now. Enter your password, security code, and payment information to restore access. Act now \u2014 final notice.'
  },
  {
    from: 'HR Department',
    subject: 'Updated benefits enrollment deadline',
    body: 'Hi team, Just a reminder that the benefits enrollment period has been extended to July 15th. Please review the updated plan options on the HR portal. Let us know if you have questions.'
  },
  {
    from: 'PayPal Security',
    subject: 'Unusual activity \u2014 confirm identity or account will be suspended',
    body: 'We detected unusual activity on your PayPal account. Your account will be suspended within 24 hours unless you verify now. Confirm your identity by entering your password and one-time security code. This is urgent \u2014 act now immediately to avoid account locked status. Do not ignore this final notice.'
  },
  {
    from: 'Amazon Delivery',
    subject: 'Your package #AMZ-8847291 is being held \u2014 pay $2.99 redelivery fee',
    body: 'Your package #AMZ-8847291 could not be delivered. To schedule redelivery, a small processing fee of $2.99 is required. Pay the redelivery fee now to release your package. This is a limited time offer before the package is returned to sender.'
  },
  {
    from: 'Dad',
    subject: 'Re: Weekend plans',
    body: "Sounds good! Let's do the barbecue on Saturday. I'll pick up the steaks. Mom says she'll bring her potato salad. See you around 3?"
  }
];

console.log(`\n${BOLD}${CYAN}\u2554${'═'.repeat(60)}\u2557${RESET}`);
console.log(`${BOLD}${CYAN}\u2551    STING Email Shield \u2014 Quarantine Demo${' '.repeat(19)}\u2551${RESET}`);
console.log(`${BOLD}${CYAN}\u255A${'═'.repeat(60)}\u255D${RESET}\n`);

console.log(`${DIM}Analyzing ${emails.length} emails through STING scoring engine...${RESET}\n`);
hr();

let quarantined = 0;
let safe = 0;

for (const email of emails) {
  const fullText = `${email.subject} ${email.body}`;
  const findings = scoreText(fullText);
  const rawScore = findings.reduce((sum, f) => sum + f.weight, 0);
  const score = Math.min(100, rawScore);

  let level = 'low';
  if (score >= 65) level = 'high';
  else if (score >= 35) level = 'medium';

  const isQuarantined = level === 'high' || level === 'medium';
  const verdict = isQuarantined ? 'QUARANTINE' : 'SAFE';
  const verdictColor = isQuarantined ? RED : GREEN;
  const topSignal = findings.length > 0 ? findings[0].label : 'None';

  if (isQuarantined) quarantined++;
  else safe++;

  console.log(`\n  ${BOLD}From:${RESET} ${email.from}`);
  console.log(`  ${BOLD}Subject:${RESET} ${email.subject}`);
  console.log(`  ${BOLD}Verdict:${RESET} ${verdictColor}${verdict}${RESET}  |  Score: ${verdictColor}${score}/100${RESET}  |  Top signal: ${DIM}${topSignal}${RESET}`);

  if (findings.length > 1) {
    const others = findings.slice(1, 3).map(f => f.label).join(', ');
    console.log(`  ${DIM}Other signals: ${others}${RESET}`);
  }
}

hr();
console.log(`\n${BOLD}Summary:${RESET} ${GREEN}${safe} safe${RESET} | ${RED}${quarantined} quarantined${RESET}\n`);
console.log(`${DIM}Demo simulation. Email scanning requires integration with your email provider.${RESET}\n`);
