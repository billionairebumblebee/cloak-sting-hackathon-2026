const path = require('node:path');
const { analyzeScamSurface } = require('../src/scamSignals.js');
const { normalizeReceiptToCase } = require('../src/caseStore.js');
const { explainWithAnthropic } = require('../src/anthropicExplain.js');

async function main() {
  const demo = {
    hostname: 'usps-redelivery-fee-secure.example',
    title: 'USPS final notice',
    url: 'https://usps-redelivery-fee-secure.example/pay',
    text: 'Final notice. Pay a redelivery fee immediately. Verify security code now. Only through this page.'
  };
  const receipt = { ...demo, ...analyzeScamSurface(demo) };
  const caseRecord = normalizeReceiptToCase(receipt, { victimSafeNotes: 'Demo fixture: no real victim data.' });
  const explanation = await explainWithAnthropic(caseRecord);
  console.log(JSON.stringify({ caseId: caseRecord.id, explanation }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
