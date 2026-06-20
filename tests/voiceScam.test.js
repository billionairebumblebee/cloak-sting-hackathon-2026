const test = require('node:test');
const assert = require('node:assert/strict');
const {
  hostageRansomResponse,
  bankRobocallResponse,
  chineseScamResponse,
  cleanConversationResponse
} = require('./fixtures/deepgramResponses.js');
const { deepgramConfigured, transcribeUrl, normalizeResponse, buildQueryParams } = require('../src/deepgramSTT.js');
const { analyzeVoice } = require('../src/voiceScamPipeline.js');
const { scoreText } = require('../src/scamSignals.js');

// --- Deepgram STT module tests ---

test('deepgramSTT: returns false without API key', () => {
  assert.equal(deepgramConfigured({}), false);
  assert.equal(deepgramConfigured({ DEEPGRAM_API_KEY: '' }), false);
});

test('deepgramSTT: returns true with API key', () => {
  assert.equal(deepgramConfigured({ DEEPGRAM_API_KEY: 'dg-test-key' }), true);
});

test('deepgramSTT: buildQueryParams sets defaults', () => {
  const qs = buildQueryParams();
  assert.ok(qs.includes('model=nova-3'));
  assert.ok(qs.includes('smart_format=true'));
  assert.ok(qs.includes('detect_language=true'));
});

test('deepgramSTT: buildQueryParams respects explicit language', () => {
  const qs = buildQueryParams({ language: 'zh' });
  assert.ok(qs.includes('language=zh'));
  assert.ok(!qs.includes('detect_language'));
});

test('deepgramSTT: normalizeResponse extracts hostage transcript', () => {
  const result = normalizeResponse(hostageRansomResponse, 'https://example.com/audio.wav');
  assert.ok(result.transcript.includes('ransom'));
  assert.ok(result.transcript.includes('Do not call the police'));
  assert.equal(result.detectedLanguage, 'en');
  assert.equal(result.confidence, 0.94);
  assert.equal(result.metadata.requestId, 'mock-req-hostage-001');
  assert.equal(result.metadata.duration, 42.5);
  assert.equal(result.source, 'https://example.com/audio.wav');
  assert.ok(result.words.length > 0);
});

test('deepgramSTT: normalizeResponse extracts bank robocall transcript', () => {
  const result = normalizeResponse(bankRobocallResponse, 'https://example.com/bank.mp3');
  assert.ok(result.transcript.includes('bank security'));
  assert.ok(result.transcript.includes('account has been suspended'));
  assert.equal(result.detectedLanguage, 'en');
  assert.equal(result.metadata.summary, 'Automated bank security call requesting personal details.');
});

test('deepgramSTT: normalizeResponse extracts Chinese transcript', () => {
  const result = normalizeResponse(chineseScamResponse, 'https://example.com/cn.wav');
  assert.ok(result.transcript.includes('大使馆'));
  assert.ok(result.transcript.includes('护照'));
  assert.equal(result.detectedLanguage, 'zh');
  assert.equal(result.metadata.requestId, 'mock-req-chinese-003');
});

test('deepgramSTT: transcribeUrl sends correct request without leaking key', async () => {
  const capturedCalls = [];
  const mockFetch = async (url, init) => {
    capturedCalls.push({ url, init });
    return {
      ok: true,
      json: async () => hostageRansomResponse
    };
  };

  const result = await transcribeUrl('https://example.com/audio.wav', {
    env: { DEEPGRAM_API_KEY: 'dg-test-key' },
    fetchImpl: mockFetch
  });

  assert.equal(capturedCalls.length, 1);
  assert.ok(capturedCalls[0].url.includes('api.deepgram.com/v1/listen'));
  assert.equal(capturedCalls[0].init.headers.Authorization, 'Token dg-test-key');
  assert.equal(capturedCalls[0].init.headers['Content-Type'], 'application/json');
  assert.ok(result.transcript.includes('ransom'));
  assert.equal(JSON.stringify(result).includes('dg-test-key'), false);
});

test('deepgramSTT: throws when API key is missing', async () => {
  await assert.rejects(
    () => transcribeUrl('https://example.com/audio.wav', { env: {} }),
    { message: /DEEPGRAM_API_KEY/ }
  );
});

test('deepgramSTT: throws on API error', async () => {
  const mockFetch = async () => ({
    ok: false,
    status: 401,
    text: async () => 'Unauthorized'
  });
  await assert.rejects(
    () => transcribeUrl('https://example.com/audio.wav', {
      env: { DEEPGRAM_API_KEY: 'bad-key' },
      fetchImpl: mockFetch
    }),
    { message: /Deepgram API error: 401/ }
  );
});

// --- scamSignals extension tests ---

test('scamSignals: detects hostage/ransom terms', () => {
  const findings = scoreText('We have your son. Pay the ransom or he will be harmed. Wire the money now.');
  assert.ok(findings.some((f) => f.type === 'ransom'));
  const ransomFindings = findings.filter((f) => f.type === 'ransom');
  assert.ok(ransomFindings.length >= 3);
});

