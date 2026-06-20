const path = require('node:path');
const { analyzeVoiceScam } = require('../src/deepgramTranscribe.js');
const { createCaseStore } = require('../src/caseStore.js');
const { renderMarkdownDossier } = require('../src/dossier.js');
const fs = require('node:fs');

async function main() {
  const providedAudioPath = process.argv[2];
  const audioPath = providedAudioPath || 'voice-scam-demo-fallback.wav';
  const fallbackTranscript = process.argv.slice(3).join(' ') || 'This is the bank fraud department. Your account is suspended. Do not contact your branch. Verify your password and security code immediately.';
  const options = providedAudioPath ? { fallbackTranscript } : { env: {}, fallbackTranscript };
  const result = await analyzeVoiceScam(audioPath, options);
  await createCaseStore().saveCase(result.caseRecord);

  const outDir = path.join(process.cwd(), 'dist', 'voice');
  fs.mkdirSync(outDir, { recursive: true });
  const dossierPath = path.join(outDir, `${result.caseRecord.id}.md`);
  fs.writeFileSync(dossierPath, renderMarkdownDossier(result.caseRecord));

  console.log(JSON.stringify({
    source: result.caseRecord.source,
    transcribed: result.transcription.configured,
    transcriptLength: (result.transcription.transcript || fallbackTranscript).length,
    risk: result.receipt.risk,
    score: result.receipt.score,
    dossierPath,
    setup: result.transcription.configured ? 'deepgram' : result.transcription.reason
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
