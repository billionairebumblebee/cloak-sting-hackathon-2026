export const demoCases = [
  {
    id: "sms-delivery",
    title: "Fake Package Delivery SMS",
    type: "SMS",
    input: {
      source: "SMS from +1-555-0199",
      content:
        "USPS: Your package #US9482710 has a delivery issue. Update your address within 24hrs or it will be returned. Click here: usps-redelivery-update.com/track",
    },
    result: {
      riskScore: 92,
      riskLevel: "HIGH",
      verdict: "Confirmed phishing attack impersonating USPS. This link is a trap.",
      signals: [
        {
          type: "domain",
          label: "Fraudulent domain",
          detail:
            "usps-redelivery-update.com is not USPS. Real USPS links use usps.com only. This domain exists to steal your data.",
          severity: "critical",
        },
        {
          type: "pressure",
          label: "Weaponized urgency",
          detail:
            '"Update within 24hrs or it will be returned" \u2014 a manufactured deadline designed to bypass your judgment.',
          severity: "high",
        },
        {
          type: "impersonation",
          label: "Brand impersonation",
          detail:
            "Hijacks USPS branding and uses a fake tracking number format to manufacture legitimacy.",
          severity: "high",
        },
        {
          type: "pattern",
          label: "Known attack template",
          detail:
            "Matches a documented package delivery phishing pattern flagged in 340K+ reports this year.",
          severity: "medium",
        },
      ],
      explanation:
        "This SMS is a phishing attack. It impersonates USPS but routes to a fraudulent domain built to harvest your personal information. Real USPS notifications come through Informed Delivery or official USPS.com pages \u2014 never random domains. The 24-hour deadline is a pressure weapon to force you into acting before thinking.",
      nextSteps: [
        "Do NOT click the link \u2014 it leads to a credential trap",
        "Delete the message immediately",
        "Check your real package status directly at usps.com",
        "Fight back: forward this to 7726 (SPAM) to report the attacker",
      ],
    },
  },
  {
    id: "fake-store",
    title: "Fake AI Shopping Deal Page",
    type: "Website",
    input: {
      source: "URL: mega-ai-deals-store.shop/macbook-pro",
      content:
        'Website advertising "MacBook Pro M4 \u2014 80% OFF! Only 3 left! AI-verified authentic seller. Pay with crypto for extra 10% discount."',
    },
    result: {
      riskScore: 88,
      riskLevel: "HIGH",
      verdict:
        "Fraudulent storefront using AI-generated content as bait. Zero chance this is legitimate.",
      signals: [
        {
          type: "domain",
          label: "Disposable domain",
          detail:
            "mega-ai-deals-store.shop was registered 4 days ago. Legitimate retailers don't operate on throwaway domains.",
          severity: "critical",
        },
        {
          type: "pricing",
          label: "Impossible pricing",
          detail:
            "80% off a MacBook Pro ($2,499 MSRP) doesn\u2019t exist from any authorized reseller. This is bait.",
          severity: "high",
        },
        {
          type: "pressure",
          label: "Fake scarcity",
          detail:
            '"Only 3 left!" is a fabricated countdown engineered to pressure immediate payment.',
          severity: "high",
        },
        {
          type: "payment",
          label: "Irrecoverable payment method",
          detail:
            "Pushing cryptocurrency payment eliminates all buyer protection. Your money is gone the moment you send it.",
          severity: "critical",
        },
        {
          type: "ai_generated",
          label: "Fabricated trust signals",
          detail:
            '"AI-verified authentic seller" is meaningless \u2014 a made-up badge with zero verification behind it.',
          severity: "medium",
        },
      ],
      explanation:
        "This is a scam storefront weaponizing AI-generated content to look trustworthy. The domain is days old, the pricing is impossible, and crypto-only payment ensures you have zero recourse. The 'AI-verified' badge is completely fabricated to exploit trust in AI technology. You would receive nothing.",
      nextSteps: [
        "Do NOT enter any payment information",
        "Close the page \u2014 do not interact further",
        "Only buy Apple products from apple.com or authorized retailers",
        "Report this fraud: submit at reportfraud.ftc.gov to help take it down",
      ],
    },
  },
  {
    id: "bank-login",
    title: "Fake Bank Login / Support Page",
    type: "Website",
    input: {
      source: "URL: chase-secure-verify.net/login",
      content:
        'Page mimicking Chase bank login with banner: "Your account has been temporarily limited. Verify your identity to restore access. Session expires in 10 minutes."',
    },
    result: {
      riskScore: 96,
      riskLevel: "CRITICAL",
      verdict:
        "Credential-harvesting attack. This page exists solely to steal your bank login.",
      signals: [
        {
          type: "domain",
          label: "Phishing domain",
          detail:
            "chase-secure-verify.net is NOT Chase Bank. The real Chase login lives at chase.com \u2014 nowhere else.",
          severity: "critical",
        },
        {
          type: "impersonation",
          label: "Bank impersonation",
          detail:
            "Stolen Chase visual design, logo, and login form layout \u2014 all built to hijack your credentials.",
          severity: "critical",
        },
        {
          type: "pressure",
          label: "Panic trigger",
          detail:
            '"Session expires in 10 minutes" is a fabricated timer designed to create panic and override caution.',
          severity: "high",
        },
        {
          type: "form",
          label: "Credential harvesting",
          detail:
            "This login form submits to an attacker-controlled server. Any credentials entered are immediately stolen.",
          severity: "critical",
        },
        {
          type: "ssl",
          label: "Misleading security theater",
          detail:
            "The SSL padlock means the connection is encrypted \u2014 it does NOT mean the site is legitimate. Scammers get certificates too.",
          severity: "medium",
        },
      ],
      explanation:
        "This is a credential-harvesting operation. The page replicates Chase\u2019s appearance but is hosted on an attacker-controlled domain. The 'account limited' message and countdown timer are fabricated weapons to create panic. If you entered any information, your credentials are already compromised \u2014 act immediately.",
      nextSteps: [
        "Do NOT enter any credentials \u2014 close the page now",
        "If you already entered info: call Chase at 1-800-935-9935 IMMEDIATELY",
        "Go directly to chase.com to verify your account status",
        "Change your Chase password from the real site right now",
        "Strike back: forward the URL to phishing@chase.com to help shut it down",
      ],
    },
  },
];

