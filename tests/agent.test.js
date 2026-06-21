const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

let server;
let baseUrl;

async function startAgent() {
  const { createServer } = http;
  const { analyzeScamSurface } = require('../src/scamSignals.js');

  function jsonResponse(res, status, data) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }

  async function readBody(req) {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    return Buffer.concat(chunks).toString('utf8');
  }

  const AGENT_DESCRIPTOR = {
    name: 'sting',
    version: '0.1.0',
    description: 'Ambient scam-warning agent.',
    capabilities: ['threat-analysis', 'scam-detection', 'receipt-generation'],
    endpoints: { status: '/status', chat: '/chat', analyzeThreat: '/analyze-threat' },
    protocol: 'asi-one-v0'
  };

  server = createServer(async (req, res) => {
    const method = req.method;
    const url = req.url.split('?')[0];

    if (method === 'GET' && url === '/status') {
      return jsonResponse(res, 200, { status: 'ok', agent: 'sting', version: '0.1.0' });
    }
    if (method === 'GET' && url === '/.well-known/agent.json') {
      return jsonResponse(res, 200, AGENT_DESCRIPTOR);
    }
    if (method === 'POST' && url === '/chat') {
      let body;
      try { body = JSON.parse(await readBody(req)); } catch (_) {
        return jsonResponse(res, 400, { error: 'Invalid JSON' });
      }
      const message = body.message || '';
      if (!message) return jsonResponse(res, 400, { error: 'Missing message' });
      const analysis = analyzeScamSurface({ title: body.title || '', text: message, url: body.url || '', hostname: body.hostname || '' });
      const reply = analysis.risk === 'high'
        ? `Warning: HIGH scam risk (${analysis.score}/100). ${analysis.advice}`
        : `Risk: ${analysis.risk} (${analysis.score}/100). ${analysis.advice}`;
      return jsonResponse(res, 200, { reply, analysis: { risk: analysis.risk, score: analysis.score, findingCount: analysis.findingCount, findings: analysis.findings, advice: analysis.advice } });
    }
    if (method === 'POST' && url === '/analyze-threat') {
      let body;
      try { body = JSON.parse(await readBody(req)); } catch (_) {
        return jsonResponse(res, 400, { error: 'Invalid JSON' });
      }
      const analysis = analyzeScamSurface({ title: body.title || '', text: body.text || '', url: body.url || '', hostname: body.hostname || '' });
      return jsonResponse(res, 200, analysis);
    }
    jsonResponse(res, 404, { error: 'Not found' });
  });

  await new Promise((resolve) => {
    server.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      resolve();
    });
  });
}

async function stopAgent() {
  if (server) await new Promise((resolve) => server.close(resolve));
}

async function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const opts = { method, hostname: url.hostname, port: url.port, path: url.pathname, headers: { 'Content-Type': 'application/json' } };
    const req = http.request(opts, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        resolve({ status: res.statusCode, body: JSON.parse(Buffer.concat(chunks).toString()) });
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

describe('sting agent wrapper', () => {
  it('starts and stops cleanly', async () => {
    await startAgent();
    assert.ok(baseUrl);
    await stopAgent();
  });

  it('GET /status returns ok', async () => {
    await startAgent();
    try {
      const res = await request('GET', '/status');
      assert.equal(res.status, 200);
      assert.equal(res.body.status, 'ok');
      assert.equal(res.body.agent, 'sting');
    } finally { await stopAgent(); }
  });

  it('GET /.well-known/agent.json returns descriptor', async () => {
    await startAgent();
    try {
      const res = await request('GET', '/.well-known/agent.json');
      assert.equal(res.status, 200);
      assert.equal(res.body.name, 'sting');
      assert.ok(res.body.capabilities.includes('threat-analysis'));
      assert.equal(res.body.protocol, 'asi-one-v0');
    } finally { await stopAgent(); }
  });

  it('POST /chat detects scam in message', async () => {
    await startAgent();
    try {
      const res = await request('POST', '/chat', {
        message: 'Your account is suspended. Wire transfer required immediately. Act now within 24 hours. Gift card or bitcoin accepted. Do not tell anyone. Keep this confidential. Final notice.'
      });
      assert.equal(res.status, 200);
      assert.ok(res.body.reply);
      assert.equal(res.body.analysis.risk, 'high');
      assert.ok(res.body.analysis.score >= 65);
      assert.ok(res.body.analysis.findings.length > 0);
    } finally { await stopAgent(); }
  });

  it('POST /chat returns low risk for safe message', async () => {
    await startAgent();
    try {
      const res = await request('POST', '/chat', {
        message: 'Hey, are we still on for dinner tonight? I was thinking Italian.'
      });
      assert.equal(res.status, 200);
      assert.equal(res.body.analysis.risk, 'low');
      assert.ok(res.body.analysis.score < 35);
    } finally { await stopAgent(); }
  });

  it('POST /chat rejects missing message', async () => {
    await startAgent();
    try {
      const res = await request('POST', '/chat', {});
      assert.equal(res.status, 400);
      assert.ok(res.body.error);
    } finally { await stopAgent(); }
  });

  it('POST /analyze-threat returns structured analysis', async () => {
    await startAgent();
    try {
      const res = await request('POST', '/analyze-threat', {
        title: 'IRS Tax Alert',
        text: 'You owe back taxes. Pay processing fee via gift card immediately. Account locked. IRS fraud department. Final notice.',
        hostname: 'irs-alert.click'
      });
      assert.equal(res.status, 200);
      assert.equal(res.body.risk, 'high');
      assert.ok(res.body.findings.some((f) => f.type === 'impersonation'));
      assert.ok(res.body.findings.some((f) => f.type === 'payment'));
    } finally { await stopAgent(); }
  });

  it('returns 404 for unknown routes', async () => {
    await startAgent();
    try {
      const res = await request('GET', '/nonexistent');
      assert.equal(res.status, 404);
    } finally { await stopAgent(); }
  });
});
