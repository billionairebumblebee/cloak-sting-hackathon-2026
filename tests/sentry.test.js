const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { parseDsn, sentryConfigured, sanitizeUrl, sanitizeContext, buildEnvelope, sendEnvelope, captureScamEvent, captureError } = require('../src/sentry.js');

describe('parseDsn', () => {
  it('extracts project ID, public key, and ingest URL', () => {
    const result = parseDsn('https://abc123@o456.ingest.sentry.io/789');
    assert.equal(result.projectId, '789');
    assert.equal(result.publicKey, 'abc123');
    assert.equal(result.host, 'o456.ingest.sentry.io');
    assert.equal(result.ingestUrl, 'https://o456.ingest.sentry.io/api/789/envelope/');
  });

  it('returns null for empty or invalid DSN', () => {
    assert.equal(parseDsn(''), null);
    assert.equal(parseDsn(null), null);
    assert.equal(parseDsn('not-a-url'), null);
  });
});

describe('sentryConfigured', () => {
  it('returns false without SENTRY_DSN', () => {
    assert.equal(sentryConfigured({}), false);
  });

  it('returns true with valid SENTRY_DSN', () => {
    assert.equal(sentryConfigured({ SENTRY_DSN: 'https://key@o1.ingest.sentry.io/1' }), true);
  });

  it('returns false with malformed DSN', () => {
    assert.equal(sentryConfigured({ SENTRY_DSN: 'garbage' }), false);
  });
});

describe('sanitizeUrl', () => {
  it('strips query and hash from URLs', () => {
    assert.equal(sanitizeUrl('https://example.com/page?secret=123#frag'), 'https://example.com/page');
  });

  it('redacts embedded credentials', () => {
    const result = sanitizeUrl('https://user:pass@example.com/path');
    assert.ok(!result.includes('user:pass'));
    assert.ok(result.includes('filtered'));
  });

  it('handles empty/invalid URLs safely', () => {
    assert.equal(sanitizeUrl(''), '');
    assert.equal(sanitizeUrl('not a url'), '[invalid-url]');
  });
});

describe('sanitizeContext', () => {
  it('redacts keys matching secret patterns', () => {
    const result = sanitizeContext({ api_key: 'sk-123', score: 80, name: 'test' });
    assert.equal(result.api_key, '[filtered]');
    assert.equal(result.score, 80);
    assert.equal(result.name, 'test');
  });

  it('truncates long string values', () => {
    const result = sanitizeContext({ description: 'x'.repeat(1000) });
    assert.ok(result.description.length <= 500);
  });

  it('handles null/undefined input', () => {
    assert.deepEqual(sanitizeContext(null), {});
    assert.deepEqual(sanitizeContext(undefined), {});
  });
});

describe('buildEnvelope', () => {
  const DSN = 'https://testkey@o1.ingest.sentry.io/42';

  it('produces a three-line envelope body', () => {
    const { body, eventId } = buildEnvelope({ message: 'test event' }, DSN);
    const lines = body.split('\n');
    assert.equal(lines.length, 3);
    const header = JSON.parse(lines[0]);
    assert.equal(header.event_id, eventId);
    assert.ok(header.dsn);
    const itemHeader = JSON.parse(lines[1]);
    assert.equal(itemHeader.type, 'event');
    const event = JSON.parse(lines[2]);
    assert.equal(event.event_id, eventId);
    assert.equal(event.platform, 'node');
    assert.equal(event.message.formatted, 'test event');
    assert.equal(event.logger, 'sting');
  });

  it('sanitizes tags and extra', () => {
    const { body } = buildEnvelope(
      { message: 'test', tags: { api_key: 'secret' }, extra: { token: 'abc' } },
      DSN
    );
    const event = JSON.parse(body.split('\n')[2]);
    assert.equal(event.tags.api_key, '[filtered]');
    assert.equal(event.extra.token, '[filtered]');
  });

  it('throws for invalid DSN', () => {
    assert.throws(() => buildEnvelope({ message: 'test' }, ''), /Invalid/);
  });
});

