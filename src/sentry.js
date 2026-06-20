/**
 * Lightweight Sentry envelope capture for Cloak Sting.
 *
 * Reads SENTRY_DSN from env/config only — never hardcoded.
 * Builds a minimal Sentry envelope (event item) and POSTs it
 * to the Sentry ingest endpoint extracted from the DSN.
 *
 * No @sentry/node dependency — just the envelope wire format.
 */

function parseDsn(dsn) {
  if (!dsn) return null;
  try {
    const url = new URL(dsn);
    const projectId = url.pathname.replace(/^\//, '');
    const publicKey = url.username;
    const host = url.hostname;
    const protocol = url.protocol;
    if (!projectId || !publicKey || !host) return null;
    return {
      projectId,
      publicKey,
      host,
      ingestUrl: `${protocol}//${host}/api/${projectId}/envelope/`
    };
  } catch (_) {
    return null;
  }
}

function sentryConfigured(env = process.env) {
  return Boolean(env.SENTRY_DSN && parseDsn(env.SENTRY_DSN));
}

function sanitizeUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    parsed.search = '';
    parsed.hash = '';
    if (parsed.username) parsed.username = '[filtered]';
    if (parsed.password) parsed.password = '[filtered]';
    return parsed.toString();
  } catch (_) {
    return '[invalid-url]';
  }
}

function sanitizeContext(context) {
  if (!context || typeof context !== 'object') return {};
  const safe = {};
  const REDACT = /key|token|secret|password|dsn|auth|bearer|credential/i;
  for (const [k, v] of Object.entries(context)) {
    if (REDACT.test(k)) {
      safe[k] = '[filtered]';
    } else if (typeof v === 'string') {
      safe[k] = v.slice(0, 500);
    } else if (typeof v === 'number' || typeof v === 'boolean') {
      safe[k] = v;
    } else {
      safe[k] = '[object]';
    }
  }
  return safe;
}

function buildEnvelope({ message, level = 'info', tags = {}, extra = {} }, dsn) {
  const parsed = parseDsn(dsn);
  if (!parsed) throw new Error('Invalid or missing SENTRY_DSN');

  const eventId = crypto.randomUUID().replace(/-/g, '');
  const timestamp = new Date().toISOString();

  const envelopeHeader = JSON.stringify({
    event_id: eventId,
    dsn,
    sent_at: timestamp
  });

  const itemHeader = JSON.stringify({ type: 'event', length: 0 });

  const event = {
    event_id: eventId,
    timestamp,
    platform: 'node',
    level,
    logger: 'cloak-sting',
    server_name: 'cloak-sting-extension',
    message: { formatted: String(message || 'cloak-sting event').slice(0, 1000) },
    tags: sanitizeContext(tags),
    extra: sanitizeContext(extra)
  };

  const eventPayload = JSON.stringify(event);
  return {
    eventId,
    parsed,
    body: `${envelopeHeader}\n${itemHeader}\n${eventPayload}`
  };
}

async function sendEnvelope({ message, level = 'info', tags = {}, extra = {} }, { env = process.env, fetchImpl = fetch } = {}) {
  if (!sentryConfigured(env)) {
    return {
      sent: false,
      reason: 'SENTRY_DSN not configured. Set it in env to enable Sentry capture.'
    };
  }

  const { eventId, parsed, body } = buildEnvelope(
    { message, level, tags, extra },
    env.SENTRY_DSN
  );

  const response = await fetchImpl(parsed.ingestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-sentry-envelope',
      'X-Sentry-Auth': `Sentry sentry_version=7, sentry_client=cloak-sting/0.1.0, sentry_key=${parsed.publicKey}`
    },
    body
  });

  return {
    sent: response.ok,
    eventId,
    status: response.status,
    ingestUrl: parsed.ingestUrl
  };
}

async function captureScamEvent(receipt, options = {}) {
  const signalTypes = (receipt.findings || []).map((f) => f.type).filter(Boolean);
  const topSignals = [...new Set(signalTypes)].slice(0, 5).join(',');

  return sendEnvelope({
    message: `scam-detected: ${receipt.risk} risk (${receipt.score}/100) on ${sanitizeUrl(receipt.url)}`,
    level: receipt.risk === 'high' ? 'warning' : 'info',
    tags: {
      component: 'scam-detector',
      risk: receipt.risk || 'unknown',
      hostname: receipt.hostname || '',
      source: receipt.sourceType || 'page'
    },
    extra: {
      score: receipt.score || 0,
      findingCount: receipt.findingCount || (receipt.findings || []).length,
      signalTypes: topSignals,
      title: (receipt.title || '').slice(0, 200),
      url: sanitizeUrl(receipt.url),
      caseId: receipt.id || ''
    }
  }, options);
}

async function captureError(error, context = {}, options = {}) {
  return sendEnvelope({
    message: `error: ${String(error.message || error).slice(0, 500)}`,
    level: 'error',
    tags: {
      component: context.component || 'unknown',
      errorType: error.name || 'Error'
    },
    extra: {
      stack: String(error.stack || '').slice(0, 500),
      ...context
    }
  }, options);
}

module.exports = {
  parseDsn,
  sentryConfigured,
  sanitizeUrl,
  sanitizeContext,
  buildEnvelope,
  sendEnvelope,
  captureScamEvent,
  captureError
};
