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
      verdict: "This is a phishing scam impersonating USPS.",
      signals: [
        {
          type: "domain",
          label: "Fake domain",
          detail:
            "usps-redelivery-update.com is not an official USPS domain. Real USPS links use usps.com.",
          severity: "critical",
        },
        {
          type: "pressure",
          label: "Urgency tactic",
          detail:
            '"Update within 24hrs or it will be returned" creates false urgency to bypass your judgment.',
          severity: "high",
        },
        {
          type: "impersonation",
          label: "Brand impersonation",
          detail:
            "Uses USPS name and fake tracking number format to appear legitimate.",
          severity: "high",
        },
        {
          type: "pattern",
          label: "Common scam template",
          detail:
            "Matches known package delivery phishing pattern seen in 340K+ reports this year.",
          severity: "medium",
        },
      ],
      explanation:
        "This SMS pretends to be from USPS but links to a fake domain designed to steal your personal information. Real USPS delivery notifications come from informed delivery or official USPS.com pages, never random domains. The 24-hour deadline is a pressure tactic to make you act without thinking.",
      nextSteps: [
        "Do not click the link",
        "Delete the message",
        "If expecting a package, check status directly at usps.com",
        "Report to USPS: forward to 7726 (SPAM)",
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
        'Website advertising "MacBook Pro M4 — 80% OFF! Only 3 left! AI-verified authentic seller. Pay with crypto for extra 10% discount."',
    },
    result: {
      riskScore: 88,
      riskLevel: "HIGH",
      verdict:
        "This is a fraudulent shopping site using AI-generated content to appear legitimate.",
      signals: [
        {
          type: "domain",
          label: "Suspicious domain",
          detail:
            "mega-ai-deals-store.shop registered 4 days ago. Legitimate retailers don't use freshly registered .shop domains.",
          severity: "critical",
        },
        {
          type: "pricing",
          label: "Impossible pricing",
          detail:
            "80% off a MacBook Pro ($2,499 MSRP) is not a real deal from any authorized reseller.",
          severity: "high",
        },
        {
          type: "pressure",
          label: "Scarcity tactic",
          detail:
            '"Only 3 left!" is a fake countdown designed to pressure immediate purchase.',
          severity: "high",
        },
        {
          type: "payment",
          label: "Crypto-only payment",
          detail:
            "Pushing cryptocurrency payment removes buyer protection and makes refunds impossible.",
          severity: "critical",
        },
        {
          type: "ai_generated",
          label: "AI-generated trust signals",
          detail:
            '"AI-verified authentic seller" is meaningless marketing language with no verification behind it.',
          severity: "medium",
        },
      ],
      explanation:
        "This site uses several classic e-commerce scam techniques amplified with AI-generated content. The domain was created days ago, the pricing is impossibly low, and pushing crypto payments ensures you have no way to recover your money. The 'AI-verified' badge is fabricated to exploit trust in AI technology.",
      nextSteps: [
        "Do not enter payment information",
        "Close the page",
        "Only buy Apple products from apple.com or authorized retailers",
        "Report the site: reportfraud.ftc.gov",
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
        "This is a credential-harvesting phishing page impersonating Chase Bank.",
      signals: [
        {
          type: "domain",
          label: "Phishing domain",
          detail:
            "chase-secure-verify.net is not Chase Bank. Real Chase login is at chase.com only.",
          severity: "critical",
        },
        {
          type: "impersonation",
          label: "Bank impersonation",
          detail:
            "Page copies Chase visual design, logo, and login form layout to steal credentials.",
          severity: "critical",
        },
        {
          type: "pressure",
          label: "Session expiry threat",
          detail:
            '"Session expires in 10 minutes" creates panic to make you enter credentials quickly.',
          severity: "high",
        },
        {
          type: "form",
          label: "Credential harvesting form",
          detail:
            "Login form submits to a non-Chase server. Any credentials entered will be stolen.",
          severity: "critical",
        },
        {
          type: "ssl",
          label: "Misleading security indicators",
          detail:
            "Site has an SSL certificate but this only means the connection is encrypted — not that the site is legitimate.",
          severity: "medium",
        },
      ],
      explanation:
        "This page is designed to steal your Chase bank login credentials. It copies Chase's visual appearance but is hosted on a completely different domain. The 'account limited' message and countdown timer are fabricated to create panic. If you entered any information, change your Chase password immediately from the real chase.com.",
      nextSteps: [
        "Do not enter any credentials",
        "Close the page immediately",
        "Go directly to chase.com to check your account",
        "If credentials were entered: call Chase at 1-800-935-9935 immediately",
        "Report: forward the URL to phishing@chase.com",
      ],
    },
  },
];

export const architectureNodes = [
  {
    id: "browserbase",
    name: "Browserbase",
    role: "Safe page inspection",
    description:
      "Opens suspicious URLs in an isolated cloud browser. Captures page structure, redirects, and form behavior without exposing the user's real browser or IP to the scam site.",
    color: "#6366f1",
    position: "left",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    role: "Grounded explanations",
    description:
      "Takes deterministic signal output and generates a plain-English explanation a non-technical person can understand. Also produces safe next-step recommendations grounded in the actual evidence.",
    color: "#d97706",
    position: "center",
  },
  {
    id: "redis",
    name: "Redis",
    role: "Case memory & receipts",
    description:
      "Stores evidence receipts, case records, and scam pattern signatures. Enables similar-scam retrieval so Sting can say 'we've seen 47 variants of this scam' with real data.",
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
      "Captures errors, performance issues, and edge cases in production. Ensures the scanning pipeline doesn't silently fail when encountering novel scam patterns.",
    color: "#362d59",
    position: "center",
  },
  {
    id: "fetch",
    name: "Fetch.ai",
    role: "Agent coordination",
    description:
      "Enables autonomous agent-to-agent communication for distributed scam investigation — one agent inspects the page, another checks domain reputation, another generates the receipt.",
    color: "#1e3a5f",
    position: "right",
  },
];
