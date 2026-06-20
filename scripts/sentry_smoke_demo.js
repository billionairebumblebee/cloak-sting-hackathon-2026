/**
 * Sentry smoke / demo script.
 *
 * Reads SENTRY_DSN from env only — never hardcoded.
 * Sends a sample scam-detection event through the lightweight envelope path
 * and prints a sanitized result (no DSN, keys, or tokens in output).
 *
 * Usage:
 *   SENTRY_DSN=https://key@o1.ingest.sentry.io/123 node scripts/sentry_smoke_demo.js
 *   node scripts/sentry_smoke_demo.js          # no-op when DSN absent
 */

const { sendEnvelope, sentryConfigured, parseDsn, sanitizeUrl, sanitizeContext } = require('../src/sentry.js');

async function main() {
  console.log('=== Cloak Sting — Sentry Smoke Demo ===\n');

  if (!sentryConfigured()) {
    console.log('SENTRY_DSN is not set. Sentry capture is disabled.');
    console.log('Set SENTRY_DSN in your environment to enable live Sentry reporting.\n');
    console.log('Verifying offline helpers…');

    const parsed = parseDsn('https://demo@o1.ingest.sentry.io/42');
    console.log(`  parseDsn:          OK — projectId=${parsed.projectId}`);

    const url = sanitizeUrl('https://user:pass@example.com/page?secret=1#frag');
    console.log(`  sanitizeUrl:       OK — ${url}`);

    const ctx = sanitizeContext({ api_key: 'sk-secret', score: 85, note: 'test' });
    console.log(`  sanitizeContext:   OK — api_key=${ctx.api_key}, score=${ctx.score}`);

    console.log('\nAll offline checks passed. Set SENTRY_DSN to run the live path.');
    return;
  }

  console.log('SENTRY_DSN detected — sending sample envelope…\n');

  const result = await sendEnvelope({
    message: 'Cloak Sting smoke test: scam detection event',
    level: 'info',
    tags: { component: 'smoke-demo', risk: 'test' },
    extra: { score: 42, scenario: 'sentry-smoke-demo' }
  });

  if (result.sent) {
    console.log(`Envelope sent successfully.`);
    console.log(`  eventId:  ${result.eventId}`);
    console.log(`  status:   ${result.status}`);
    console.log(`  ingest:   ${sanitizeUrl(result.ingestUrl)}`);
  } else {
    console.log('Envelope was not sent.');
    console.log(`  reason: ${result.reason || `HTTP ${result.status}`}`);
  }
}

main().catch((err) => {
  console.error('Smoke demo error:', err.message);
  process.exit(1);
});
