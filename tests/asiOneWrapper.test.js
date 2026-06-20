const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  AGENT_NAME, AGENT_PROTOCOL,
  agentInfo, validateRequest, handleAnalyzeRequest, createAgentServer
} = require('../src/asiOneWrapper.js');

describe('agentInfo', () => {
  it('returns agent metadata with correct protocol', () => {
    const info = agentInfo();
    assert.equal(info.name, AGENT_NAME);
    assert.equal(info.protocol, AGENT_PROTOCOL);
    assert.ok(info.capabilities.includes('analyze-page'));
    assert.equal(info.registeredOnAgentverse, false);
  });
});

describe('validateRequest', () => {
  it('rejects null/undefined input', () => {
    assert.equal(validateRequest(null).valid, false);
    assert.equal(validateRequest(undefined).valid, false);
  });

  it('rejects empty object without url or text', () => {
    const result = validateRequest({});
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('url or text'));
  });

  it('accepts request with url', () => {
    assert.equal(validateRequest({ url: 'https://example.com' }).valid, true);
  });

  it('accepts request with text only', () => {
    assert.equal(validateRequest({ text: 'wire transfer urgent' }).valid, true);
  });
});

describe('handleAnalyzeRequest', () => {
  it('returns error for invalid request', () => {
    const result = handleAnalyzeRequest({});
    assert.equal(result.status, 'error');
    assert.equal(result.agent, AGENT_NAME);
  });

  it('analyzes high-risk scam page and returns receipt', () => {
    const result = handleAnalyzeRequest({
      url: 'https://secure-login-verify.example.zip',
      title: 'Bank Security - Verify Now',
      text: 'Your account is locked. Act now to verify your identity. Wire transfer required. Do not tell anyone.'
    });
    assert.equal(result.status, 'ok');
    assert.equal(result.agent, AGENT_NAME);
    assert.equal(result.protocol, AGENT_PROTOCOL);
    assert.equal(result.receipt.risk, 'high');
    assert.ok(result.receipt.score >= 65);
    assert.ok(result.receipt.findings.length > 0);
    assert.ok(result.caseRecord.id);
    assert.ok(result.caseRecord.safetyBoundary);
    assert.ok(result.dossierPreview.includes('Cloak Sting'));
  });

  it('analyzes benign page as low risk', () => {
    const result = handleAnalyzeRequest({
      url: 'https://news.example.com/article',
      text: 'Today the weather is sunny and warm.'
    });
    assert.equal(result.status, 'ok');
    assert.equal(result.receipt.risk, 'low');
  });

  it('truncates excessively long text input', () => {
    const result = handleAnalyzeRequest({
      text: 'x'.repeat(50000)
    });
    assert.equal(result.status, 'ok');
  });

  it('includes jurisdiction and brand inference', () => {
    const result = handleAnalyzeRequest({
      url: 'https://usps-redelivery.fake.top',
      text: 'USPS redelivery fee required. Pay processing fee now.'
    });
    assert.equal(result.status, 'ok');
    assert.ok(result.caseRecord.suspectedBrand);
    assert.ok(result.caseRecord.jurisdiction);
  });
});

describe('createAgentServer', () => {
  it('creates server on specified port', async () => {
    const { server, port } = createAgentServer({ port: 0 });
    await new Promise((resolve) => server.listen(0, resolve));
    const addr = server.address();
    assert.ok(addr.port > 0);

    const infoRes = await fetch(`http://127.0.0.1:${addr.port}/info`);
    const info = await infoRes.json();
    assert.equal(info.name, AGENT_NAME);

    const analyzeRes = await fetch(`http://127.0.0.1:${addr.port}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://example.com', text: 'wire transfer urgent act now' })
    });
    const result = await analyzeRes.json();
    assert.equal(result.status, 'ok');
    assert.ok(result.receipt.score > 0);

    await new Promise((resolve) => server.close(resolve));
  });

  it('returns 404 for unknown routes', async () => {
    const { server } = createAgentServer({ port: 0 });
    await new Promise((resolve) => server.listen(0, resolve));
    const addr = server.address();

    const res = await fetch(`http://127.0.0.1:${addr.port}/unknown`);
    assert.equal(res.status, 404);

    await new Promise((resolve) => server.close(resolve));
  });

  it('returns 400 for invalid JSON body', async () => {
    const { server } = createAgentServer({ port: 0 });
    await new Promise((resolve) => server.listen(0, resolve));
    const addr = server.address();

    const res = await fetch(`http://127.0.0.1:${addr.port}/analyze`, {
      method: 'POST',
      body: 'not json'
    });
    assert.equal(res.status, 400);

    await new Promise((resolve) => server.close(resolve));
  });
});
