const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeReceiptToCase } = require('../src/caseStore.js');
const { buildGroundedExplanation, compactCaseForPrompt, explainWithAnthropic } = require('../src/anthropicExplain.js');

function demoCase() {
  return normalizeReceiptToCase({
    id: 'receipt_1',
    url: 'https://usps-redelivery-fee.example/pay',
    hostname: 'usps-redelivery-fee.example',
    title: 'USPS final notice',
    risk: 'high',
    score: 82,
    advice: 'Do not pay on this page.',
    findings: [
      { type: 'payment', label: 'Unusual payment request', evidence: 'redelivery fee', weight: 18 },
      { type: 'copy', label: 'Urgency pressure', evidence: 'final notice', weight: 12 }
    ]
  });
}

test('local explanation is grounded in deterministic case fields', () => {
  const explanation = buildGroundedExplanation(demoCase());
  assert.equal(explanation.provider, 'deterministic-local');
  assert.match(explanation.summary, /high risk/);
  assert.match(explanation.summary, /Unusual payment request/);
  assert.match(explanation.whyItMatters, /not on guessing who is behind it/);
});

test('compact prompt excludes raw victim notes and keeps findings', () => {
  const record = demoCase();
  record.victimSafeNotes = 'private family note';
  const compact = compactCaseForPrompt(record);
  assert.equal(compact.victimSafeNotes, undefined);
  assert.equal(compact.findings.length, 2);
  assert.equal(compact.findings[0].evidence, 'redelivery fee');
});

test('Anthropic explanation uses API when configured without leaking key', async () => {
  const calls = [];
  const explanation = await explainWithAnthropic(demoCase(), {
    env: { ANTHROPIC_API_KEY: 'secret-anthropic-key', ANTHROPIC_MODEL: 'claude-test' },
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return {
        ok: true,
        json: async () => ({
          model: 'claude-test',
          content: [{ text: JSON.stringify({
            summary: 'Observed high-risk USPS impersonation signals.',
            whyItMatters: 'Payment and urgency pressure were present.',
            safeNextSteps: 'Pause and verify through USPS directly.',
            reportingNote: 'Attach case ID and URL.'
          }) }]
        })
      };
    }
  });
  assert.equal(explanation.provider, 'anthropic');
  assert.equal(explanation.model, 'claude-test');
  assert.equal(calls[0].init.headers['x-api-key'], 'secret-anthropic-key');
  assert.equal(JSON.stringify(explanation).includes('secret-anthropic-key'), false);
});

test('Anthropic explanation falls back safely when unconfigured', async () => {
  const explanation = await explainWithAnthropic(demoCase(), { env: {} });
  assert.equal(explanation.provider, 'deterministic-local');
  assert.match(explanation.safeNextSteps, /Do not pay/);
});
