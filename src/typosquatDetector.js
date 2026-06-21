/**
 * Typosquat & homoglyph detector for cloak sting.
 *
 * Detects domains that impersonate well-known brands via:
 *  - Character substitution (paypa1.com → paypal.com)
 *  - Homoglyph attack (аpple.com using Cyrillic а)
 *  - Combo-squat (paypal-secure-login.com)
 *  - TLD abuse (amazon.xyz, chase.click)
 */

const BRAND_DOMAINS = [
  { brand: 'PayPal', canonical: 'paypal.com', keywords: ['paypal'] },
  { brand: 'Apple', canonical: 'apple.com', keywords: ['apple', 'icloud'] },
  { brand: 'Amazon', canonical: 'amazon.com', keywords: ['amazon', 'aws'] },
  { brand: 'Chase', canonical: 'chase.com', keywords: ['chase'] },
  { brand: 'Wells Fargo', canonical: 'wellsfargo.com', keywords: ['wellsfargo', 'wells-fargo'] },
  { brand: 'Bank of America', canonical: 'bankofamerica.com', keywords: ['bankofamerica', 'bofa'] },
  { brand: 'Microsoft', canonical: 'microsoft.com', keywords: ['microsoft', 'outlook', 'onedrive'] },
  { brand: 'Google', canonical: 'google.com', keywords: ['google', 'gmail'] },
  { brand: 'Netflix', canonical: 'netflix.com', keywords: ['netflix'] },
  { brand: 'USPS', canonical: 'usps.com', keywords: ['usps'] },
  { brand: 'FedEx', canonical: 'fedex.com', keywords: ['fedex'] },
  { brand: 'DHL', canonical: 'dhl.com', keywords: ['dhl'] },
  { brand: 'IRS', canonical: 'irs.gov', keywords: ['irs'] },
  { brand: 'Coinbase', canonical: 'coinbase.com', keywords: ['coinbase'] },
  { brand: 'Venmo', canonical: 'venmo.com', keywords: ['venmo'] },
  { brand: 'Zelle', canonical: 'zellepay.com', keywords: ['zelle'] },
  { brand: 'WhatsApp', canonical: 'whatsapp.com', keywords: ['whatsapp'] },
  { brand: 'Facebook', canonical: 'facebook.com', keywords: ['facebook', 'meta'] },
  { brand: 'Instagram', canonical: 'instagram.com', keywords: ['instagram'] },
  { brand: 'Twitter/X', canonical: 'x.com', keywords: ['twitter'] },
];

const HOMOGLYPHS = {
  'a': ['а', 'ɑ', 'α'],  // Cyrillic а, Latin alpha, Greek alpha
  'e': ['е', 'ё', 'ε'],
  'o': ['о', 'ο', '0'],
  'p': ['р', 'ρ'],        // Cyrillic р, Greek rho
  'c': ['с', 'ϲ'],        // Cyrillic с
  'l': ['1', 'ⅼ', 'ı'],
  'i': ['і', 'ι', '1'],
  's': ['ѕ'],
  'n': ['ո', 'ñ'],
};

const SUSPICIOUS_TLDS = [
  '.zip', '.mov', '.click', '.top', '.xyz', '.info', '.club', '.work',
  '.support', '.site', '.online', '.shop', '.store', '.live', '.icu',
  '.buzz', '.best', '.rest', '.link', '.page', '.space'
];

const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd',
  'buff.ly', 'rebrand.ly', 'cutt.ly', 'shorturl.at', 'tiny.cc'
];

function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b[i - 1] === a[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[b.length][a.length];
}

function hasHomoglyphs(hostname) {
  for (let i = 0; i < hostname.length; i++) {
    const ch = hostname[i];
    for (const [, replacements] of Object.entries(HOMOGLYPHS)) {
      if (replacements.includes(ch)) {
        return true;
      }
    }
  }
  return false;
}

