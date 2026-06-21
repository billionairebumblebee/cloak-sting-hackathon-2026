const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { deepgramConfigured, extractTranscript, contentTypeForPath, transcribeWithDeepgram, analyzeVoiceScam } = require('../src/deepgramTranscribe.js');

function tempAudio() {
  const filePath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sting-audio-')), 'sample.wav');
  fs.writeFileSync(filePath, Buffer.from([0x52, 0x49, 0x46, 0x46]));
  return filePath;
}

test('detects Deepgram configuration and audio content types', () => {
  assert.equal(deepgramConfigured({}), false);
  assert.equal(deepgramConfigured({ DEEPGRAM_API_KEY: 'dg_key' }), true);
  assert.equal(contentTypeForPath('clip.wav'), 'audio/wav');
  assert.equal(contentTypeForPath('clip.mp3'), 'audio/mpeg');
});

test('extracts transcript from Deepgram channel alternatives', () => {
  const transcript = extractTranscript({
    results: { channels: [{ alternatives: [{ transcript: 'urgent bank fraud department verify your code' }] }] }
  });
  assert.equal(transcript, 'urgent bank fraud department verify your code');
});

test('transcribes through Deepgram without leaking token in result', async () => {
  const calls = [];
  const result = await transcribeWithDeepgram(tempAudio(), {
    env: { DEEPGRAM_API_KEY: 'secret-dg-token' },
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return {
        ok: true,
        json: async () => ({
          metadata: { duration: 4.2 },
          results: { channels: [{ detected_language: 'en', alternatives: [{ transcript: 'verify your password immediately' }] }] }
        })
      };
    }
  });
  assert.equal(result.configured, true);
  assert.equal(result.transcript, 'verify your password immediately');
  assert.equal(calls[0].init.headers.Authorization, 'Token secret-dg-token');
  assert.equal(JSON.stringify(result).includes('secret-dg-token'), false);
});

test('voice scam analysis falls back to provided transcript when Deepgram missing', async () => {
  const result = await analyzeVoiceScam('missing.wav', {
    env: {},
    fallbackTranscript: 'Urgent bank security. Do not contact your branch. Verify security code immediately.'
  });
  assert.equal(result.transcription.configured, false);
  assert.equal(result.caseRecord.source, 'deepgram-voice-scam-transcription');
  assert.ok(['medium', 'high'].includes(result.receipt.risk));
  assert.match(result.caseRecord.evidence.transcript, /security code/);
});
