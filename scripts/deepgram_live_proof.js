/**
 * Deepgram live audio proof script.
 *
 * Proves the Deepgram file-upload path works end-to-end with a real API call.
 * Uses a tiny safe demo audio file (synthesized tone) — no real victim audio.
 *
 * Reads DEEPGRAM_API_KEY from env only — never hardcoded.
 * Saves a sanitized proof artifact to dist/deepgram-proof.json.
 * No API key leakage in output or artifact.
 *
 * Usage:
 *   DEEPGRAM_API_KEY=... node scripts/deepgram_live_proof.js [audio-file]
 *   node scripts/deepgram_live_proof.js                      # fallback mode
 */

const fs = require('node:fs');
const path = require('node:path');
const { deepgramConfigured } = require('../src/deepgramSTT.js');
const { analyzeVoice } = require('../src/voiceScamPipeline.js');
const { normalizeResponse } = require('../src/deepgramSTT.js');
const { hostageRansomResponse } = require('../tests/fixtures/deepgramResponses.js');

async function main() {
  const audioFile = process.argv[2] || path.join(__dirname, '..', 'tests', 'fixtures', 'demo-tone.wav');

  console.log('=== Cloak Sting — Deepgram Live Audio Proof ===\n');

  const proofDir = path.join(process.cwd(), 'dist');
  fs.mkdirSync(proofDir, { recursive: true });
  const proofPath = path.join(proofDir, 'deepgram-proof.json');

  if (!deepgramConfigured()) {
    console.log('DEEPGRAM_API_KEY is not set.');
    console.log('Running fallback mode with sample transcript.\n');

    const sample = normalizeResponse(hostageRansomResponse, 'sample://hostage-ransom');
    const result = await analyzeVoice(null, {
      transcript: sample.transcript,
      language: sample.detectedLanguage,
      confidence: sample.confidence,
      words: sample.words,
      metadata: sample.metadata
    });

    const proof = {
      mode: 'fallback',
      reason: 'DEEPGRAM_API_KEY not set',
      timestamp: new Date().toISOString(),
      audioFile: null,
      transcript: result.sttResult.transcript.slice(0, 200),
      risk: result.analysis.risk,
      score: result.analysis.score,
      signalCount: result.analysis.findingCount,
      signals: result.analysis.findings.map((f) => ({ type: f.type, label: f.label })),
      caseId: result.caseRecord.id
    };

    fs.writeFileSync(proofPath, JSON.stringify(proof, null, 2));
    console.log(`Risk:     ${result.analysis.risk.toUpperCase()}`);
    console.log(`Score:    ${result.analysis.score}/100`);
    console.log(`Signals:  ${result.analysis.findingCount}`);
    console.log(`\nProof artifact: ${proofPath}`);
    console.log('Set DEEPGRAM_API_KEY to run the live path.');
    return;
  }

  if (!fs.existsSync(audioFile)) {
    console.log(`Audio file not found: ${audioFile}`);
    console.log('Generate one with: node scripts/generate_demo_audio.js');
    process.exit(1);
  }

  console.log(`Audio file:  ${audioFile}`);
  console.log(`File size:   ${fs.statSync(audioFile).size} bytes`);
  console.log('Sending to Deepgram API…\n');

  try {
    const result = await analyzeVoice(audioFile);

    const proof = {
      mode: 'live',
      timestamp: new Date().toISOString(),
      audioFile: path.basename(audioFile),
      audioSize: fs.statSync(audioFile).size,
      transcript: (result.sttResult.transcript || '(no speech detected)').slice(0, 500),
      confidence: result.sttResult.confidence,
      detectedLanguage: result.sttResult.detectedLanguage,
      wordCount: result.sttResult.words.length,
      deepgramRequestId: result.sttResult.metadata.requestId,
      audioDuration: result.sttResult.metadata.duration,
      risk: result.analysis.risk,
      score: result.analysis.score,
      signalCount: result.analysis.findingCount,
      signals: result.analysis.findings.map((f) => ({ type: f.type, label: f.label })),
      caseId: result.caseRecord.id
    };

    fs.writeFileSync(proofPath, JSON.stringify(proof, null, 2));

    console.log('--- Deepgram Live Proof ---');
    console.log(`Transcript: ${proof.transcript || '(no speech in tone file)'}`);
    console.log(`Confidence: ${proof.confidence}`);
    console.log(`Language:   ${proof.detectedLanguage}`);
    console.log(`Words:      ${proof.wordCount}`);
    console.log(`Duration:   ${proof.audioDuration}s`);
    console.log(`Request ID: ${proof.deepgramRequestId}`);
    console.log(`Risk:       ${proof.risk.toUpperCase()}`);
    console.log(`Score:      ${proof.score}/100`);
    console.log(`\nProof artifact: ${proofPath}`);
    console.log('Live Deepgram path verified successfully.');
  } catch (err) {
    console.error(`Deepgram API error: ${err.message}`);
    console.log('The API key may be invalid or the audio format unsupported.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Proof script error:', err.message);
  process.exit(1);
});
