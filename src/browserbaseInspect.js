const { analyzeScamSurface } = require('./scamSignals.js');
const { normalizeReceiptToCase } = require('./caseStore.js');

function browserbaseConfigured(env = process.env) {
  return Boolean(env.BROWSERBASE_API_KEY && env.BROWSERBASE_PROJECT_ID);
}

async function createBrowserbaseSession({ env = process.env, fetchImpl = fetch } = {}) {
  if (!browserbaseConfigured(env)) {
    return {
      configured: false,
      reason: 'Set BROWSERBASE_API_KEY and BROWSERBASE_PROJECT_ID to create isolated sessions.'
    };
  }

  const response = await fetchImpl('https://api.browserbase.com/v1/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-BB-API-Key': env.BROWSERBASE_API_KEY
    },
    body: JSON.stringify({
      projectId: env.BROWSERBASE_PROJECT_ID,
      proxies: Boolean(env.BROWSERBASE_PROXIES),
      browserSettings: {
        blockAds: true,
        recordSession: true,
        logSession: true,
        viewport: { width: 1440, height: 1000 }
      },
      userMetadata: {
        product: 'cloak-sting',
        purpose: 'isolated-scam-link-inspection'
      }
    })
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    const err = new Error(`Browserbase session create failed: ${response.status} ${text}`.trim());
    try {
      const { captureError } = require('./sentry.js');
      captureError(err, { component: 'browserbase-inspect' }).catch(() => {});
    } catch (_) {}
    throw err;
  }

  const session = await response.json();
  return {
    configured: true,
    sessionId: session.id,
    projectId: session.projectId,
    status: session.status,
    recordingUrl: session.id ? `https://browserbase.com/sessions/${session.id}` : '',
    connectUrlPresent: Boolean(session.connectUrl),
    seleniumRemoteUrlPresent: Boolean(session.seleniumRemoteUrl)
  };
}

async function fetchPageEvidence(url, { fetchImpl = fetch } = {}) {
  if (String(url).startsWith('file://')) {
    const fs = require('node:fs');
    const { fileURLToPath } = require('node:url');
    const html = fs.readFileSync(fileURLToPath(url), 'utf8');
    return htmlToEvidence(url, html, 200);
  }

  const response = await fetchImpl(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'cloak-sting-hackathon/0.1 isolated-link-inspector'
    }
  });
  const html = await response.text();
  return htmlToEvidence(response.url || url, html, response.status);
}

function htmlToEvidence(url, html, status) {
  const title = (html.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1] || '';
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 12000);
  return {
    url,
    hostname: safeHostname(url),
    title,
    text,
    status
  };
}

async function inspectSuspiciousLink(url, options = {}) {
  const session = await createBrowserbaseSession(options);
  const evidence = await fetchPageEvidence(url, options);
  const analysis = analyzeScamSurface(evidence);
  const receipt = {
    id: `browserbase-${Date.now()}`,
    url: evidence.url,
    hostname: evidence.hostname,
    title: evidence.title,
    browserbase: session,
    ...analysis
  };
  return {
    session,
    evidence,
    receipt,
    caseRecord: normalizeReceiptToCase(receipt, {
      source: 'browserbase-isolated-link-inspection'
    })
  };
}

function safeHostname(url) {
  try { return new URL(url).hostname; } catch (_) { return ''; }
}

module.exports = {
  browserbaseConfigured,
  createBrowserbaseSession,
  fetchPageEvidence,
  inspectSuspiciousLink
};
