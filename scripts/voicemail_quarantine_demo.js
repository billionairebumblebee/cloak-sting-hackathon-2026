/**
 * Voicemail Quarantine CLI Demo
 *
 * Feeds 5 voicemail transcripts through the STING scoring engine
 * and prints caller, verdict, score, and top signals.
 */

const { scoreText, analyzeVoiceTranscript } = require('../src/scamSignals.js');

const voicemails = [
  {
    caller: 'Mom',
    duration: '0:12',
    transcript: 'Hi sweetie, just calling to check in. Love you!'
  },
  {
    caller: 'Unknown',
    duration: '0:34',
    transcript: 'This is the IRS. You owe back taxes and must act now. Failure to pay immediately will result in arrest. This is your final notice. Send payment via gift card to avoid further action.'
  },
  {
    caller: 'Dr. Park',
    duration: '0:08',
    transcript: "This is Dr. Park's office confirming your appointment Thursday."
  },
  {
    caller: 'Unknown',
    duration: '1:02',
    transcript: "Grandma? It's me, I'm in jail and I need bail money. I need you to send $5,000 in gift cards. Do not tell mom and dad. Do not contact anyone else. Only through this page can you help."
  },
  {
    caller: 'Bank',
    duration: '0:22',
    transcript: "This is your bank's fraud department. Your account has been suspended. You must verify now to avoid permanent closure. Provide your password and security code immediately. Do not contact your branch."
  }
];

function analyzeText(text) {
  const findings = scoreText(text);
  const voiceMatches = analyzeVoiceTranscript(text);

  // Combine scoreText weight with voice pattern match scores
  let rawScore = findings.reduce((sum, f) => sum + f.weight, 0);
  if (voiceMatches && voiceMatches.length > 0) {
    rawScore += voiceMatches[0].score;
  }
  const score = Math.min(100, rawScore);
  let level = 'low';
  if (score >= 65) level = 'high';
  else if (score >= 35) level = 'medium';

  return { score, level, findings, voiceMatches };
}

console.log('='.repeat(60));
console.log('  STING Voicemail Quarantine — CLI Demo');
console.log('  Analyzes voicemail transcripts for scam signals');
console.log('='.repeat(60));
console.log();

for (const vm of voicemails) {
  const result = analyzeText(vm.transcript);
  const verdict = result.level === 'high' ? 'SCAM'
    : result.level === 'medium' ? 'SUSPICIOUS' : 'SAFE';

  const verdictColor = verdict === 'SCAM' ? '\x1b[31m'
    : verdict === 'SUSPICIOUS' ? '\x1b[33m' : '\x1b[32m';
  const reset = '\x1b[0m';

  console.log(`Caller: ${vm.caller} (${vm.duration})`);
  console.log(`Verdict: ${verdictColor}${verdict}${reset}  |  Score: ${result.score}/100`);

  if (result.findings.length > 0) {
    const topSignals = result.findings.slice(0, 3).map(f => f.label);
    console.log(`Signals: ${topSignals.join(', ')}`);
  } else {
    console.log('Signals: None');
  }

  if (result.voiceMatches && result.voiceMatches.length > 0) {
    console.log(`Pattern: ${result.voiceMatches[0].name}`);
  }

  console.log('-'.repeat(60));
}

console.log();
console.log('Demo complete. STING analyzes voicemail transcripts where platform APIs allow.');
