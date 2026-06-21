export const voiceDemoCases = [
  {
    id: "hostage-ransom",
    title: "Fake Kidnapping / Ransom Call",
    type: "Phone Call",
    duration: "1:42",
    language: "English",
    input: {
      source: "Incoming call from Unknown Number",
      content:
        "We have your son. Do not call the police. Wire the money to this bitcoin wallet or he will be harmed. You have one hour. Send the ransom now.",
    },
    transcription: [
      { time: 0, text: "We have your son." },
      { time: 2.1, text: "Do not call the police." },
      { time: 4.5, text: "Wire the money to this bitcoin wallet" },
      { time: 7.2, text: "or he will be harmed." },
      { time: 9.8, text: "You have one hour." },
      { time: 11.5, text: "Send the ransom now." },
    ],
    result: {
      riskScore: 100,
      riskLevel: "CRITICAL",
      verdict: "This is a fake kidnapping scam. Your family member is safe.",
      signals: [
        {
          type: "ransom",
          label: "Ransom demand",
          detail:
            "Demands immediate payment with threats of harm. Real kidnappers extremely rarely call victims' families — this is a known phone scam pattern.",
          severity: "critical",
        },
        {
          type: "payment",
          label: "Cryptocurrency demand",
          detail:
            "Bitcoin payment requested — untraceable and non-refundable. Legitimate situations never require crypto.",
          severity: "critical",
        },
        {
          type: "pressure",
          label: "Extreme time pressure",
          detail:
            '"One hour" deadline prevents you from verifying the claim or calling your family member.',
          severity: "high",
        },
        {
          type: "isolation",
          label: "Isolation tactic",
          detail:
            '"Do not call the police" is designed to keep you from getting help or verifying the scam.',
          severity: "high",
        },
      ],
      explanation:
        "This is a virtual kidnapping scam. The caller does NOT have your family member. They use fear and urgency to make you pay before you can verify everyone is safe. Hang up and call your family member directly — they will answer.",
      nextSteps: [
        "HANG UP immediately",
        "Call your family member directly — they are safe",
        "Call 911 if you cannot reach them",
        "Report to FBI IC3: ic3.gov",
        "Never send money to unknown callers",
      ],
    },
  },
  {
    id: "bank-robocall",
    title: "Bank Fraud Department Robocall",
    type: "Phone Call",
    duration: "0:38",
    language: "English",
    input: {
      source: "Incoming call showing 'Bank of America'",
      content:
        "This is the fraud department at Bank of America. Your account has been compromised. Press 1 to speak with a security specialist. Have your account number and social security number ready for verification.",
    },
    transcription: [
      { time: 0, text: "This is the fraud department" },
      { time: 1.8, text: "at Bank of America." },
      { time: 3.5, text: "Your account has been compromised." },
      { time: 5.9, text: "Press 1 to speak with a security specialist." },
      { time: 8.4, text: "Have your account number" },
      { time: 10.1, text: "and social security number ready for verification." },
    ],
    result: {
      riskScore: 94,
      riskLevel: "CRITICAL",
      verdict: "This is a bank impersonation robocall trying to steal your information.",
      signals: [
        {
          type: "impersonation",
          label: "Bank impersonation",
          detail:
            "Real banks NEVER ask for your full SSN or account number over the phone. They already have it.",
          severity: "critical",
        },
        {
          type: "credential",
          label: "Credential harvesting",
          detail:
            "Asking for account number + SSN together gives scammers everything needed to drain your account.",
          severity: "critical",
        },
        {
          type: "pressure",
          label: "Urgency tactic",
          detail:
            '"Your account has been compromised" creates panic so you act before thinking.',
          severity: "high",
        },
        {
          type: "robocall",
          label: "Automated call pattern",
          detail:
            "Legitimate bank fraud calls are made by humans, not automated systems asking you to press buttons.",
          severity: "medium",
        },
      ],
      explanation:
        "Your bank will NEVER call you and ask for your Social Security number or full account number — they already have that information. This robocall is designed to collect your credentials. If you're worried about your account, hang up and call the number on the back of your debit card.",
      nextSteps: [
        "HANG UP — do not press any buttons",
        "Call the number on the BACK of your bank card",
        "Never give SSN or account numbers to incoming callers",
        "Report to FTC: donotcall.gov",
      ],
    },
  },
  {
    id: "chinese-embassy",
    title: "Chinese Embassy Impersonation",
    type: "Phone Call",
    duration: "2:15",
    language: "Mandarin (Chinese)",
    input: {
      source: "Call from +86 area code (spoofed)",
      content:
        "\u60a8\u597d\uff0c\u8fd9\u91cc\u662f\u4e2d\u56fd\u5927\u4f7f\u9986\u3002\u60a8\u6709\u4e00\u4e2a\u5305\u88f9\u6d89\u5acc\u72af\u7f6a\uff0c\u8b66\u5bdf\u5df2\u53d1\u51fa\u902e\u6355\u4ee4\u3002\u8bf7\u914d\u5408\u8c03\u67e5\uff0c\u5c06\u60a8\u7684\u8d44\u91d1\u8f6c\u5165\u5b89\u5168\u8d26\u6237\u4ee5\u8bc1\u660e\u6e05\u767d\u3002",
    },
    transcription: [
      { time: 0, text: "\u60a8\u597d\uff0c\u8fd9\u91cc\u662f\u4e2d\u56fd\u5927\u4f7f\u9986\u3002" },
      { time: 2.5, text: "\u60a8\u6709\u4e00\u4e2a\u5305\u88f9\u6d89\u5acc\u72af\u7f6a\uff0c" },
      { time: 5.0, text: "\u8b66\u5bdf\u5df2\u53d1\u51fa\u902e\u6355\u4ee4\u3002" },
      { time: 7.8, text: "\u8bf7\u914d\u5408\u8c03\u67e5\uff0c" },
      { time: 9.5, text: "\u5c06\u60a8\u7684\u8d44\u91d1\u8f6c\u5165\u5b89\u5168\u8d26\u6237" },
      { time: 12.0, text: "\u4ee5\u8bc1\u660e\u6e05\u767d\u3002" },
    ],
    result: {
      riskScore: 96,
      riskLevel: "CRITICAL",
      verdict: "This is a Chinese embassy impersonation scam targeting Chinese-speaking communities.",
      signals: [
        {
          type: "impersonation",
          label: "Embassy impersonation",
          detail:
            "Real embassies NEVER call about criminal matters or ask for money transfers. This is a known scam targeting Chinese diaspora.",
          severity: "critical",
        },
        {
          type: "authority",
          label: "Fake arrest warrant",
          detail:
            "Claims of arrest warrants over the phone are always scams. Real warrants are served in person.",
          severity: "critical",
        },
        {
          type: "payment",
          label: "'Safety account' transfer",
          detail:
            "There is no such thing as a \"safety account.\" This is a common ploy to get victims to wire money to scammers.",
          severity: "critical",
        },
        {
          type: "language",
          label: "Language-targeted scam",
          detail:
            "Specifically targets Mandarin speakers who may be less familiar with local law enforcement procedures.",
          severity: "high",
        },
      ],
      explanation:
        "This is a well-known scam that has stolen millions from Chinese-speaking communities worldwide. The Chinese Embassy will NEVER call you about packages, criminal investigations, or ask you to transfer money. Hang up immediately.",
      nextSteps: [
        "HANG UP immediately",
        "The embassy will NEVER ask for money transfers",
        "Call your local police non-emergency line if worried",
        "Warn family members — this scam targets elderly Chinese speakers",
        "Report to FTC: reportfraud.ftc.gov",
      ],
    },
  },
];

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
    id: "deepgram",
    name: "Deepgram",
    role: "Voice transcription & detection",
    description:
      "Transcribes suspicious phone calls in real time using Nova-3. Detects language automatically (English, Mandarin, Spanish, etc.), provides word-level timestamps and speaker diarization so we can analyze exactly when pressure tactics are used.",
    color: "#13ef93",
    position: "left",
  },
  {
    id: "browserbase",
    name: "Browserbase",
    role: "Isolated threat inspection",
    description:
      "Detonates suspicious URLs in a sandboxed cloud browser. Captures page structure, redirects, and form behavior without exposing your real browser or IP to the attacker.",
    color: "#6366f1",
    position: "center",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    role: "Verdict engine",
    description:
      "Takes deterministic signal output and generates a plain-English conviction anyone can understand. Produces actionable counter-strike recommendations grounded in the evidence.",
    color: "#d97706",
    position: "right",
  },
  {
    id: "redis",
    name: "Redis",
    role: "Threat memory & dossiers",
    description:
      "Stores evidence dossiers, case records, and attack pattern signatures. Enables pattern matching so STING can recognize repeat scam domains and warn future visitors.",
    color: "#dc2626",
    position: "left",
  },
  {
    id: "arize",
    name: "Arize / Phoenix",
    role: "Trace & eval observability",
    description:
      "Traces every AI verdict through the pipeline. Logs input signals, model reasoning, and output quality so we can prove the system is improving and catch regressions.",
    color: "#8b5cf6",
    position: "center",
  },
  {
    id: "sentry",
    name: "Sentry",
    role: "Reliability monitoring",
    description:
      "Captures errors, performance issues, and edge cases in production. Ensures the detection pipeline never silently fails when encountering novel attack patterns.",
    color: "#362d59",
    position: "right",
  },
  {
    id: "fetch",
    name: "Fetch.ai",
    role: "Agent coordination",
    description:
      "Enables autonomous agent-to-agent communication for distributed threat investigation \u2014 one agent inspects the page, another checks domain reputation, another compiles the dossier.",
    color: "#1e3a5f",
    position: "left",
  },
];
