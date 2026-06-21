export const arsenalSponsors = [
  {
    slug: "deepgram",
    name: "Deepgram",
    color: "#13ef93",
    status: "FALLBACK",
    tagline: "Voice scam detection — the critical unlock for phone-based fraud",
    role: "Voice Intelligence",
    whatItDoes:
      "Suspicious voicemail/call audio → Deepgram Nova-3 speech-to-text → local voice scam pattern detector → evidence dossier. Expands scam defense beyond web pages into voice scams: fake grandchild ransom, bank OTP calls, Chinese embassy scams, tech support calls.",
    codePaths: [
      "src/deepgramSTT.js",
      "src/deepgramTranscribe.js",
      "src/voiceScamPipeline.js",
      "src/voicePatterns.js",
      "scripts/voice_scam_demo.js",
      "scripts/transcribe_voice_demo.js",
    ],
    demoCommand: "node scripts/voice_scam_demo.js",
    liveStatus: "With DEEPGRAM_API_KEY: live real-time transcription via Nova-3.",
    fallbackStatus:
      "Without key: fixture transcript/audio fallback. Demo uses pre-recorded scam call fixtures (bank robocall, Chinese embassy, hostage ransom) to demonstrate the full voice pipeline.",
    whyDeservesPrize:
      "cloak sting expands scam defense beyond web pages into voice scams, where Deepgram is the critical unlock. We use transcription to catch pressure tactics, ransom language, urgency, secrecy, OTP requests, and multilingual scam patterns before a victim acts. Not a novelty — voice is where the most harmful scams live.",
    doNotClaim: [
      "Do not say live STT works without a Deepgram API key",
      "Do not imply the extension itself does real-time call recording",
      "Voice pipeline is Node-only — not in the browser extension runtime",
    ],
  },
  {
    slug: "anthropic",
    name: "Anthropic",
    color: "#d97706",
    status: "FALLBACK",
    tagline: "Plain-English safety explanations — Claude as translator, not detector",
    role: "Explanation Layer",
    whatItDoes:
      "Deterministic detector finds facts. Claude turns those facts into calm plain-English explanations and safe next steps. Important: Claude is NOT the detector. It is the explanation layer over verified evidence.",
    codePaths: [
      "src/anthropicExplain.js",
      "scripts/explain_case_demo.js",
      "src/arizeEvalCriteria.js",
    ],
    demoCommand: "node scripts/explain_case_demo.js",
    liveStatus: "With ANTHROPIC_API_KEY: Claude generates grounded explanations from case data.",
    fallbackStatus:
      "Without key: deterministic local template engine produces the same explanation structure from case findings. Same format, same safety — just less nuanced language.",
    whyDeservesPrize:
      "This is exactly where LLMs are useful in safety: not 'magic scam detector,' but human-readable reasoning over verified signals. Grandma doesn't need raw heuristics; she needs: 'pause, don't enter this, verify through the real bank app.' Claude as a safety translator — grounded, evaluated, never hallucinating accusations.",
    doNotClaim: [
      "Do not say Claude is the scam detector — it is the explainer",
      "Do not imply AI detection requires Anthropic",
      "The deterministic engine works fully without any LLM",
    ],
  },
  {
    slug: "browserbase",
    name: "Browserbase",
    color: "#6366f1",
    status: "SEAM",
    tagline: "The bomb squad robot for suspicious links",
    role: "Isolated Link Inspection",
    whatItDoes:
      "Suspicious URL is opened in a remote/sandboxed Browserbase browser. The user's real browser/device/IP never touches the scam site. Evidence comes back as page title, text content, form behavior, and redirect chains.",
    codePaths: ["src/browserbaseInspect.js", "scripts/inspect_link_demo.js"],
    demoCommand: "node scripts/inspect_link_demo.js",
    liveStatus: "With BROWSERBASE_API_KEY + BROWSERBASE_PROJECT_ID: creates isolated browser session.",
    fallbackStatus:
      "Without keys: local DOM/fetch-based evidence path. The isolation seam is fully wired — add a key and remote inspection activates immediately.",
    whyDeservesPrize:
      "Browserbase is not bolted on. It is the natural 'bomb squad robot' for suspicious links: send the dangerous page into an isolated browser, extract evidence, then protect the user. No user IP exposed, no local browser at risk.",
    doNotClaim: [
      "Do not say live Browserbase inspection works without API key",
      "Do not imply every link scan currently uses Browserbase",
      "The extension's page scanning is local DOM analysis — Browserbase is for link detonation",
    ],
  },
  {
    slug: "redis",
    name: "Redis",
    color: "#dc2626",
    status: "FALLBACK",
    tagline: "Scam memory — one person's warning becomes everyone's protection",
    role: "Threat Memory",
    whatItDoes:
      "Stores scam cases, evidence records, and attack signatures. Lets cloak sting remember repeat domains/patterns. Local fallback uses JSON, Redis path uses cloud persistence via Upstash or native Redis client.",
    codePaths: [
      "src/caseStore.js",
      "scripts/save_case_demo.js",
      "src/dossier.js",
      "src/threatExport.js",
    ],
    demoCommand: "node scripts/save_case_demo.js",
    liveStatus: "With REDIS_URL or UPSTASH_REDIS_REST_URL: cloud persistence.",
    fallbackStatus:
      "Without Redis env: local JSON fallback. Demo runs entirely on local JSON without any Redis endpoint. Zero-config, zero-network.",
    whyDeservesPrize:
      "Redis becomes scam memory. A warning is useful once; a saved case database becomes collective protection. If one family member sees a scam domain, the system remembers it for the next victim. Every receipt becomes a shared blocklist entry.",
    doNotClaim: [
      "Do not claim 'convicted 47 variants' or any fake real-world case count",
      "Do not imply production Redis is already configured in the demo",
      "Local JSON fallback is what runs in the demo — be honest about that",
    ],
  },
  {
    slug: "arize",
    name: "Arize / Phoenix",
    color: "#f97316",
    status: "LOCAL",
    tagline: "Proving AI explanations are safe, grounded, and non-hallucinatory",
    role: "Eval Observability",
    whatItDoes:
      "5-criteria evaluation pipeline checks whether AI explanations are: grounded (based on real evidence), safe-action oriented, non-overclaiming, secret-free, and clear to normal people. This is the proof layer that keeps AI from hallucinating or making false accusations.",
    codePaths: [
      "src/arizeEvalCriteria.js",
      "scripts/arize_eval_demo.js",
      "data/arize-eval-report.json",
      "docs/ARIZE_EVAL_PROOF.md",
    ],
    demoCommand: "node scripts/arize_eval_demo.js",
    liveStatus: "With Arize credentials: cloud observability traces and dashboard.",
    fallbackStatus:
      "Local eval harness runs fully without any cloud connection. Generates eval reports as JSON artifacts. No API needed for the proof pipeline.",
    whyDeservesPrize:
      "We built the exact eval loop judges want: before/after explanation quality, measurable criteria, and regression checks. Arize is not decorative; it proves the AI explanation is safe enough for vulnerable users.",
    doNotClaim: [
      "Do not claim Arize dashboard screenshots exist unless actually verified",
      "Cloud upload claims only if actual Arize dashboard proof exists",
      "Local eval is what runs in the demo — that's honest and sufficient",
    ],
  },
  {
    slug: "sentry",
    name: "Sentry",
    color: "#362d59",
    status: "FALLBACK",
    tagline: "A protection product cannot silently fail",
    role: "Reliability Monitor",
    whatItDoes:
      "Custom envelope protocol (no @sentry/node dependency) captures errors and scam events across all API paths. Sanitizes URLs/context so secrets don't leak. Content script captures scam events for medium/high risk pages.",
    codePaths: [
      "src/sentry.js",
      "src/content.js (trySentryCaptureScam)",
      "scripts/sentry_smoke_demo.js",
      "tests/sentry.test.js",
    ],
    demoCommand: "node scripts/sentry_smoke_demo.js",
    liveStatus: "With SENTRY_DSN: sends live envelope. Script only reports success if all sends return sent=true.",
    fallbackStatus:
      "Without DSN: local event log, no-op capture. Smoke script verifies the protocol works without leaking credentials. 20 tests cover envelope format and sanitization.",
    whyDeservesPrize:
      "Sentry matters because this is a protection product. If scam detection silently breaks, the product fails at the worst possible moment. Sentry is our reliability proof: errors, edge cases, and novel attacks become visible before users are harmed.",
    doNotClaim: [
      "Do not say 'Live Sentry proof complete' if sent=false or non-2xx",
      "Do not imply production monitoring is already guaranteed",
      "Script now prints failure-safe message when sends don't succeed",
    ],
  },
  {
    slug: "asi-one",
    name: "Fetch.ai / ASI:One",
    color: "#3b82f6",
    status: "LOCAL",
    tagline: "Scam analysis as an agent-callable service",
    role: "Agent Coordination",
    whatItDoes:
      "Wraps cloak sting analysis as an agent-callable HTTP interface. Provides /status, /chat, /analyze-threat endpoints. Lets other agents call cloak sting as a scam-analysis service. Agent-to-agent protocol is wired.",
    codePaths: [
      "src/asiOneWrapper.js",
      "agents/cloak-sting-agent.mjs",
      "scripts/asi_agent_demo.js",
      "tests/asiOneWrapper.test.js",
      "tests/asiAgentServer.test.js",
    ],
    demoCommand: "node scripts/asi_agent_demo.js",
    liveStatus: "With Agentverse registration: registered agent discoverable by other agents.",
    fallbackStatus:
      "Local agent wrapper runs without any registration. All 4 endpoints functional. 8 tests pass. Agentverse registration is future work.",
    whyDeservesPrize:
      "cloak sting is naturally agentic: one agent can inspect a page, another can analyze evidence, another can compile a dossier. The local wrapper proves the product can plug into an agent ecosystem where scam defense becomes a composable service.",
    doNotClaim: [
      "Do not claim Agentverse registration unless actually registered",
      "Do not say 'registered agent' — say 'local wrapper, Agentverse-ready'",
      "Agent communication is protocol-ready, not production-deployed",
    ],
  },
  {
    slug: "simular",
    name: "Simular",
    color: "#10b981",
    status: "CLOUD QA",
    tagline: "Autonomous cloud QA and persona-testing agent that hardened the final submission",
    role: "Autonomous Cloud QA",
    whatItDoes:
      "We used Simular as an autonomous cloud QA and persona-testing agent for cloak sting. Simular navigated the live app like a real user, tested the extension/demo flow, stress-tested edge cases, and evaluated the product from three perspectives: an older nontechnical user, an impatient Gen Z user, and a skeptical technical judge. It surfaced 19 actionable findings — 8 bugs, 5 accessibility issues, and 6 UX/copy improvements — plus one positive robustness note.",
    codePaths: ["QA_REPORT.md", "README.md (QA section)"],
    demoCommand: "n/a — cloud QA tool, findings documented in QA_REPORT.md",
    liveStatus: "Used as autonomous cloud QA layer throughout development. Repeatedly tested the product like realistic users.",
    fallbackStatus:
      "QA findings are documented in QA_REPORT.md with reproduction steps, severity ratings, screenshots, and fix recommendations. We used those findings to harden the demo before submission.",
    whyDeservesPrize:
      "Simular was our autonomous cloud QA layer. Instead of manually clicking through the demo once, we used Simular to repeatedly test the product like realistic users, catch accessibility and UX failures, and produce evidence-backed findings before judging. That made our final app more reliable, understandable, and judge-ready. Their advertised use is cloud testing / browser automation — we used it exactly that way.",
    doNotClaim: [
      "Do not claim Simular powers runtime scam detection",
      "Do not imply it runs inside the extension at runtime",
      "It is autonomous cloud QA — honest, concrete, and valuable — not the detection pipeline",
    ],
  },
  {
    slug: "pika-midjourney",
    name: "Pika / Midjourney",
    color: "#a855f7",
    status: "SUPPORT",
    tagline: "Visual polish that makes the demo memorable",
    role: "Design & Demo Support",
    whatItDoes:
      "Visual assets, demo video generation, pitch polish. Used for logo concepts, site design iteration, and demo presentation assets. Not runtime product logic.",
    codePaths: ["site/ (visual assets)", "screenshots/ (demo materials)"],
    demoCommand: "n/a — design support, not runtime code",
    liveStatus: "Used for visual asset creation.",
    fallbackStatus: "All generated assets are committed to the repo as static files.",
    whyDeservesPrize:
      "Makes the demo memorable and polished. A judge sees a professional product in the first 3 seconds. Design support that elevates the pitch without being fake technical integration.",
    doNotClaim: [
      "Do not claim product runtime integration",
      "Do not imply AI image generation is part of scam detection",
      "This is support/design tooling — be upfront about that",
    ],
  },
];