function normalizeHomoglyphs(hostname) {
  let normalized = hostname;
  for (const [ascii, replacements] of Object.entries(HOMOGLYPHS)) {
    for (const glyph of replacements) {
      normalized = normalized.split(glyph).join(ascii);
    }
  }
  return normalized;
}

function extractCoreDomain(hostname) {
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    return parts.slice(-2, -1)[0];
  }
  return hostname;
}

function getTld(hostname) {
  const lastDot = hostname.lastIndexOf('.');
  if (lastDot >= 0) return hostname.slice(lastDot);
  return '';
}

function analyzeHostname(hostname) {
  if (!hostname) return [];
  const host = hostname.toLowerCase().trim();
  const findings = [];

  // URL shortener
  if (URL_SHORTENERS.some((s) => host.includes(s))) {
    findings.push({
      type: 'url-shortener',
      label: 'URL shortener detected',
      weight: 12,
      evidence: host
    });
  }

  // Suspicious TLD
  const tld = getTld(host);
  if (SUSPICIOUS_TLDS.includes(tld)) {
    findings.push({
      type: 'suspicious-tld',
      label: `Risky top-level domain (${tld})`,
      weight: 10,
      evidence: host
    });
  }

  // Homoglyph
  if (hasHomoglyphs(host)) {
    findings.push({
      type: 'homoglyph',
      label: 'Homoglyph / lookalike characters detected',
      weight: 25,
      evidence: `Original: ${host}, Normalized: ${normalizeHomoglyphs(host)}`
    });
  }

  const normalized = normalizeHomoglyphs(host);
  const core = extractCoreDomain(normalized);

  for (const brand of BRAND_DOMAINS) {
    const brandCore = extractCoreDomain(brand.canonical);

    // Exact match on wrong TLD
    if (core === brandCore && host !== brand.canonical) {
      findings.push({
        type: 'typosquat',
        label: `${brand.brand} on non-official domain`,
        weight: 22,
        evidence: `${host} is not ${brand.canonical}`
      });
      continue;
    }

    // Close Levenshtein distance (1-2 edits from brand)
    const dist = levenshtein(core, brandCore);
    if (dist > 0 && dist <= 2 && core.length >= 4) {
      findings.push({
        type: 'typosquat',
        label: `Possible ${brand.brand} typosquat (edit distance ${dist})`,
        weight: 20,
        evidence: `"${core}" is ${dist} character(s) from "${brandCore}"`
      });
      continue;
    }

    // Combo-squat: brand name embedded in a longer domain
    for (const keyword of brand.keywords) {
      if (host.includes(keyword) && host !== brand.canonical && !host.endsWith('.' + brand.canonical)) {
        const comboWords = ['secure', 'login', 'verify', 'update', 'alert', 'support', 'help', 'center', 'account', 'billing', 'payment', 'confirm', 'restore', 'unlock'];
        if (comboWords.some((w) => host.includes(w)) || host.split(/[.-]/).length >= 3) {
          findings.push({
            type: 'combosquat',
            label: `Combo-squat using ${brand.brand} name`,
            weight: 18,
            evidence: `${host} embeds "${keyword}" with suspicious modifiers`
          });
        }
        break;
      }
    }
  }

  // IP address masquerading as domain
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
    findings.push({
      type: 'ip-address',
      label: 'Raw IP address instead of domain',
      weight: 15,
      evidence: host
    });
  }

  // Excessive subdomains
  const dotCount = (host.match(/\./g) || []).length;
  if (dotCount >= 4) {
    findings.push({
      type: 'subdomain-abuse',
      label: 'Excessive subdomain depth',
      weight: 8,
      evidence: `${dotCount} levels deep: ${host}`
    });
  }

  return findings;
}

module.exports = {
  analyzeHostname,
  levenshtein,
  hasHomoglyphs,
  normalizeHomoglyphs,
  BRAND_DOMAINS,
  SUSPICIOUS_TLDS,
  URL_SHORTENERS
};
