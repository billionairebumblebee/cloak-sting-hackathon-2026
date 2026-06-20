const fs = require('node:fs');
const path = require('node:path');

/**
 * Deepgram prerecorded speech-to-text module.
 *
 * Sends an audio file or URL to the Deepgram /listen endpoint and returns
 * a normalized transcript with language/metadata.
 *
 * Accepts an optional fetchImpl for testing (mock injection).
 */

const DEEPGRAM_API_URL = 'https://api.deepgram.com/v1/listen';

function deepgramConfigured(env = process.env) {
  return Boolean(env.DEEPGRAM_API_KEY);
}

function buildQueryParams(options = {}) {
  const params = new URLSearchParams();
  params.set('model', options.model || 'nova-3');
  params.set('smart_format', 'true');
  params.set('punctuate', 'true');
  if (options.language) params.set('language', options.language);
  else params.set('detect_language', 'true');
  if (options.diarize) params.set('diarize', 'true');
  if (options.summarize) params.set('summarize', 'v2');
  return params.toString();
}

async function transcribeUrl(audioUrl, options = {}) {
  const { env = process.env, fetchImpl = fetch } = options;
  if (!deepgramConfigured(env)) {
    throw new Error('DEEPGRAM_API_KEY is not set. Provide it via environment variable.');
  }

  const queryString = buildQueryParams(options);
  const response = await fetchImpl(`${DEEPGRAM_API_URL}?${queryString}`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${env.DEEPGRAM_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: audioUrl })
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Deepgram API error: ${response.status} ${body}`.trim());
  }

  return normalizeResponse(await response.json(), audioUrl);
}

async function transcribeFile(filePath, options = {}) {
  const { env = process.env, fetchImpl = fetch } = options;
  if (!deepgramConfigured(env)) {
    throw new Error('DEEPGRAM_API_KEY is not set. Provide it via environment variable.');
  }

  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Audio file not found: ${resolved}`);
  }

  const audioBuffer = fs.readFileSync(resolved);
  const ext = path.extname(resolved).toLowerCase().replace('.', '');
  const mimeMap = { wav: 'audio/wav', mp3: 'audio/mpeg', ogg: 'audio/ogg', flac: 'audio/flac', m4a: 'audio/mp4', webm: 'audio/webm' };
  const contentType = mimeMap[ext] || 'audio/wav';

  const queryString = buildQueryParams(options);
  const response = await fetchImpl(`${DEEPGRAM_API_URL}?${queryString}`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${env.DEEPGRAM_API_KEY}`,
      'Content-Type': contentType
    },
    body: audioBuffer
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Deepgram API error: ${response.status} ${body}`.trim());
  }

  return normalizeResponse(await response.json(), resolved);
}

function normalizeResponse(dgResponse, source) {
  const results = dgResponse?.results || {};
  const channels = results.channels || [];
  const firstChannel = channels[0] || {};
  const firstAlt = (firstChannel.alternatives || [])[0] || {};

  const detectedLanguage = firstChannel.detected_language
    || firstAlt.detected_language
    || firstAlt.language
    || dgResponse.metadata?.language
    || null;

  const transcript = firstAlt.transcript || '';
  const confidence = firstAlt.confidence ?? null;
  const words = (firstAlt.words || []).map((w) => ({
    word: w.word || w.punctuated_word || '',
    start: w.start,
    end: w.end,
    confidence: w.confidence,
    speaker: w.speaker ?? null
  }));

  const metadata = {
    requestId: dgResponse.metadata?.request_id || null,
    duration: dgResponse.metadata?.duration || null,
    channels: dgResponse.metadata?.channels || channels.length,
    modelInfo: dgResponse.metadata?.model_info || null,
    summary: results.summary?.short || null
  };

  return {
    source,
    transcript,
    confidence,
    detectedLanguage,
    words,
    metadata
  };
}

module.exports = {
  deepgramConfigured,
  transcribeUrl,
  transcribeFile,
  normalizeResponse,
  buildQueryParams,
  DEEPGRAM_API_URL
};