test('scamSignals: detects Chinese scam terms', () => {
  const findings = scoreText('您好，这里是中国大使馆。您的护照涉嫌犯罪活动，公安局已发出逮捕令。');
  const cnFindings = findings.filter((f) => f.type === 'chinese_scam');
  assert.ok(cnFindings.length >= 3);
  assert.ok(cnFindings.some((f) => f.evidence === '大使馆'));
  assert.ok(cnFindings.some((f) => f.evidence === '护照'));
  assert.ok(cnFindings.some((f) => f.evidence === '公安'));
});

// --- Voice scam pipeline tests ---

test('pipeline: hostage/ransom transcript produces high risk dossier', async () => {
  const mockFetch = async () => ({ ok: true, json: async () => hostageRansomResponse });
  const result = await analyzeVoice('https://example.com/audio.wav', {
    env: { DEEPGRAM_API_KEY: 'test-key' },
    fetchImpl: mockFetch
  });

  assert.ok(['high', 'medium'].includes(result.analysis.risk));
  assert.ok(result.analysis.score >= 35);
  assert.ok(result.analysis.findings.some((f) => f.type === 'ransom'));
  assert.equal(result.caseRecord.source, 'cloak-sting-voice-pipeline');
  assert.ok(result.caseRecord.evidence.transcript.includes('ransom'));
  assert.ok(result.dossier.markdown.includes('Cloak Sting'));
  assert.ok(result.dossier.json.includes(result.caseRecord.id));
  assert.equal(result.caseRecord.voiceMetadata.detectedLanguage, 'en');
});

test('pipeline: bank robocall transcript detects financial signals', async () => {
  const mockFetch = async () => ({ ok: true, json: async () => bankRobocallResponse });
  const result = await analyzeVoice('https://example.com/bank.mp3', {
    env: { DEEPGRAM_API_KEY: 'test-key' },
    fetchImpl: mockFetch
  });

  assert.ok(result.analysis.score >= 35);
  assert.ok(result.analysis.findings.some((f) => f.type === 'copy' || f.type === 'impersonation'));
  assert.ok(result.caseRecord.evidence.transcript.includes('account has been suspended'));
  assert.equal(result.caseRecord.voiceMetadata.detectedLanguage, 'en');
  assert.equal(result.caseRecord.voiceMetadata.deepgramRequestId, 'mock-req-bank-002');
});

test('pipeline: Chinese scam transcript detects language-specific signals', async () => {
  const mockFetch = async () => ({ ok: true, json: async () => chineseScamResponse });
  const result = await analyzeVoice('https://example.com/cn.wav', {
    env: { DEEPGRAM_API_KEY: 'test-key' },
    fetchImpl: mockFetch
  });

  assert.ok(result.analysis.score >= 30);
  assert.ok(result.analysis.findings.some((f) => f.type === 'chinese_scam'));
  assert.equal(result.caseRecord.voiceMetadata.detectedLanguage, 'zh');
  assert.ok(result.dossier.markdown.includes('zh'));
});

test('pipeline: clean conversation produces low risk', async () => {
  const mockFetch = async () => ({ ok: true, json: async () => cleanConversationResponse });
  const result = await analyzeVoice('https://example.com/clean.wav', {
    env: { DEEPGRAM_API_KEY: 'test-key' },
    fetchImpl: mockFetch
  });

  assert.equal(result.analysis.risk, 'low');
  assert.equal(result.analysis.findingCount, 0);
  assert.ok(result.caseRecord.evidence.transcript.includes('dinner tonight'));
});

test('pipeline: accepts pre-supplied transcript without Deepgram call', async () => {
  const result = await analyzeVoice(null, {
    transcript: 'Pay the ransom immediately or your daughter will be harmed. Wire the money.',
    language: 'en'
  });

  assert.ok(result.analysis.score >= 35);
  assert.ok(result.analysis.findings.some((f) => f.type === 'ransom'));
  assert.equal(result.sttResult.detectedLanguage, 'en');
  assert.ok(result.dossier.markdown.length > 0);
});

test('pipeline: throws without input or transcript', async () => {
  await assert.rejects(
    () => analyzeVoice(null, {}),
    { message: /Provide an audio URL/ }
  );
});

test('pipeline: voice dossier includes voice metadata', async () => {
  const mockFetch = async () => ({ ok: true, json: async () => hostageRansomResponse });
  const result = await analyzeVoice('https://example.com/audio.wav', {
    env: { DEEPGRAM_API_KEY: 'test-key' },
    fetchImpl: mockFetch
  });

  assert.ok(result.caseRecord.voiceMetadata);
  assert.equal(result.caseRecord.voiceMetadata.audioDuration, 42.5);
  assert.equal(result.caseRecord.voiceMetadata.deepgramRequestId, 'mock-req-hostage-001');
  assert.equal(result.caseRecord.voiceMetadata.confidence, 0.94);
});
