#!/usr/bin/env node

/**
 * Sentry smoke demo — sends a test envelope to Sentry if SENTRY_DSN is set.
 *
 * Usage:
 *   SENTRY_DSN=https://key@o1.ingest.sentry.io/123 node scripts/sentry_smoke_demo.js
 *   node scripts/sentry_smoke_demo.js   # prints fallback explanation
 */

const { sentryConfigured, sendEnvelope, sanitizeUrl } = require('../src/sentry.js');

async function main() {
  console.log('=== Cloak Sting — Sentry smoke demo ===\n');

  if (!sentryConfigured()) {
    console.log('SENTRY_DSN is not set.');
    console.log('To enable Sentry capture, set SENTRY_DSN in your environment:');
    console.log('  SENTRY_DSN=https://<key>@<org>.ingest.sentry.io/<project> node scripts/sentry_smoke_demo.js\n');
    console.log('Fallback: Sentry module loaded and validated without sending.\n');

    const { parseDsn } = require('../src/sentry.js');
    const testDsn = 'https://abc123@o456.ingest.sentry.io/789';
    const parsed = parseDsn(testDsn);
    console.log('DSN parser self-test:');
    console.log(`  Input:     ${testDsn}`);
    console.log(`  Project:   ${parsed.projectId}`);
    console.log(`  PublicKey: ${parsed.publicKey}`);
    console.log(`  IngestURL: ${parsed.ingestUrl}`);

    const sanitized = sanitizeUrl('https://user:pass@example.com/page?secret=123#frag');
    console.log(`\nURL sanitizer self-test:`);
    console.log(`  Input:     https://user:pass@example.com/page?secret=123#frag`);
    console.log(`  Output:    ${sanitized}`);

    console.log('\nSentry module is ready. Set SENTRY_DSN to send live events.');
    return;
  }

  console.log('SENTRY_DSN detected. Sending test envelope...\n');

  const result = await sendEnvelope({
    message: 'Cloak Sting smoke test — scam defense extension loaded',
    level: 'info',
    tags: {
      product: 'cloak-sting',
      environment: 'hackathon-demo'
    },
    extra: {
      testType: 'smoke',
      timestamp: new Date().toISOString()
    }
  });

  if (result.sent) {
    console.log(`Envelope sent successfully.`);
    console.log(`  Event ID: ${result.eventId}`);
    console.log(`  Status:   ${result.status}`);
    console.log(`  Ingest:   ${result.ingestUrl}`);
  } else {
    console.log(`Envelope not sent.`);
    console.log(`  Reason: ${result.reason || `HTTP ${result.status}`}`);
  }
}

main().catch((err) => {
  console.error('Sentry smoke demo error:', err.message);
  process.exitCode = 1;
});
