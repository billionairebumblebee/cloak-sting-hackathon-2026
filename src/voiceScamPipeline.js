const { analyzeScamSurface, scoreText, analyzeVoiceTranscript } = require('./scamSignals.js');
const { normalizeReceiptToCase, createCaseStore } = require('./caseStore.js');
const { renderMarkdownDossier, renderJsonDossier } = require('./dossier.js');
const { transcribeUrl, transcribeFile, deepgramConfigured } = require('./deepgramSTT.js');
const { captureScamEvent, captureError } = require('./sentry.js');

/**
 * Voice scam pipeline — end-to-end flow from audio to dossier.
 *
 *  audio URL/file  →  Deepgram STT  →  scamSignals analyzer
 *                                         ↓
 *                            caseRecord + dossier output
 */

async function analyzeVoice(audioInput, options = {}) {
  let sttResult;

  if (options.transcript) {
    sttResult = {
      source: audioInput || 'provided-transcript',
      transcript: options.transcript,
      confidence: options.confidence ?? null,
      detectedLanguage: options.language || null,
      words: options.words || [],
      metadata: options.metadata || {}
    };
  } else if (audioInput && (audioInput.startsWith('http://') || audioInput.startsWith('https://'))) {
    sttResult = await transcribeUrl(audioInput, options);
  } else if (audioInput) {
    sttResult = await transcribeFile(audioInput, options);
  } else {
    throw new Error('Provide an audio URL, file path, or pass options.transcript directly.');
  }

  const analysis = analyzeScamSurface({
    title: `Voice transcript [${sttResult.detectedLanguage || 'unknown'}]`,
    text: sttResult.transcript,
    url: typeof sttResult.source === 'string' && sttResult.source.startsWith('http') ? sttResult.source : '',
    hostname: ''
  });

  const receipt = {
    id: `voice-${Date.now()}`,
    url: typeof sttResult.source === 'string' && sttResult.source.startsWith('http') ? sttResult.source : '',
    hostname: '',
    title: `Voice transcript [${sttResult.detectedLanguage || 'unknown'}]`,
    sourceType: 'voice',
    ...analysis
  };

  const caseRecord = normalizeReceiptToCase(receipt, {
    source: 'cloak-sting-voice-pipeline',
    transcript: sttResult.transcript
  });

  /* Voice pattern matching — categorize into known attack families */
  const patternMatches = analyzeVoiceTranscript(sttResult.transcript);

  caseRecord.voiceMetadata = {
    detectedLanguage: sttResult.detectedLanguage,
    confidence: sttResult.confidence,
    wordCount: sttResult.words.length,
    deepgramRequestId: sttResult.metadata.requestId || null,
    audioDuration: sttResult.metadata.duration || null,
    summary: sttResult.metadata.summary || null,
    scamPatterns: patternMatches.map((m) => ({
      pattern: m.pattern,
      name: m.name,
      category: m.category,
      riskLevel: m.riskLevel,
      score: m.score,
      counterAdvice: m.counterAdvice
    }))
  };

  if (analysis.risk === 'high' || analysis.risk === 'medium') {
    captureScamEvent({ ...receipt, sourceType: 'voice' }).catch(() => {});
  }

  return {
    sttResult,
    analysis,
    receipt,
    caseRecord,
    dossier: {
      markdown: renderMarkdownDossier(caseRecord),
      json: renderJsonDossier(caseRecord)
    }
  };
}

async function analyzeAndSaveVoice(audioInput, options = {}) {
  const result = await analyzeVoice(audioInput, options);
  const store = createCaseStore();
  const saved = await store.saveCase(result.caseRecord);
  return { ...result, saved };
}

module.exports = {
  analyzeVoice,
  analyzeAndSaveVoice
};
