const test = require('node:test');
const assert = require('node:assert/strict');
const { browserbaseConfigured, createBrowserbaseSession, inspectSuspiciousLink } = require('../src/browserbaseInspect.js');

test('detects Browserbase configuration from env', () => {
  assert.equal(browserbaseConfigured({}), false);
  assert.equal(browserbaseConfigured({ BROWSERBASE_API_KEY: 'key', BROWSERBASE_PROJECT_ID: 'project' }), true);
});

test('creates Browserbase session without exposing secrets', async () => {
  const calls = [];
  const result = await createBrowserbaseSession({
    env: { BROWSERBASE_API_KEY: 'secret-key', BROWSERBASE_PROJECT_ID: 'proj_123' },
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return {
        ok: true,
        json: async () => ({ id: 'sess_123', projectId: 'proj_123', status: 'RUNNING', connectUrl: 'wss://hidden', seleniumRemoteUrl: 'https://hidden' })
      };
    }
  });
  assert.equal(result.configured, true);
  assert.equal(result.sessionId, 'sess_123');
  assert.equal(result.recordingUrl, 'https://browserbase.com/sessions/sess_123');
  assert.equal(JSON.stringify(result).includes('secret-key'), false);
  assert.equal(calls[0].init.headers['X-BB-API-Key'], 'secret-key');
});

test('inspects link evidence and returns Cloak receipt', async () => {
  const html = '<html><head><title>USPS final notice</title></head><body>Pay redelivery fee immediately. Verify security code now.</body></html>';
  let callCount = 0;
  const result = await inspectSuspiciousLink('https://usps-redelivery-fee.example/pay', {
    env: { BROWSERBASE_API_KEY: 'key', BROWSERBASE_PROJECT_ID: 'project' },
    fetchImpl: async (url) => {
      callCount += 1;
      if (String(url).includes('browserbase')) {
        return { ok: true, json: async () => ({ id: 'sess_456', projectId: 'project', status: 'RUNNING' }) };
      }
      return { status: 200, url, text: async () => html };
    }
  });
  assert.equal(callCount, 2);
  assert.ok(['medium', 'high'].includes(result.receipt.risk));
  assert.equal(result.caseRecord.source, 'browserbase-isolated-link-inspection');
  assert.equal(result.session.recordingUrl, 'https://browserbase.com/sessions/sess_456');
});
