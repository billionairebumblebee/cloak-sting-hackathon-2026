const fs = require('node:fs');
const path = require('node:path');
const { analyzeVoice } = require('../src/voiceScamPipeline.js');
const { deepgramConfigured } = require('../src/deepgramSTT.js');
const { createCaseStore } = require('../src/caseStore.js');
const { renderMarkdownDossier, renderJsonDossier } = require('../src/dossier.js');
const {
  hostageRansomResponse,
  bankRobocallResponse,
  chineseScamResponse
} = require('../tests/fixtures/deepgramResponses.js');
const { normalizeResponse } = require('../src/deepgramSTT.js');

const SAMPLE_TRANSCRIPTS = {
  hostage: normalizeResponse(hostageRansomResponse, 'sample://hostage-ransom'),
  bank: normalizeResponse(bankRobocallResponse, 'sample://bank-robocall'),
  chinese: normalizeResponse(chineseScamResponse, 'sample://chinese-embassy-scam')
};

async function main() {
  const audioInput = process.argv[2];
  const scenarioName = process.argv[3] || 'hostage';

  const useLiveApi = audioInput && deepgramConfigured();

  console.log('=== Cloak Sting — Voice Scam Demo ===\n');

  let result;

  if (useLiveApi) {
    console.log(`Transcribing live audio: ${audioInput}`);
    console.log('Using Deepgram API (DEEPGRAM_API_KEY detected)\n');
    result = await analyzeVoice(audioInput);
  } else {
    if (audioInput && !deepgramConfigured()) {
      console.log(`Audio input provided (${audioInput}) but DEEPGRAM_API_KEY not set.`);
      console.log('Falling back to sample transcript.\n');
    }

    const sample = SAMPLE_TRANSCRIPTS[scenarioName] || SAMPLE_TRANSCRIPTS.hostage;
    console.log(`Using sample transcript: ${scenarioName}`);
    console.log(`Language: ${sample.detectedLanguage || 'en'}\n`);

    result = await analyzeVoice(null, {
      transcript: sample.transcript,
      language: sample.detectedLanguage,
      confidence: sample.confidence,
      words: sample.words,
      metadata: sample.metadata
    });
  }

  console.log('--- Analysis Results ---');
  console.log(`Risk:     ${result.analysis.risk.toUpperCase()}`);
  console.log(`Score:    ${result.analysis.score}/100`);
  console.log(`Signals:  ${result.analysis.findingCount}`);
  for (const f of result.analysis.findings) {
    console.log(`  [${f.type}] ${f.label}: "${f.evidence}"`);
  }
  console.log('');

  const store = createCaseStore();
  const saved = await store.saveCase(result.caseRecord);
  console.log(`Case saved: ${saved.backend} — ${result.caseRecord.id}`);

  const outDir = path.join(process.cwd(), 'dist', 'dossiers');
  fs.mkdirSync(outDir, { recursive: true });

  const mdPath = path.join(outDir, `${result.caseRecord.id}.md`);
  const jsonPath = path.join(outDir, `${result.caseRecord.id}.json`);
  fs.writeFileSync(mdPath, renderMarkdownDossier(result.caseRecord));
  fs.writeFileSync(jsonPath, renderJsonDossier(result.caseRecord));

  console.log(`Dossier (markdown): ${mdPath}`);
  console.log(`Dossier (JSON):     ${jsonPath}`);
  console.log('\n--- Dossier Preview ---\n');
  console.log(renderMarkdownDossier(result.caseRecord));
}

main().catch((error) => {
  console.error('Demo error:', error.message);
  process.exit(1);
});
