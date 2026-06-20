const fs = require('node:fs');
const path = require('node:path');
const { analyzeScamSurface } = require('./scamSignals.js');
const { normalizeReceiptToCase } = require('./caseStore.js');

function deepgramConfigured(env = process.env) {
  return Boolean(env.DEEPGRAM_API_KEY);
}

async function transcribeWithDeepgram(audioPath, { env = process.env, fetchImpl = fetch } = {}) {
  if (!deepgramConfigured(env)) {
    return {
      configured: false,
      provider: 'deepgram',
      reason: 'Set DEEPGRAM_API_KEY to transcribe voice-scam audio.',
      transcript: ''
    };
  }

  const bytes = fs.readFileSync(audioPath);
  const contentType = contentTypeForPath(audioPath);
  const response = await fetchImpl('https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true&detect_language=true', {
    method: 'POST',
    headers: {
      Authorization: `Token ${env.DEEPGRAM_API_KEY}`,
      'Content-Type': contentType
    },
    body: bytes
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Deepgram transcription failed: ${response.status} ${text}`.trim());
  }

  const data = await response.json();
  const transcript = extractTranscript(data);
  return {
    configured: true,
    provider: 'deepgram',
    transcript,
    language: data.results?.channels?.[0]?.detected_language || data.results?.channels?.[0]?.alternatives?.[0]?.languages?.[0] || '',
    duration: data.metadata?.duration || 0
  };
}

async function analyzeVoiceScam(audioPath, options = {}) {
  const transcription = await transcribeWithDeepgram(audioPath, options);
  const transcript = transcription.transcript || options.fallbackTranscript || '';
  const evidence = {
    url: `voice:${path.basename(audioPath || 'unknown-audio')}`,
    hostname: 'voice-scam-audio',
    title: 'Voice scam transcript',
    text: transcript
  };
  const analysis = analyzeScamSurface(evidence);
  const receipt = {
    id: `voice-${Date.now()}`,
    ...evidence,
    voice: sanitizeTranscriptionMetadata(transcription),
    ...analysis
  };
  return {
    transcription,
    receipt,
    caseRecord: normalizeReceiptToCase(receipt, {
      source: 'deepgram-voice-scam-transcription',
      transcript
    })
  };
}

function extractTranscript(data) {
  return (data.results?.channels || [])
    .flatMap((channel) => channel.alternatives || [])
    .map((alt) => alt.transcript || '')
    .filter(Boolean)
    .join('\n')
    .trim();
}

function sanitizeTranscriptionMetadata(transcription) {
  return {
    configured: Boolean(transcription.configured),
    provider: transcription.provider || 'deepgram',
    language: transcription.language || '',
    duration: transcription.duration || 0,
    reason: transcription.reason || ''
  };
}

function contentTypeForPath(filePath) {
  const ext = path.extname(filePath || '').toLowerCase();
  if (ext === '.mp3') return 'audio/mpeg';
  if (ext === '.wav') return 'audio/wav';
  if (ext === '.m4a') return 'audio/mp4';
  if (ext === '.ogg' || ext === '.oga') return 'audio/ogg';
  if (ext === '.webm') return 'audio/webm';
  return 'application/octet-stream';
}

module.exports = {
  deepgramConfigured,
  transcribeWithDeepgram,
  analyzeVoiceScam,
  extractTranscript,
  contentTypeForPath
};
