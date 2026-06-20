const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const DEFAULT_LOCAL_PATH = path.join(process.cwd(), 'data', 'scam-cases.json');

function stableId(input) {
  const basis = [input.url, input.hostname, input.title, input.analyzedAt, Date.now()].filter(Boolean).join('|');
  return `case_${crypto.createHash('sha256').update(basis).digest('hex').slice(0, 16)}`;
}

function inferBrand(receipt) {
  const haystack = `${receipt.hostname || ''} ${receipt.title || ''} ${(receipt.findings || []).map((f) => f.evidence).join(' ')}`.toLowerCase();
  const brands = [
    ['USPS', ['usps', 'postal', 'redelivery']],
    ['FedEx', ['fedex']],
    ['DHL', ['dhl']],
    ['PayPal', ['paypal']],
    ['Apple', ['apple support', 'icloud', 'apple']],
    ['Microsoft', ['microsoft support', 'windows defender', 'microsoft']],
    ['Bank', ['bank', 'fraud department', 'online banking']]
  ];
  const match = brands.find(([, needles]) => needles.some((needle) => haystack.includes(needle)));
  return match ? match[0] : 'Unknown / needs review';
}

function inferJurisdiction(receipt) {
  const host = String(receipt.hostname || '').toLowerCase();
  const text = `${receipt.title || ''} ${(receipt.findings || []).map((f) => `${f.label} ${f.evidence}`).join(' ')}`.toLowerCase();
  if (host.endsWith('.us') || /\busps\b|\birs\b|\bfbi\b|\bftc\b|social security/.test(text)) {
    return { country: 'United States', confidence: 'medium', basis: 'US institution/domain language' };
  }
  if (host.endsWith('.cn') || /中国|公安|普通话|人民币|微信|支付宝/.test(text)) {
    return { country: 'China / Chinese-language context', confidence: 'low', basis: 'language/domain clue only' };
  }
  if (host.endsWith('.uk')) return { country: 'United Kingdom', confidence: 'low', basis: 'country-code domain' };
  if (host.endsWith('.ca')) return { country: 'Canada', confidence: 'low', basis: 'country-code domain' };
  return { country: 'Unknown', confidence: 'unknown', basis: 'No reliable public jurisdiction clue' };
}

function reportingChannels(caseRecord) {
  const channels = [
    { name: 'FTC ReportFraud', url: 'https://reportfraud.ftc.gov/', use: 'US consumer fraud report' },
    { name: 'FBI IC3', url: 'https://www.ic3.gov/', use: 'US internet crime report' },
    { name: 'Bank/card issuer', url: '', use: 'If payment/card credentials were entered or requested' },
    { name: 'Impersonated brand abuse team', url: '', use: `Report brand impersonation: ${caseRecord.suspectedBrand}` },
    { name: 'Domain registrar / hosting abuse contact', url: '', use: 'Submit URL/domain evidence for takedown review' }
  ];
  if (caseRecord.jurisdiction.country.includes('China')) {
    channels.push({ name: 'Local police / consulate guidance', url: '', use: 'For cross-border Chinese-language ransom or family-threat scams' });
  }
  return channels;
}

function normalizeReceiptToCase(receipt, extra = {}) {
  const now = new Date().toISOString();
  const caseRecord = {
    id: extra.id || receipt.id || stableId(receipt),
    source: extra.source || 'cloak-sting-extension',
    createdAt: extra.createdAt || now,
    updatedAt: now,
    url: receipt.url || '',
    hostname: receipt.hostname || safeHostname(receipt.url),
    title: receipt.title || '',
    risk: receipt.risk || 'unknown',
    score: Number(receipt.score || 0),
    advice: receipt.advice || '',
    findings: Array.isArray(receipt.findings) ? receipt.findings : [],
    suspectedBrand: extra.suspectedBrand || inferBrand(receipt),
    jurisdiction: extra.jurisdiction || inferJurisdiction(receipt),
    victimSafeNotes: extra.victimSafeNotes || '',
    evidence: {
      observedOnly: true,
      screenshotPath: extra.screenshotPath || '',
      transcript: extra.transcript || '',
      rawReceipt: receipt
    },
    safetyBoundary: 'Evidence record only. Does not identify a private person or make legal conclusions.',
    status: extra.status || 'new'
  };
  caseRecord.reportingChannels = reportingChannels(caseRecord);
  return caseRecord;
}

