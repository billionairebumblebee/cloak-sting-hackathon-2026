import { useState, useEffect, useRef } from "react";
import { FadeIn, StaggerContainer, StaggerItem, SectionLabel } from "./Motion";

const sponsors = [
  {
    name: "Deepgram",
    color: "#13ef93",
    status: "LIVE",
    role: "Voice Intelligence",
    detail: "Nova-3 real-time STT with automatic language detection. Transcribes suspicious calls in English, Mandarin, and Spanish with word-level timestamps and speaker diarization.",
    stats: "3 language support \u2022 Real-time transcription \u2022 Confidence scoring",
    files: ["src/deepgramSTT.js", "src/deepgramTranscribe.js", "src/voiceScamPipeline.js"],
  },
  {
    name: "Anthropic",
    color: "#d97706",
    status: "LIVE",
    role: "Verdict Engine",
    detail: "Claude generates plain-English verdicts grounded in deterministic signal analysis. Produces safe next-step recommendations anyone can understand \u2014 including your grandma.",
    stats: "5-criteria eval system \u2022 Grounded explanations \u2022 Arize-traced",
    files: ["src/anthropicExplain.js", "src/arizeEvalCriteria.js"],
  },
  {
    name: "Browserbase",
    color: "#6366f1",
    status: "LIVE",
    role: "Safe Page Inspection",
    detail: "Opens scam URLs in an isolated cloud browser. Captures structure, redirects, and form behavior without ever exposing the user\u2019s real browser or IP to attackers.",
    stats: "Sandboxed analysis \u2022 Form detection \u2022 Evidence capture",
    files: ["src/browserbaseInspect.js"],
  },
  {
    name: "Redis",
    color: "#dc2626",
    status: "LIVE",
    role: "Threat Memory",
    detail: "Stores evidence dossiers, case records, and attack signatures. Supports both Upstash REST and native Redis client with automatic fallback to local JSON.",
    stats: "3 backends \u2022 Case persistence \u2022 Pattern retrieval",
    files: ["src/caseStore.js"],
  },
  {
    name: "Sentry",
    color: "#362d59",
    status: "LIVE",
    role: "Reliability Monitor",
    detail: "Custom envelope protocol (no @sentry/node) captures errors and scam events across all API paths. Auto-tags with risk level, score, signal types. Proof artifacts without credential leakage.",
    stats: "Zero dependencies \u2022 All API paths covered \u2022 20 tests",
    files: ["src/sentry.js"],
  },
  {
    name: "Fetch.ai / ASI:One",
    color: "#3b82f6",
    status: "LIVE",
    role: "Agent Coordination",
    detail: "Autonomous agent wrapper with /status, /chat, /analyze-threat endpoints. Agent-to-agent communication ready for Agentverse registration.",
    stats: "4 endpoints \u2022 8 tests \u2022 Agentverse-ready",
    files: ["src/asiOneWrapper.js", "agents/cloak-sting-agent.mjs"],
  },
  {
    name: "Arize / Phoenix",
    color: "#f97316",
    status: "LIVE",
    role: "Eval Observability",
    detail: "5-criteria evaluation pipeline: grounded, safeAction, noOverclaim, noSecrets, clarity. Traces every AI verdict to prove the system improves over time.",
    stats: "5 eval criteria \u2022 Regression detection \u2022 Quality scoring",
    files: ["src/arizeEvalCriteria.js"],
  },
];

function AnimatedCount({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          tick();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function SponsorShowcase() {
  return (
    <section id="sponsors" className="relative px-6 py-28 sm:py-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-honey/[0.02] blur-[200px]" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <SectionLabel>Sponsor Integrations</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-5 text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-text-primary">
              Every sponsor.{" "}
              <span className="gradient-text">Actually used.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-lg text-[16px] leading-[1.7] text-text-secondary">
              Not checkbox integrations. Each sponsor technology is woven into the
              detection pipeline with real code, real tests, and real proof artifacts.
            </p>
          </FadeIn>
        </div>

        {/* Stats bar */}
        <FadeIn delay={0.3}>
          <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Tests Passing", value: 159, suffix: "" },
              { label: "Source Files", value: 18, suffix: "" },
              { label: "Scam Patterns", value: 8, suffix: "" },
              { label: "Sponsor APIs", value: 7, suffix: "" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-2xl p-5 text-center"
              >
                <div className="font-mono text-3xl font-bold text-honey">
                  <AnimatedCount end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-1 text-[12px] font-medium text-text-secondary">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Sponsor cards */}
        <StaggerContainer className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {sponsors.map((s) => (
            <StaggerItem key={s.name}>
              <div className="glass group rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    <h3 className="text-[14px] font-bold text-text-primary">
                      {s.name}
                    </h3>
                  </div>
                  <span
                    className="rounded-md px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase"
                    style={{
                      backgroundColor: s.color + "15",
                      color: s.color,
                    }}
                  >
                    {s.status}
                  </span>
                </div>
                <p
                  className="mb-2 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: s.color + "90" }}
                >
                  {s.role}
                </p>
                <p className="mb-3 text-[12px] leading-[1.65] text-text-secondary">
                  {s.detail}
                </p>
                <p className="mb-3 text-[10px] font-medium text-text-muted">
                  {s.stats}
                </p>
                <div className="flex flex-wrap gap-1">
                  {s.files.map((f) => (
                    <span
                      key={f}
                      className="rounded bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] text-text-muted"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
