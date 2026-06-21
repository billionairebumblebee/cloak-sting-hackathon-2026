#!/usr/bin/env node
/**
 * family_packet_demo.js — Demonstrates the Family Rescue Packet generator
 * with three real-world scam scenarios.
 *
 * Usage: node scripts/family_packet_demo.js
 */

const { analyzeScamSurface } = require('../src/scamSignals.js');
const { generateFamilyPacket, formatPacketPlainText, validatePacket } = require('../src/familyRescue.js');

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const DIM = '\x1b[2m';

function hr() { console.log(DIM + '─'.repeat(60) + RESET); }

console.log(`\n${BOLD}${CYAN}╔════════════════════════════════════════════════════════╗${RESET}`);
console.log(`${BOLD}${CYAN}║      STING — Family Rescue Packet Demo                 ║${RESET}`);
console.log(`${BOLD}${CYAN}╚════════════════════════════════════════════════════════╝${RESET}\n`);

const scenarios = [
  {
    name: 'Scenario 1: Grandparent receives fake bank phishing',
    description: 'Grandma got a text saying her bank account is locked and she needs to verify immediately.',
    input: {
      hostname: 'chase-secure-verify.net',
      title: 'Chase Bank - Verify Your Identity',
      text: 'URGENT: Your account has been suspended due to suspicious activity. Verify now with your password and one-time security code. Bank security fraud department. Final notice — act now immediately within 24 hours or your account will be permanently locked. Do not contact your local branch. Only through this page can your account be restored.'
    }
  },
  {
    name: 'Scenario 2: Parent receives prize / gift card scam',
    description: 'Dad got an email saying he won a prize but needs to pay a processing fee with gift cards.',
    input: {
      hostname: 'mega-prize-winner-claim.click',
      title: 'Congratulations! You Won $50,000!',
      text: 'You have been selected as our grand prize winner! To claim your $50,000 prize, you must pay a processing fee of $499. Payment accepted via gift card or wire transfer only. Act now — this offer expires within 24 hours. Limited time. Do not tell anyone about this prize until it is processed. Keep this confidential.'
    }
  },
  {
    name: 'Scenario 3: Elderly neighbor gets tech support scam',
    description: 'The neighbor\'s computer showed a scary popup saying to call "Microsoft Support" immediately.',
    input: {
      hostname: 'microsoft-support-alert-fix.top',
      title: 'CRITICAL VIRUS ALERT - Microsoft Support',
      text: 'WARNING: Your computer has been infected with a dangerous virus. Call Microsoft Support immediately at 1-888-555-0199. Do not turn off your computer. Your personal files, passwords, and bank information are at risk. Our certified Microsoft support technician will need remote access to fix this. Processing fee of $299 via gift card required. Verify now. Apple support. Do not hang up. Stay on the line.'
    }
  }
];

let allValid = true;

for (let i = 0; i < scenarios.length; i++) {
  const s = scenarios[i];
  console.log(`${BOLD}${CYAN}${s.name}${RESET}`);
  console.log(`${DIM}${s.description}${RESET}\n`);

  const scanResult = analyzeScamSurface(s.input);
  const packet = generateFamilyPacket({ ...scanResult, hostname: s.input.hostname });
  const validation = validatePacket(packet, scanResult);
  const plainText = formatPacketPlainText(packet);

  console.log(plainText);
  console.log('');

  const validColor = validation.valid ? GREEN : RED;
  console.log(`${validColor}Validation: ${validation.valid ? 'PASSED' : 'FAILED'}${RESET} | Signal coverage: ${validation.signalCoverage}%`);
  if (!validation.valid) {
    allValid = false;
    for (const issue of validation.issues) {
      console.log(`  ${RED}• ${issue}${RESET}`);
    }
  }
  console.log('');
  hr();
  console.log('');
}

console.log(`${BOLD}${CYAN}╔════════════════════════════════════════════════════════╗${RESET}`);
console.log(`${BOLD}${CYAN}║                  DEMO COMPLETE                         ║${RESET}`);
console.log(`${BOLD}${CYAN}╠════════════════════════════════════════════════════════╣${RESET}`);
console.log(`${BOLD}${CYAN}║${RESET}  Scenarios: ${GREEN}${scenarios.length}${RESET}                                        ${BOLD}${CYAN}║${RESET}`);
console.log(`${BOLD}${CYAN}║${RESET}  All valid: ${allValid ? GREEN + 'YES' : RED + 'NO'}${RESET}                                       ${BOLD}${CYAN}║${RESET}`);
console.log(`${BOLD}${CYAN}╚════════════════════════════════════════════════════════╝${RESET}\n`);