function safeHostname(url) {
  try { return new URL(url).hostname; } catch (_) { return ''; }
}

class LocalCaseStore {
  constructor(filePath = process.env.CLOAK_STING_CASES_PATH || DEFAULT_LOCAL_PATH) {
    this.filePath = filePath;
  }

  readAll() {
    if (!fs.existsSync(this.filePath)) return [];
    return JSON.parse(fs.readFileSync(this.filePath, 'utf8') || '[]');
  }

  saveCase(caseRecord) {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    const all = this.readAll();
    const idx = all.findIndex((item) => item.id === caseRecord.id);
    if (idx >= 0) all[idx] = { ...all[idx], ...caseRecord, updatedAt: new Date().toISOString() };
    else all.push(caseRecord);
    fs.writeFileSync(this.filePath, JSON.stringify(all, null, 2));
    return { backend: 'local-json', case: caseRecord, path: this.filePath };
  }

  getCase(id) {
    return this.readAll().find((item) => item.id === id) || null;
  }
}

class RedisRestCaseStore {
  constructor({ url = process.env.REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL, token = process.env.REDIS_API_KEY || process.env.UPSTASH_REDIS_REST_TOKEN } = {}) {
    this.url = url;
    this.token = token;
  }

  isConfigured() {
    return Boolean(this.url && this.token && /^https?:\/\//.test(this.url));
  }

  async command(args) {
    if (!this.isConfigured()) throw new Error('Redis REST is not configured; set REDIS_REST_URL plus REDIS_API_KEY.');
    const response = await fetch(`${this.url.replace(/\/$/, '')}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(args)
    });
    if (!response.ok) {
      const err = new Error(`Redis REST command failed: ${response.status}`);
      try {
        const { captureError } = require('./sentry.js');
        captureError(err, { component: 'case-store-redis-rest' }).catch(() => {});
      } catch (_) {}
      throw err;
    }
    return response.json();
  }

  async saveCase(caseRecord) {
    await this.command(['JSON.SET', `cloak:case:${caseRecord.id}`, '$', JSON.stringify(caseRecord)]).catch(async () => {
      await this.command(['SET', `cloak:case:${caseRecord.id}`, JSON.stringify(caseRecord)]);
    });
    await this.command(['SADD', 'cloak:cases', caseRecord.id]).catch(() => null);
    return { backend: 'redis-rest', case: caseRecord };
  }
}

class RedisClientCaseStore {
  constructor({
    url = process.env.REDIS_URL,
    username = process.env.REDIS_USERNAME || 'default',
    password = process.env.REDIS_PASSWORD,
    host = process.env.REDIS_HOST,
    port = process.env.REDIS_PORT
  } = {}) {
    this.url = url;
    this.username = username;
    this.password = password;
    this.host = host;
    this.port = port ? Number(port) : undefined;
  }

  isConfigured() {
    return Boolean(this.url || (this.host && this.port && this.password));
  }

  clientOptions() {
    if (this.url) return { url: this.url };
    return {
      username: this.username,
      password: this.password,
      socket: { host: this.host, port: this.port }
    };
  }

  async saveCase(caseRecord) {
    if (!this.isConfigured()) {
      throw new Error('Redis client is not configured; set REDIS_URL or REDIS_HOST/REDIS_PORT/REDIS_PASSWORD.');
    }
    const { createClient } = await import('redis');
    const client = createClient(this.clientOptions());
    client.on('error', () => {});
    await client.connect();
    try {
      await client.set(`cloak:case:${caseRecord.id}`, JSON.stringify(caseRecord));
      await client.sAdd('cloak:cases', caseRecord.id).catch(() => null);
      return { backend: 'redis-client', case: caseRecord };
    } finally {
      await client.quit().catch(() => null);
    }
  }
}

function createCaseStore() {
  const redisClient = new RedisClientCaseStore();
  if (redisClient.isConfigured()) return redisClient;
  const redis = new RedisRestCaseStore();
  if (redis.isConfigured()) return redis;
  return new LocalCaseStore();
}

module.exports = {
  LocalCaseStore,
  RedisRestCaseStore,
  RedisClientCaseStore,
  createCaseStore,
  normalizeReceiptToCase,
  inferBrand,
  inferJurisdiction,
  reportingChannels
};