export const scammerBlacklist = [
  {
    type: "domain",
    value: "secure-bank-verify-account-login.example",
    firstSeen: "2025-12-03",
    reportCount: 1247,
    riskLevel: "critical",
    associatedScamType: "phishing",
  },
  {
    type: "domain",
    value: "usps-redelivery-update.com",
    firstSeen: "2026-01-15",
    reportCount: 892,
    riskLevel: "high",
    associatedScamType: "impersonation",
  },
  {
    type: "domain",
    value: "amazn-prime-deals.shop",
    firstSeen: "2026-02-22",
    reportCount: 634,
    riskLevel: "high",
    associatedScamType: "fake-store",
  },
  {
    type: "domain",
    value: "chase-secure-verify.net",
    firstSeen: "2026-03-08",
    reportCount: 1583,
    riskLevel: "critical",
    associatedScamType: "phishing",
  },
  {
    type: "domain",
    value: "irs-refund-status-check.org",
    firstSeen: "2026-04-01",
    reportCount: 2104,
    riskLevel: "critical",
    associatedScamType: "impersonation",
  },
  {
    type: "email",
    value: "support@apple-id-verify.com",
    firstSeen: "2026-01-28",
    reportCount: 467,
    riskLevel: "high",
    associatedScamType: "phishing",
  },
  {
    type: "email",
    value: "noreply@fedex-tracking-update.info",
    firstSeen: "2026-03-14",
    reportCount: 319,
    riskLevel: "medium",
    associatedScamType: "impersonation",
  },
  {
    type: "email",
    value: "security@paypa1-alerts.net",
    firstSeen: "2026-02-09",
    reportCount: 751,
    riskLevel: "high",
    associatedScamType: "phishing",
  },
  {
    type: "email",
    value: "admin@microsoft-365-verify.com",
    firstSeen: "2026-05-02",
    reportCount: 283,
    riskLevel: "medium",
    associatedScamType: "phishing",
  },
  {
    type: "phone",
    value: "+1-555-0***",
    firstSeen: "2026-04-17",
    reportCount: 156,
    riskLevel: "medium",
    associatedScamType: "vishing",
  },
  {
    type: "phone",
    value: "+1-800-***-9935",
    firstSeen: "2026-03-22",
    reportCount: 412,
    riskLevel: "high",
    associatedScamType: "impersonation",
  },
  {
    type: "phone",
    value: "+1-888-***-4421",
    firstSeen: "2026-05-11",
    reportCount: 89,
    riskLevel: "medium",
    associatedScamType: "vishing",
  },
  {
    type: "domain",
    value: "netflix-billing-update.support",
    firstSeen: "2026-05-29",
    reportCount: 203,
    riskLevel: "medium",
    associatedScamType: "phishing",
  },
];

export const architectureNodes = [
  {
    id: "browserbase",
    name: "Browserbase",
    role: "Isolated threat inspection",
    description:
      "Detonates suspicious URLs in a sandboxed cloud browser. Captures page structure, redirects, and form behavior without exposing your real browser or IP to the attacker.",
    color: "#6366f1",
    position: "left",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    role: "Verdict engine",
    description:
      "Takes deterministic signal output and generates a plain-English conviction anyone can understand. Produces actionable counter-strike recommendations grounded in the evidence.",
    color: "#d97706",
    position: "center",
  },
  {
    id: "redis",
    name: "Redis",
    role: "Threat memory & dossiers",
    description:
      "Stores evidence dossiers, case records, and attack pattern signatures. Enables pattern matching so Sting can say 'we\u2019ve convicted 47 variants of this attack' with real data.",
    color: "#dc2626",
    position: "right",
  },
  {
    id: "arize",
    name: "Arize / Phoenix",
    role: "Trace & eval observability",
    description:
      "Traces every AI verdict through the pipeline. Logs input signals, model reasoning, and output quality so we can prove the system is improving and catch regressions.",
    color: "#8b5cf6",
    position: "left",
  },
  {
    id: "sentry",
    name: "Sentry",
    role: "Reliability monitoring",
    description:
      "Captures errors, performance issues, and edge cases in production. Ensures the detection pipeline never silently fails when encountering novel attack patterns.",
    color: "#362d59",
    position: "center",
  },
  {
    id: "fetch",
    name: "Fetch.ai",
    role: "Agent coordination",
    description:
      "Enables autonomous agent-to-agent communication for distributed threat investigation \u2014 one agent inspects the page, another checks domain reputation, another compiles the dossier.",
    color: "#1e3a5f",
    position: "right",
  },
];
