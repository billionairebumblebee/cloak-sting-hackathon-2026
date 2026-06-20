const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { inspectSuspiciousLink } = require('../src/browserbaseInspect.js');
const { createCaseStore } = require('../src/caseStore.js');
const { renderMarkdownDossier } = require('../src/dossier.js');
const fs = require('node:fs');

async function main() {
  const input = process.argv[2] || pathToFileURL(path.join(process.cwd(), 'demo', 'fake-bank-login.html')).href;
  const result = await inspectSuspiciousLink(input);
  await createCaseStore().saveCase(result.caseRecord);

  const outDir = path.join(process.cwd(), 'dist', 'browserbase');
  fs.mkdirSync(outDir, { recursive: true });
  const dossierPath = path.join(outDir, `${result.caseRecord.id}.md`);
  fs.writeFileSync(dossierPath, renderMarkdownDossier(result.caseRecord));

  console.log(JSON.stringify({
    url: result.evidence.url,
    risk: result.receipt.risk,
    score: result.receipt.score,
    browserbase: result.session.configured ? {
      sessionId: result.session.sessionId,
      recordingUrl: result.session.recordingUrl
    } : result.session,
    dossierPath
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
