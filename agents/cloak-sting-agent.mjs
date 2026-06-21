/**
 * sting — ASI:One / Agentverse agent wrapper.
 *
 * Minimal HTTP server exposing the scam-detection pipeline as an
 * Agentverse-compatible agent with standard routes:
 *
 *   GET  /status              — agent health / readiness
 *   GET  /.well-known/agent.json — agent descriptor (Agentverse discovery)
 *   POST /chat                — conversational threat analysis
 *   POST /analyze-threat      — structured scam surface analysis
 *
 * Uses existing src/scamSignals.js for detection. No new dependencies.
 *
 * Usage:
 *   node agents/sting-agent.mjs              # default port 3100
 *   PORT=8080 node agents/sting-agent.mjs    # custom port
 */

import { createServer } from 'node:http';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { analyzeScamSurface } = require('../src/scamSignals.js');

const PORT = parseInt(process.env.PORT || '3100', 10);

const AGENT_DESCRIPTOR = {
  name: 'sting',
  version: '0.1.0',
  description: 'Ambient scam-warning agent. Analyzes pages, URLs, and text for scam signals (urgency, payment, impersonation, credential harvesting, ransom, Chinese-language scams).',
  capabilities: ['threat-analysis', 'scam-detection', 'receipt-generation'],
  endpoints: {
    status: '/status',
    chat: '/chat',
    analyzeThreat: '/analyze-threat'
  },
  protocol: 'asi-one-v0',
  sourceRepo: 'https://github.com/billionairebumblebee/sting-hackathon-2026'
};

function jsonResponse(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

async function handleChat(req, res) {
  let body;
  try {
    body = JSON.parse(await readBody(req));
  } catch (_) {
    return jsonResponse(res, 400, { error: 'Invalid JSON body. Send { "message": "..." }.' });
  }

  const message = body.message || body.text || body.content || '';
  if (!message) {
    return jsonResponse(res, 400, { error: 'Missing "message" field.' });
  }

  const analysis = analyzeScamSurface({
    title: body.title || '',
    text: message,
    url: body.url || '',
    hostname: body.hostname || ''
  });

  const reply = analysis.risk === 'high'
    ? `Warning: this content has HIGH scam risk (${analysis.score}/100). ${analysis.advice}`
    : analysis.risk === 'medium'
      ? `Caution: this content shows MEDIUM scam risk (${analysis.score}/100). ${analysis.advice}`
      : `This content appears low risk (${analysis.score}/100). ${analysis.advice}`;

  jsonResponse(res, 200, {
    reply,
    analysis: {
      risk: analysis.risk,
      score: analysis.score,
      findingCount: analysis.findingCount,
      findings: analysis.findings,
      advice: analysis.advice
    }
  });
}

async function handleAnalyzeThreat(req, res) {
  let body;
  try {
    body = JSON.parse(await readBody(req));
  } catch (_) {
    return jsonResponse(res, 400, { error: 'Invalid JSON body. Send { "text": "...", "url": "...", "title": "..." }.' });
  }

  const analysis = analyzeScamSurface({
    title: body.title || '',
    text: body.text || body.message || body.content || '',
    url: body.url || '',
    hostname: body.hostname || ''
  });

  jsonResponse(res, 200, analysis);
}

const server = createServer(async (req, res) => {
  const method = req.method;
  const url = req.url.split('?')[0];

  if (method === 'GET' && url === '/status') {
    return jsonResponse(res, 200, { status: 'ok', agent: 'sting', version: '0.1.0' });
  }

  if (method === 'GET' && url === '/.well-known/agent.json') {
    return jsonResponse(res, 200, AGENT_DESCRIPTOR);
  }

  if (method === 'POST' && url === '/chat') {
    return handleChat(req, res);
  }

  if (method === 'POST' && url === '/analyze-threat') {
    return handleAnalyzeThreat(req, res);
  }

  jsonResponse(res, 404, { error: 'Not found. Available routes: GET /status, GET /.well-known/agent.json, POST /chat, POST /analyze-threat' });
});

server.listen(PORT, () => {
  console.log(`sting agent listening on http://localhost:${PORT}`);
  console.log('Routes: /status, /.well-known/agent.json, /chat, /analyze-threat');
});

export { AGENT_DESCRIPTOR, handleChat, handleAnalyzeThreat };
