const test = require('node:test');
const assert = require('node:assert/strict');
const { matchVoicePattern, VOICE_SCAM_PATTERNS } = require('../src/voicePatterns.js');

test('matches IRS scam transcript', () => {
  const transcript = 'This is the IRS. We have filed a lawsuit against you for unpaid back taxes. You must pay immediately or agents will be dispatched to arrest you.';
  const matches = matchVoicePattern(transcript);
  assert.ok(matches.length > 0);
  assert.equal(matches[0].pattern, 'irs-tax');
  assert.equal(matches[0].riskLevel, 'critical');
});

test('matches tech support scam', () => {
  const transcript = 'Hello this is Microsoft support calling. We detected a virus on your system. Your computer has been compromised. Please give me remote access using TeamViewer.';
  const matches = matchVoicePattern(transcript);
  assert.ok(matches.some((m) => m.pattern === 'tech-support'));
});

test('matches romance scam', () => {
  const transcript = 'Darling, I am stuck overseas and my accounts are frozen. I need money for a plane ticket. Please send money through Western Union. Do not tell your family about this.';
  const matches = matchVoicePattern(transcript);
  assert.ok(matches.some((m) => m.pattern === 'romance'));
});

test('matches crypto investment scam', () => {
  const transcript = 'This is an exclusive investment opportunity. Our AI trading bot generates guaranteed returns of 500 percent. Send your crypto to this wallet now. Limited spots available.';
  const matches = matchVoicePattern(transcript);
  assert.ok(matches.some((m) => m.pattern === 'crypto-investment'));
});

test('matches kidnapping ransom scam', () => {
  const transcript = 'We have your daughter. Do not call the police. Wire the money in bitcoin. You have one hour or your child will be harmed.';
  const matches = matchVoicePattern(transcript);
  assert.ok(matches.some((m) => m.pattern === 'kidnapping-ransom'));
  assert.equal(matches[0].riskLevel, 'critical');
});

test('matches grandparent scam', () => {
  const transcript = 'Grandma it is me. I have been arrested and I need bail money. My lawyer says I need you to send money right away. Please do not tell mom and dad.';
  const matches = matchVoicePattern(transcript);
  assert.ok(matches.some((m) => m.pattern === 'grandparent'));
});

test('matches lottery scam', () => {
  const transcript = 'Congratulations! You have won the international sweepstakes. To claim your prize, please pay a processing fee of 500 dollars. Wire the handling fee now.';
  const matches = matchVoicePattern(transcript);
  assert.ok(matches.some((m) => m.pattern === 'lottery-prize'));
});

test('matches utility shutoff scam', () => {
  const transcript = 'This is your electric company. Your power will be shut off today. Your account is severely overdue. Pay immediately to avoid shutoff.';
  const matches = matchVoicePattern(transcript);
  assert.ok(matches.some((m) => m.pattern === 'utility-shutoff'));
});

test('no match for safe transcript', () => {
  const transcript = 'Hi, I am calling to confirm your dentist appointment for tomorrow at 2pm. Please call back to confirm.';
  const matches = matchVoicePattern(transcript);
  assert.equal(matches.length, 0);
});

test('returns counter-advice for matched patterns', () => {
  const transcript = 'The IRS has filed a lawsuit. Pay your back taxes now or you will be arrested.';
  const matches = matchVoicePattern(transcript);
  assert.ok(matches[0].counterAdvice.length > 0);
  assert.ok(matches[0].counterAdvice[0].includes('IRS'));
});

test('multiple patterns can match', () => {
  const transcript = 'This is Microsoft support. We detected a virus on your system. Your computer has been compromised. Give me remote access now. Also you have won the international sweepstakes. Pay a processing fee to claim your prize.';
  const matches = matchVoicePattern(transcript);
  assert.ok(matches.length >= 2, `Expected 2+ matches, got ${matches.length}`);
});

test('pattern library has at least 8 patterns', () => {
  assert.ok(VOICE_SCAM_PATTERNS.length >= 8);
});