describe('sendEnvelope', () => {
  it('returns not-sent when DSN is missing', async () => {
    const result = await sendEnvelope({ message: 'test' }, { env: {} });
    assert.equal(result.sent, false);
    assert.ok(result.reason.includes('not configured'));
  });

  it('sends envelope to ingest URL without leaking DSN in body', async () => {
    let capturedUrl, capturedBody, capturedHeaders;
    const mockFetch = async (url, opts) => {
      capturedUrl = url;
      capturedBody = opts.body;
      capturedHeaders = opts.headers;
      return { ok: true, status: 200 };
    };

    const env = { SENTRY_DSN: 'https://pubkey@o1.ingest.sentry.io/99' };
    const result = await sendEnvelope(
      { message: 'scam detected', level: 'warning', tags: { risk: 'high' } },
      { env, fetchImpl: mockFetch }
    );

    assert.equal(result.sent, true);
    assert.equal(result.status, 200);
    assert.ok(result.eventId);
    assert.equal(capturedUrl, 'https://o1.ingest.sentry.io/api/99/envelope/');
    assert.ok(capturedHeaders['X-Sentry-Auth'].includes('sentry_key=pubkey'));
    // DSN appears in envelope header (required by Sentry wire protocol)
    // but must NOT appear in the event payload itself
    const eventPayload = capturedBody.split('\n')[2];
    assert.ok(!eventPayload.includes('pubkey@'));

    const eventLine = capturedBody.split('\n')[2];
    const event = JSON.parse(eventLine);
    assert.equal(event.message.formatted, 'scam detected');
    assert.equal(event.level, 'warning');
    assert.equal(event.tags.risk, 'high');
  });

  it('reports failure status when ingest returns error', async () => {
    const mockFetch = async () => ({ ok: false, status: 429 });
    const env = { SENTRY_DSN: 'https://key@o1.ingest.sentry.io/1' };
    const result = await sendEnvelope({ message: 'test' }, { env, fetchImpl: mockFetch });
    assert.equal(result.sent, false);
    assert.equal(result.status, 429);
  });
});

describe('captureScamEvent', () => {
  it('returns no-op when DSN is absent', async () => {
    const result = await captureScamEvent({
      id: 'test-001', risk: 'high', score: 92, url: 'https://scam.example.com',
      hostname: 'scam.example.com', findings: [{ type: 'payment', label: 'Gift card' }]
    }, { env: {} });
    assert.equal(result.sent, false);
    assert.ok(result.reason);
  });

  it('sends scam event with auto-tagged risk/score/signals', async () => {
    let capturedBody;
    const mockFetch = async (_, opts) => { capturedBody = opts.body; return { ok: true, status: 200 }; };
    const env = { SENTRY_DSN: 'https://key@o1.ingest.sentry.io/1' };

    const result = await captureScamEvent({
      id: 'case-42', risk: 'high', score: 88, url: 'https://phish.click/login',
      hostname: 'phish.click', title: 'Verify Account',
      findings: [{ type: 'payment', label: 'Gift card' }, { type: 'urgency', label: 'Act now' }, { type: 'credential', label: 'Password' }]
    }, { env, fetchImpl: mockFetch });

    assert.equal(result.sent, true);
    const event = JSON.parse(capturedBody.split('\n')[2]);
    assert.equal(event.tags.risk, 'high');
    assert.equal(event.tags.component, 'scam-detector');
    assert.equal(event.extra.score, 88);
    assert.ok(event.extra.signalTypes.includes('payment'));
    assert.ok(event.extra.signalTypes.includes('urgency'));
    assert.ok(event.message.formatted.includes('high risk'));
  });

  it('tags with source type when provided', async () => {
    let capturedBody;
    const mockFetch = async (_, opts) => { capturedBody = opts.body; return { ok: true, status: 200 }; };
    const env = { SENTRY_DSN: 'https://key@o1.ingest.sentry.io/1' };

    await captureScamEvent({
      id: 'voice-1', risk: 'high', score: 95, url: 'voice:demo.wav',
      hostname: '', sourceType: 'voice',
      findings: [{ type: 'ransom', label: 'Ransom' }]
    }, { env, fetchImpl: mockFetch });

    const event = JSON.parse(capturedBody.split('\n')[2]);
    assert.equal(event.tags.source, 'voice');
  });
});

describe('captureError', () => {
  it('returns no-op when DSN is absent', async () => {
    const result = await captureError(new Error('test'), { component: 'test' }, { env: {} });
    assert.equal(result.sent, false);
  });

  it('sends error event with component tag and stack', async () => {
    let capturedBody;
    const mockFetch = async (_, opts) => { capturedBody = opts.body; return { ok: true, status: 200 }; };
    const env = { SENTRY_DSN: 'https://key@o1.ingest.sentry.io/1' };

    const err = new Error('Deepgram API timeout');
    const result = await captureError(err, { component: 'deepgram-stt', audioFile: 'demo.wav' }, { env, fetchImpl: mockFetch });

    assert.equal(result.sent, true);
    const event = JSON.parse(capturedBody.split('\n')[2]);
    assert.equal(event.level, 'error');
    assert.equal(event.tags.component, 'deepgram-stt');
    assert.ok(event.message.formatted.includes('Deepgram API timeout'));
    assert.ok(event.extra.stack.length > 0);
  });
});
