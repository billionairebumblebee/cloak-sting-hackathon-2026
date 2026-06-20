const fs = require('node:fs');
const path = require('node:path');
const { analyzeScamSurface } = require('../src/scamSignals.js');
const { createCaseStore, normalizeReceiptToCase } = require('../src/caseStore.js');
const { renderMarkdownDossier, renderJsonDossier } = require('../src/dossier.js');

async function main() {
  const demo = {
    hostname: 'secure-bank-verify-account-login.example',
    title: 'Secure Bank Verification Center',
    url: 'https://secure-bank-verify-account-login.example/session',
    text: 'URGENT: Your account has been suspended. Verify now within 24 hours. Password one-time security code. Do not contact your branch. Only through this page.'
  };
  const receipt = { ...demo, ...analyzeScamSurface(demo) };
  const caseRecord = normalizeReceiptToCase(receipt, { victimSafeNotes: 'Demo fixture: no real victim data.' });
  const result = await createCaseStore().saveCase(caseRecord);

  const outDir = path.join(process.cwd(), 'dist', 'dossiers');
  fs.mkdirSync(outDir, { recursive: true });
  const mdPath = path.join(outDir, `${caseRecord.id}.md`);
  const jsonPath = path.join(outDir, `${caseRecord.id}.json`);
  fs.writeFileSync(mdPath, renderMarkdownDossier(caseRecord));
  fs.writeFileSync(jsonPath, renderJsonDossier(caseRecord));

  console.log(JSON.stringify({ savedTo: result.backend, caseId: caseRecord.id, markdown: mdPath, json: jsonPath }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
