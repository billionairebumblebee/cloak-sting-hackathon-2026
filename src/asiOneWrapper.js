/**
 * ASI:One / Agentverse wrapper for cloak STING scam receipt analysis.
 *
 * Wraps the existing deterministic scam signal engine as an agent-callable
 * endpoint shape compatible with Fetch.ai ASI:One / Agentverse protocol.
 *
 * This module does NOT require ASI:One registration or API keys to function.
 * It exposes the same analyzeScamSurface pipeline through an agent-protocol
 * request/response shape so that:
 *  1. An Agentverse-registered agent can call it via the standard protocol.
 *  2. A local demo can exercise the same shape without network dependencies.
 *
 * Registration with Agentverse is a separate manual step documented in README.
 */

const { analyzeScamSurface } = require('./scamSignals.js');
const { normalizeReceiptToCase } = require('./caseStore.js');
const { renderMarkdownDossier } = require('./dossier.js');

const AGENT_NAME = 'cloak-sting-scam-analyzer';
const AGENT_VERSION = '0.1.0';
const AGENT_PROTOCOL = 'scam-receipt-analysis/0.1';

function agentInfo() {
  return {
    name: AGENT_NAME,
    version: AGENT_VERSION,
    protocol: AGENT_PROTOCOL,
    description: 'Deterministic scam signal analysis agent. Accepts a page URL/text and returns a threat receipt with risk score, findings, and safe advice.',
    capabilities: ['analyze-page', 'analyze-text'],
    registeredOnAgentverse: false
  };
}

function validateRequest(request) {
  if (!request || typeof request !== 'object') {
    return { valid: false, error: 'Request must be a JSON object' };
  }
  if (!request.url && !request.text) {
    return { valid: false, error: 'Provide at least url or text to analyze' };
  }
  return { valid: true };
}

function handleAnalyzeRequest(request) {
  const validation = validateRequest(request);
  if (!validation.valid) {
    return {
      agent: AGENT_NAME,
      protocol: AGENT_PROTOCOL,
      status: 'error',
      error: validation.error
    };
  }

  const input = {
    url: String(request.url || ''),
    hostname: request.hostname || '',
    title: String(request.title || ''),
    text: String(request.text || '').slice(0, 12000)
  };

  const analysis = analyzeScamSurface(input);
  const receipt = {
    id: `asi-${Date.now()}`,
    url: input.url,
    hostname: input.hostname || safeHostname(input.url),
    title: input.title,
    ...analysis
  };

  const caseRecord = normalizeReceiptToCase(receipt, {
    source: 'asi-one-agent-wrapper'
  });

  return {
    agent: AGENT_NAME,
    protocol: AGENT_PROTOCOL,
    status: 'ok',
    receipt,
    caseRecord: {
      id: caseRecord.id,
      risk: caseRecord.risk,
      score: caseRecord.score,
      findings: caseRecord.findings,
      advice: caseRecord.advice,
      suspectedBrand: caseRecord.suspectedBrand,
      jurisdiction: caseRecord.jurisdiction,
      safetyBoundary: caseRecord.safetyBoundary
    },
    dossierPreview: renderMarkdownDossier(caseRecord).slice(0, 2000)
  };
}

function createAgentServer(options = {}) {
  const http = require('node:http');
  const port = options.port || Number(process.env.ASI_AGENT_PORT) || 8199;

  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET' && req.url === '/info') {
      res.end(JSON.stringify(agentInfo(), null, 2));
      return;
    }

    if (req.method === 'POST' && req.url === '/analyze') {
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', () => {
        try {
          const request = JSON.parse(body);
          const result = handleAnalyzeRequest(request);
          res.statusCode = result.status === 'ok' ? 200 : 400;
          res.end(JSON.stringify(result, null, 2));
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ status: 'error', error: 'Invalid JSON body' }));
        }
      });
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ status: 'error', error: 'Not found. Use GET /info or POST /analyze' }));
  });

  return { server, port, start: () => new Promise((resolve) => server.listen(port, () => resolve(port))) };
}

function safeHostname(url) {
  try { return new URL(url).hostname; } catch (_) { return ''; }
}

module.exports = {
  AGENT_NAME,
  AGENT_VERSION,
  AGENT_PROTOCOL,
  agentInfo,
  validateRequest,
  handleAnalyzeRequest,
  createAgentServer
};
