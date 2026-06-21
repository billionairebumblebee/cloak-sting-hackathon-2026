/**
 * Voice scam pattern library for cloak STING.
 *
 * Structured patterns for categorizing phone scam transcripts
 * into known attack families with specific counter-advice.
 */

const VOICE_SCAM_PATTERNS = [
  {
    id: 'irs-tax',
    name: 'IRS / Tax Authority Scam',
    keywords: ['irs', 'tax', 'audit', 'refund', 'tax lien', 'back taxes', 'tax fraud', 'treasury', 'revenue service'],
    phrases: [
      'irs has filed a lawsuit',
      'arrest warrant for tax evasion',
      'pay your back taxes',
      'tax fraud investigation',
      'final notice from the irs',
      'your social security number has been suspended',
      'agents will be dispatched'
    ],
    riskLevel: 'critical',
    category: 'government-impersonation',
    counterAdvice: [
      'The IRS NEVER calls to demand immediate payment or threaten arrest.',
      'The IRS sends official letters by mail first — always.',
      'Hang up immediately. If worried, call IRS directly at 1-800-829-1040.',
      'Report to TIGTA: treasury.gov/tigta'
    ]
  },
  {
    id: 'tech-support',
    name: 'Tech Support Scam',
    keywords: ['microsoft', 'windows', 'apple', 'virus', 'malware', 'hacked', 'firewall', 'remote access', 'teamviewer', 'anydesk'],
    phrases: [
      'your computer has been compromised',
      'we detected a virus on your system',
      'give me remote access',
      'download this software',
      'your ip address has been flagged',
      'windows defender has been disabled',
      'your firewall has been breached'
    ],
    riskLevel: 'high',
    category: 'tech-support-fraud',
    counterAdvice: [
      'Microsoft, Apple, and Google NEVER call you about viruses.',
      'NEVER give remote access to someone who called you.',
      'Hang up. Run your own antivirus scan if concerned.',
      'Report to FTC: reportfraud.ftc.gov'
    ]
  },
  {
    id: 'romance',
    name: 'Romance / Relationship Scam',
    keywords: ['darling', 'sweetheart', 'my love', 'stuck overseas', 'hospital', 'stranded', 'plane ticket', 'surgery', 'inheritance'],
    phrases: [
      'i need money for a plane ticket',
      'i am stuck overseas',
      'my accounts are frozen',
      'i need surgery',
      'send money through',
      'i want to come see you',
      'do not tell your family',
      'our special connection'
    ],
    riskLevel: 'high',
    category: 'romance-fraud',
    counterAdvice: [
      'Real partners do not ask for money before meeting in person.',
      'NEVER send money to someone you have not met face-to-face.',
      'Tell a trusted friend or family member about this relationship.',
      'Report to FBI IC3: ic3.gov'
    ]
  },
  {
    id: 'crypto-investment',
    name: 'Crypto / Investment Scam',
    keywords: ['guaranteed returns', 'bitcoin', 'ethereum', 'trading algorithm', 'investment opportunity', 'passive income', 'yield', 'mining pool'],
    phrases: [
      'guaranteed returns of',
      'double your bitcoin',
      'exclusive investment opportunity',
      'send your crypto to this wallet',
      'risk-free investment',
      'our ai trading bot',
      'act now before this closes',
      'limited spots available'
    ],
    riskLevel: 'high',
    category: 'investment-fraud',
    counterAdvice: [
      'NO legitimate investment guarantees returns — that is illegal to promise.',
      'NEVER send crypto to someone promising to multiply it.',
      'Verify any investment with SEC: sec.gov/check-your-investment',
      'Report to FTC: reportfraud.ftc.gov'
    ]
  },
  {
    id: 'kidnapping-ransom',
    name: 'Virtual Kidnapping / Ransom',
    keywords: ['kidnap', 'ransom', 'hostage', 'your son', 'your daughter', 'your child', 'we have', 'harm', 'police'],
    phrases: [
      'we have your',
      'do not call the police',
      'wire the money',
      'pay the ransom',
      'your child will be harmed',
      'you have one hour',
      'unmarked bills'
    ],
    riskLevel: 'critical',
    category: 'extortion',
    counterAdvice: [
      'HANG UP. Your family member is almost certainly safe.',
      'Call your family member directly on their known number.',
      'Call 911 if you cannot reach them.',
      'Real kidnappings do not involve calls demanding wire transfers.',
      'Report to FBI: tips.fbi.gov'
    ]
  },
  {
    id: 'utility-shutoff',
    name: 'Utility / Power Shutoff Scam',
    keywords: ['electric', 'power', 'gas', 'utility', 'disconnect', 'shutoff', 'final payment', 'overdue bill'],
    phrases: [
      'your power will be shut off',
      'final notice before disconnection',
      'pay immediately to avoid shutoff',
      'call this number with your payment',
      'your account is severely overdue'
    ],
    riskLevel: 'high',
    category: 'utility-fraud',
    counterAdvice: [
      'Utility companies do not demand immediate payment by phone with threats of same-day shutoff.',
      'Call the number on your actual utility bill to verify.',
      'Real disconnection notices come by mail with advance warning.',
      'Report to your state utility commission.'
    ]
  },
  {
    id: 'grandparent',
    name: 'Grandparent / Emergency Scam',
    keywords: ['grandma', 'grandpa', 'grandchild', 'accident', 'jail', 'bail', 'lawyer', 'emergency'],
    phrases: [
      'grandma it is me',
      'i have been arrested',
      'i need bail money',
      'please do not tell mom and dad',
      'my lawyer says',
      'i was in an accident',
      'i need you to send money right away'
    ],
    riskLevel: 'critical',
    category: 'impersonation',
    counterAdvice: [
      'HANG UP and call your grandchild on their real phone number.',
      'Ask a personal question only the real person would know.',
      'Scammers use AI voice cloning — the voice may sound real but is fake.',
      'Tell a family member before sending any money.',
      'Report to FTC: reportfraud.ftc.gov'
    ]
  },
  {
    id: 'lottery-prize',
    name: 'Lottery / Prize Scam',
    keywords: ['lottery', 'prize', 'winner', 'sweepstakes', 'million', 'jackpot', 'claim your prize', 'processing fee'],
    phrases: [
      'you have won',
      'claim your prize',
      'pay a processing fee',
      'send the tax payment',
      'your lottery winnings',
      'you were selected',
      'wire the handling fee'
    ],
    riskLevel: 'high',
    category: 'advance-fee-fraud',
    counterAdvice: [
      'You cannot win a lottery you did not enter.',
      'Legitimate lotteries NEVER require upfront fees to collect winnings.',
      'NEVER send money to collect a prize — that is always a scam.',
      'Report to FTC: reportfraud.ftc.gov'
    ]
  }
];

function matchVoicePattern(transcript) {
  const text = String(transcript || '').toLowerCase();
  const matches = [];

  for (const pattern of VOICE_SCAM_PATTERNS) {
    let score = 0;
    const matched = { keywords: [], phrases: [] };

    for (const keyword of pattern.keywords) {
      if (text.includes(keyword)) {
        score += 5;
        matched.keywords.push(keyword);
      }
    }
    for (const phrase of pattern.phrases) {
      if (text.includes(phrase)) {
        score += 15;
        matched.phrases.push(phrase);
      }
    }

    if (score >= 10) {
      matches.push({
        pattern: pattern.id,
        name: pattern.name,
        score,
        riskLevel: pattern.riskLevel,
        category: pattern.category,
        counterAdvice: pattern.counterAdvice,
        evidence: matched
      });
    }
  }

  matches.sort((a, b) => b.score - a.score);
  return matches;
}

module.exports = { matchVoicePattern, VOICE_SCAM_PATTERNS };
