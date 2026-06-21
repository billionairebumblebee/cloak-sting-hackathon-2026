/**
 * Sentry smoke / demo script.
 *
 * Reads SENTRY_DSN from env only — never hardcoded.
 * Sends a sample scam-detection event through the lightweight envelope path
 * and prints a sanitized result (no DSN, keys, or tokens in output).
 * Saves a proof artifact to dist/sentry-proof.json.
 *
 * Usage:
 *   SENTRY_DSN=https://key@o1.ingest.sentry.io/123 node scripts/sentry_smoke_demo.js
 *   node scripts/sentry_smoke_demo.js          # fallback when DSN absent
 */

const fs = require('node:fs');
const path = require('node:path');
const { sendEnvelope, captureScamEvent, captureError, sentryConfigured, parseDsn, sanitizeUrl, sanitizeContext } = require('../src/sentry.js');

function saveProof(proof) {
  const dir = path.join(process.cwd(), 'dist');
  fs.mkdirSync(dir, { recursive: true });
  const proofPath = path.join(dir, 'sentry-proof.json');
  fs.writeFileSync(proofPath, JSON.stringify(proof, null, 2));
  console.log(`\nProof artifact: ${proofPath}`);
}

async function main() {
  console.log('=== sting — Sentry Smoke Demo ===\n');

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

    console.log('\nVerifying captureScamEvent (no-op without DSN)…');
    const scamResult = await captureScamEvent({
      id: 'test-001', risk: 'high', score: 92, url: 'https://example.com/scam',
      hostname: 'example.com', title: 'Test scam page',
      findings: [{ type: 'payment', label: 'Payment pressure' }, { type: 'urgency', label: 'Urgency language' }]
    });
    console.log(`  captureScamEvent:  OK — sent=${scamResult.sent}, reason="${scamResult.reason ? scamResult.reason.slice(0, 50) : 'n/a'}"`);

    console.log('Verifying captureError (no-op without DSN)…');
    const errResult = await captureError(new Error('Test error'), { component: 'smoke-demo' });
    console.log(`  captureError:      OK — sent=${errResult.sent}`);

    saveProof({
      mode: 'fallback',
      reason: 'SENTRY_DSN not set',
      timestamp: new Date().toISOString(),
      parseDsn: 'ok',
      sanitizeUrl: 'ok',
      sanitizeContext: 'ok',
      captureScamEvent: scamResult.sent ? 'sent' : 'no-op (expected)',
      captureError: errResult.sent ? 'sent' : 'no-op (expected)'
    });

    console.log('\nAll offline checks passed. Set SENTRY_DSN to run the live path.');
    return;
  }

  console.log('SENTRY_DSN detected — running live proof…\n');

  console.log('1. Sending raw envelope…');
  const rawResult = await sendEnvelope({
    message: 'sting smoke test: scam detection event',
    level: 'info',
    tags: { component: 'smoke-demo', risk: 'test' },
    extra: { score: 42, scenario: 'sentry-smoke-demo' }
  });
  console.log(`   sent=${rawResult.sent}, eventId=${rawResult.eventId}, status=${rawResult.status}`);

  console.log('2. Sending captureScamEvent…');
  const scamResult = await captureScamEvent({
    id: 'smoke-scam-001', risk: 'high', score: 88, url: 'https://example-phish.click/login',
    hostname: 'example-phish.click', title: 'Verify Your Account',
    findings: [
      { type: 'payment', label: 'Payment pressure (gift card)' },
      { type: 'urgency', label: '24-hour deadline' },
      { type: 'credential', label: 'Password harvesting' }
    ]
  });
  console.log(`   sent=${scamResult.sent}, eventId=${scamResult.eventId}`);

  console.log('3. Sending captureError…');
  const errResult = await captureError(
    new Error('Simulated Deepgram API timeout'),
    { component: 'deepgram-stt', audioFile: 'demo.wav' }
  );
  console.log(`   sent=${errResult.sent}, eventId=${errResult.eventId}`);

  const allSent = rawResult.sent && scamResult.sent && errResult.sent;

  const proof = {
    mode: allSent ? 'live' : 'live-partial',
    timestamp: new Date().toISOString(),
    rawEnvelope: { sent: rawResult.sent, eventId: rawResult.eventId, status: rawResult.status, ingest: sanitizeUrl(rawResult.ingestUrl) },
    scamEvent: { sent: scamResult.sent, eventId: scamResult.eventId, status: scamResult.status },
    errorEvent: { sent: errResult.sent, eventId: errResult.eventId, status: errResult.status }
  };

  saveProof(proof);

  if (allSent) {
    console.log('\nLive Sentry proof complete. All three event types sent successfully.');
  } else {
    const failed = [!rawResult.sent && 'rawEnvelope', !scamResult.sent && 'scamEvent', !errResult.sent && 'errorEvent'].filter(Boolean);
    console.log(`\nSentry DSN is set but some events did not send: ${failed.join(', ')}.`);
    console.log('Check your DSN and network. Proof JSON records the partial results.');
  }
}

main().catch((err) => {
  console.error('Smoke demo error:', err.message);
  process.exit(1);
});
