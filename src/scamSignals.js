(function attachScamSignals(global) {
  const URGENCY_TERMS = [
    'act now', 'urgent', 'immediately', 'within 24 hours', 'final notice',
    'account locked', 'account suspended', 'verify now', 'limited time'
  ];

  const PAYMENT_TERMS = [
    'wire transfer', 'gift card', 'crypto', 'bitcoin', 'zelle', 'cash app',
    'processing fee', 'redelivery fee', 'customs fee', 'pay to release'
  ];

  const TRUST_IMPERSONATION_TERMS = [
    'bank security', 'fraud department', 'irs', 'usps', 'fedex', 'dhl',
    'apple support', 'microsoft support', 'verification center'
  ];

  const SECRET_PRESSURE_TERMS = [
    'do not tell', 'keep this confidential', 'do not contact', 'avoid calling',
    'only through this page', 'ignore other messages'
  ];

  const HOSTAGE_RANSOM_TERMS = [
    'ransom', 'kidnap', 'hostage', 'we have your', 'pay or else',
    'wire the money', "don't call the police", 'do not call the police',
    'your son', 'your daughter', 'your child', 'will be harmed',
    'pay immediately or', 'we will hurt', 'bitcoin wallet',
    'cash drop', 'unmarked bills'
  ];

  const CHINESE_SCAM_TERMS = [
    '大使馆', '领事馆', '包裹', '快递', '警察', '公安',
    '洗钱', '通缉', '拘留', '护照', '签证',
    '银行账户', '转账', '冻结', '逮捕令', '资金安全',
    '配合调查', '涉嫌犯罪'
  ];

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function containsAny(text, terms) {
    return terms.filter((term) => text.includes(term));
  }

  function hostnameSignals(hostname) {
    const host = normalize(hostname);
    const findings = [];
    if (!host) return findings;

    if (/\bsecure[-.]?(login|verify|update)\b/.test(host)) {
      findings.push({ type: 'domain', label: 'Security-language domain', weight: 18, evidence: host });
    }
    if (/(bank|paypal|apple|usps|fedex|dhl).*(verify|support|claim|secure)/.test(host)) {
      findings.push({ type: 'domain', label: 'Brand impersonation pattern', weight: 22, evidence: host });
    }
    if (/\.zip$|\.mov$|\.click$|\.top$|\.xyz$/.test(host)) {
      findings.push({ type: 'domain', label: 'Risky novelty top-level domain', weight: 10, evidence: host });
    }
    if (host.split('-').length >= 4) {
      findings.push({ type: 'domain', label: 'Hyphen-stuffed domain', weight: 8, evidence: host });
    }
    return findings;
  }

  function scoreText(text) {
    const normalized = normalize(text);
    const findings = [];

    for (const term of containsAny(normalized, URGENCY_TERMS)) {
      findings.push({ type: 'copy', label: 'Urgency pressure', weight: 12, evidence: term });
    }
    for (const term of containsAny(normalized, PAYMENT_TERMS)) {
      findings.push({ type: 'payment', label: 'Unusual payment request', weight: 18, evidence: term });
    }
    for (const term of containsAny(normalized, TRUST_IMPERSONATION_TERMS)) {
      findings.push({ type: 'impersonation', label: 'Trusted institution language', weight: 14, evidence: term });
    }
    for (const term of containsAny(normalized, SECRET_PRESSURE_TERMS)) {
      findings.push({ type: 'pressure', label: 'Isolation / secrecy pressure', weight: 18, evidence: term });
    }
    for (const term of containsAny(normalized, HOSTAGE_RANSOM_TERMS)) {
      findings.push({ type: 'ransom', label: 'Hostage / ransom threat', weight: 22, evidence: term });
    }
    for (const term of containsAny(text, CHINESE_SCAM_TERMS)) {
      findings.push({ type: 'chinese_scam', label: 'Chinese-language scam signal', weight: 16, evidence: term });
    }

    const passwordFields = (text.match(/password|passcode|security code|one-time code|otp/g) || []).length;
    if (passwordFields >= 2) {
      findings.push({ type: 'credential', label: 'Repeated credential/code request', weight: 16, evidence: `${passwordFields} credential terms` });
    }

    return findings;
  }

  function analyzeScamSurface(input) {
    const title = input?.title || '';
    const url = input?.url || '';
    let hostname = input?.hostname || '';
    try {
      if (!hostname && url) hostname = new URL(url).hostname;
    } catch (_) {}

    const pageText = input?.text || '';
    const findings = [...hostnameSignals(hostname), ...scoreText(`${title} ${pageText}`)];
    const rawScore = findings.reduce((sum, item) => sum + item.weight, 0);
    const score = Math.min(100, rawScore);
    let risk = 'low';
    if (score >= 65) risk = 'high';
    else if (score >= 35) risk = 'medium';

    return {
      product: 'cloak sting',
      risk,
      score,
      findingCount: findings.length,
      findings,
      advice: risk === 'high'
        ? 'Pause. Do not pay, enter passwords, or call numbers on this page. Verify through the official app or typed official website.'
        : risk === 'medium'
          ? 'Slow down and verify through an official channel before continuing.'
          : 'No strong scam pattern detected, but stay alert before sharing money or codes.',
      analyzedAt: new Date().toISOString()
    };
  }

  global.CloakScamSignals = { analyzeScamSurface, scoreText, hostnameSignals };

  if (typeof module !== 'undefined') {
    module.exports = global.CloakScamSignals;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
