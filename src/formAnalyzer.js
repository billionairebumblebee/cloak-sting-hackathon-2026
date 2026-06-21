/**
 * Form / input field analyzer for sting.
 *
 * Detects credential-harvesting forms by examining the combination
 * and density of sensitive input fields on a page.
 */

const SENSITIVE_PATTERNS = [
  { pattern: /ssn|social.?security/i, label: 'Social Security Number field', weight: 20, category: 'identity' },
  { pattern: /passport/i, label: 'Passport number field', weight: 18, category: 'identity' },
  { pattern: /driver.?licen[sc]e/i, label: 'Driver license field', weight: 16, category: 'identity' },
  { pattern: /date.?of.?birth|dob|birthday/i, label: 'Date of birth field', weight: 10, category: 'identity' },
  { pattern: /credit.?card|card.?number|cc.?num/i, label: 'Credit card number field', weight: 18, category: 'financial' },
  { pattern: /cvv|cvc|security.?code/i, label: 'Card security code field', weight: 18, category: 'financial' },
  { pattern: /expir|exp.?date/i, label: 'Card expiration field', weight: 12, category: 'financial' },
  { pattern: /routing.?number/i, label: 'Bank routing number field', weight: 16, category: 'financial' },
  { pattern: /account.?number/i, label: 'Bank account number field', weight: 14, category: 'financial' },
  { pattern: /pin\b|personal.?identification/i, label: 'PIN field', weight: 16, category: 'credential' },
  { pattern: /mother.?maiden|maiden.?name/i, label: 'Security question (maiden name)', weight: 14, category: 'identity' },
  { pattern: /one.?time|otp|verification.?code|2fa|mfa/i, label: 'One-time / MFA code field', weight: 16, category: 'credential' },
  { pattern: /seed.?phrase|recovery.?phrase|mnemonic/i, label: 'Crypto seed phrase field', weight: 22, category: 'crypto' },
  { pattern: /private.?key|wallet.?key/i, label: 'Crypto private key field', weight: 22, category: 'crypto' },
];

function analyzeFormInputs(inputDescriptions) {
  if (!Array.isArray(inputDescriptions)) return { findings: [], riskFactors: [] };

  const findings = [];
  const categories = new Set();

  for (const desc of inputDescriptions) {
    const text = String(desc || '').toLowerCase();
    for (const rule of SENSITIVE_PATTERNS) {
      if (rule.pattern.test(text)) {
        findings.push({
          type: 'form-field',
          label: rule.label,
          weight: rule.weight,
          evidence: text.slice(0, 100),
          category: rule.category
        });
        categories.add(rule.category);
      }
    }
  }

  const riskFactors = [];

  if (categories.has('financial') && categories.has('identity')) {
    riskFactors.push({
      type: 'form-combo',
      label: 'Financial + identity data requested together',
      weight: 15,
      evidence: `Categories: ${[...categories].join(', ')}`
    });
  }

  if (categories.has('crypto')) {
    riskFactors.push({
      type: 'form-crypto',
      label: 'Crypto credentials requested — likely wallet drain',
      weight: 20,
      evidence: 'Seed phrase or private key requested'
    });
  }

  if (findings.length >= 4) {
    riskFactors.push({
      type: 'form-excessive',
      label: 'Excessive sensitive data collection',
      weight: 12,
      evidence: `${findings.length} sensitive fields detected`
    });
  }

  return { findings, riskFactors };
}

function extractInputLabels(pageText) {
  const lines = String(pageText || '').split(/\n/).map((l) => l.trim()).filter(Boolean);
  return lines.filter((line) => {
    const lower = line.toLowerCase();
    return SENSITIVE_PATTERNS.some((p) => p.pattern.test(lower));
  });
}

module.exports = { analyzeFormInputs, extractInputLabels, SENSITIVE_PATTERNS };
