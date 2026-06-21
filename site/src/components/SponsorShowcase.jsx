import { useState, useEffect, useRef } from "react";
import { FadeIn, StaggerContainer, StaggerItem, SectionLabel } from "./Motion";

const sponsors = [
  {
    name: "Deepgram",
    color: "#13ef93",
    status: "FALLBACK",
    role: "Voice Intelligence",
    detail: "Nova-3 real-time STT pipeline fully built. Without API key, uses local audio fixtures (bank robocall, Chinese embassy scam, hostage ransom) to demonstrate the voice scam detection path end-to-end.",
    stats: "3 audio fixtures \u2022 8-family voice pattern matcher \u2022 Live with key",
    files: ["src/deepgramSTT.js", "src/voiceScamPipeline.js", "src/voicePatterns.js"],
  },
  {
    name: "Anthropic",
    color: "#d97706",
    status: "FALLBACK",
    role: "Explanation Layer",
    detail: "Claude generates grounded plain-English explanations from deterministic signal data. Without API key, a local template engine produces the same explanation structure from case findings.",
    stats: "5-criteria eval \u2022 Deterministic fallback \u2022 Not the detector",
    files: ["src/anthropicExplain.js", "src/arizeEvalCriteria.js"],
  },
  {
    name: "Browserbase",
    color: "#6366f1",
    status: "SEAM",
    role: "Isolated Link Inspection",
    detail: "URL detonation in a sandboxed cloud browser. Without API key, sting performs local DOM analysis only. The isolation seam is fully wired \u2014 add a key and remote inspection activates.",
    stats: "Local DOM fallback \u2022 Form/redirect capture ready \u2022 Live with key",
    files: ["src/browserbaseInspect.js"],
  },
  {
    name: "Redis",
    color: "#dc2626",
    status: "FALLBACK",
    role: "Threat Memory",
    detail: "3-backend case store: Redis client, Upstash REST, or local JSON. Falls back gracefully \u2014 demo runs entirely on local JSON without any Redis endpoint. Add credentials and cases persist to cloud.",
    stats: "3 backends \u2022 Automatic fallback \u2022 Zero-config demo",
    files: ["src/caseStore.js"],
  },
  {
    name: "Sentry",
    color: "#362d59",
    status: "FALLBACK",
    role: "Reliability Monitor",
    detail: "Custom envelope protocol captures errors and scam events. Without DSN, events log locally. The smoke script proves the protocol works without leaking credentials.",
    stats: "Zero dependencies \u2022 Local log fallback \u2022 20 tests",
    files: ["src/sentry.js", "scripts/sentry_smoke_demo.js"],
  },
  {
    name: "Fetch.ai / ASI:One",
    color: "#3b82f6",
    status: "LOCAL",
    role: "Agent Coordination",
    detail: "Local agent wrapper with /status, /chat, /analyze-threat endpoints. Runs without Agentverse registration. Agent-to-agent protocol is wired; registration is future work.",
    stats: "4 endpoints \u2022 8 tests \u2022 No registration required",
    files: ["src/asiOneWrapper.js", "agents/cloak-sting-agent.mjs"],
  },
  {
    name: "Arize / Phoenix",
    color: "#f97316",
    status: "LOCAL",
    role: "Eval Observability",
    detail: "5-criteria evaluation pipeline runs locally: grounded, safeAction, noOverclaim, noSecrets, clarity. Proof script generates eval reports without any cloud connection.",
    stats: "5 eval criteria \u2022 Local proof script \u2022 No API needed",
    files: ["src/arizeEvalCriteria.js", "scripts/arize_eval_demo.js"],
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
              every sponsor.{" "}
              <span className="gradient-text">honestly integrated.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-lg text-[16px] leading-[1.7] text-text-secondary">
              no fake claims. each sponsor is woven into the pipeline with real code and tests.
              without API keys, every path degrades gracefully to a local fallback.
            </p>
          </FadeIn>
        </div>

        {/* Stats bar */}
        <FadeIn delay={0.3}>
          <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Tests Passing", value: 169, suffix: "" },
              { label: "Source Files", value: 20, suffix: "" },
              { label: "Scam Patterns", value: 10, suffix: "" },
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
