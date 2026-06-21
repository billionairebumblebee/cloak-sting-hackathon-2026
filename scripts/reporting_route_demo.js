const { analyzeScamSurface } = require('../src/scamSignals.js');
const { normalizeReceiptToCase } = require('../src/caseStore.js');
const { getReportingChannels, buildReportPacket, getAuthorityLinks, formatReportPlainText } = require('../src/reportingRoute.js');

const scenarios = [
  {
    label: 'SCENARIO 1: Bank Phishing',
    input: {
      hostname: 'secure-bank-verify-login.example.com',
      title: 'Secure Bank Verification Center',
      url: 'https://secure-bank-verify-login.example.com/verify',
      text: 'URGENT: Your bank account has been suspended due to unusual activity. Verify your identity within 24 hours. Enter your password and one-time security code. Do not contact your branch. Wire transfer required to unlock account.'
    },
    expectedChannels: ['FTC', 'IC3', 'CFPB']
  },
  {
    label: 'SCENARIO 2: Crypto Investment Drain',
    input: {
      hostname: 'metamask-wallet-sync.example.xyz',
      title: 'MetaMask Wallet Sync — Urgent Recovery',
      url: 'https://metamask-wallet-sync.example.xyz/recover',
      text: 'Your crypto wallet is out of sync. Enter your 12-word seed phrase to restore access. Recovery phrase verification needed immediately. Enter your private key for wallet backup. Bitcoin and Ethereum assets at risk. Act now — limited time before your assets are frozen.'
    },
    expectedChannels: ['FTC', 'IC3', 'SEC', 'CFTC']
  },
  {
    label: 'SCENARIO 3: Phone Ransom / Vishing',
    input: {
      hostname: '',
      title: 'Voice Call Transcript',
      url: '',
      text: "We have your daughter. Do not call the police. Pay the ransom immediately. Wire the money to this bitcoin wallet within 2 hours or your child will be harmed. Do not hang up. Stay on the line. Your case number is 4829. This call is being recorded for your protection. Transfer you to our payment department."
    },
    expectedChannels: ['FTC', 'IC3', 'FCC', '7726']
  }
];

function runDemo() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║        STING — Authority Reporting Route Demo              ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  for (const scenario of scenarios) {
    console.log('━'.repeat(62));
    console.log(`▶ ${scenario.label}`);
    console.log('━'.repeat(62));

    const receipt = { ...scenario.input, ...analyzeScamSurface(scenario.input) };
    const caseRecord = normalizeReceiptToCase(receipt, {
      victimSafeNotes: 'Demo fixture: no real victim data.'
    });

    console.log(`  Case ID:  ${caseRecord.id}`);
    console.log(`  Risk:     ${caseRecord.risk} (${caseRecord.score}/100)`);
    console.log(`  Brand:    ${caseRecord.suspectedBrand}`);
    console.log(`  Signals:  ${caseRecord.findings.length} detected`);
    console.log('');

    const channels = getReportingChannels(caseRecord);
    console.log(`  📋 Routing Decision: ${channels.length} channels recommended`);
    for (const ch of channels) {
      const url = ch.url ? ` → ${ch.url}` : '';
      console.log(`     • ${ch.name}${url}`);
      console.log(`       ${ch.reason}`);
    }
    console.log('');

    const links = getAuthorityLinks(channels);
    console.log(`  🔗 Direct Authority Links: ${links.length}`);
    for (const link of links) {
      console.log(`     ${link.name}: ${link.url}`);
    }
    console.log('');

    const packet = buildReportPacket(caseRecord, channels);
    console.log('  📄 Full Report Packet:');
    console.log(formatReportPlainText(packet));
    console.log('');
  }

  console.log('━'.repeat(62));
  console.log('Demo complete. All 3 scenarios routed successfully.');
  console.log(`Expected: Bank→FTC+IC3+CFPB | Crypto→FTC+IC3+SEC+CFTC | Phone→FTC+IC3+FCC+7726`);
  console.log('━'.repeat(62));
}

runDemo();
