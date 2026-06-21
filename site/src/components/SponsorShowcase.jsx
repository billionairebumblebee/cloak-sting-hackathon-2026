import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FadeIn, StaggerContainer, StaggerItem, SectionLabel } from "./Motion";

const sponsors = [
  {
    name: "Deepgram",
    slug: "deepgram",
    color: "#13ef93",
    status: "FALLBACK",
    role: "Voice Intelligence",
    detail: "Nova-3 real-time STT turns scam calls into analyzable text. Without API key, fixture transcripts power the same pipeline end-to-end.",
    stats: "3 audio fixtures \u2022 8-family voice matcher \u2022 Live with key",
    files: ["src/deepgramSTT.js", "src/voiceScamPipeline.js", "src/voicePatterns.js"],
  },
  {
    name: "Anthropic",
    slug: "anthropic",
    color: "#d97706",
    status: "FALLBACK",
    role: "Explanation Layer",
    detail: "Claude turns raw detector findings into calm, plain-English safety explanations. Not the detector — the translator that makes warnings useful for real people.",
    stats: "5-criteria eval \u2022 Deterministic fallback \u2022 Safety translator",
    files: ["src/anthropicExplain.js", "src/arizeEvalCriteria.js"],
  },
  {
    name: "Browserbase",
    slug: "browserbase",
    color: "#6366f1",
    status: "SEAM",
    role: "Isolated Link Inspection",
    detail: "The 'bomb squad robot' for suspicious links — opens dangerous URLs in a remote sandboxed browser so your device never touches the scam site.",
    stats: "Sandboxed detonation \u2022 Evidence extraction \u2022 Live with key",
    files: ["src/browserbaseInspect.js"],
  },
  {
    name: "Redis",
    slug: "redis",
    color: "#dc2626",
    status: "FALLBACK",
    role: "Threat Memory",
    detail: "Scam memory that turns individual warnings into collective protection. One person's scam encounter becomes data that protects the next victim.",
    stats: "3 backends \u2022 Auto-fallback \u2022 Zero-config demo",
    files: ["src/caseStore.js"],
  },
  {
    name: "Arize / Phoenix",
    slug: "arize",
    color: "#f97316",
    status: "LOCAL",
    role: "Eval Observability",
    detail: "Proves the AI explanation layer is safe: grounded in evidence, action-oriented, never overclaiming, secret-free, and clear to normal people.",
    stats: "5 eval criteria \u2022 Before/after proof \u2022 Regression checks",
    files: ["src/arizeEvalCriteria.js", "scripts/arize_eval_demo.js"],
  },
  {
    name: "Sentry",
    slug: "sentry",
    color: "#362d59",
    status: "FALLBACK",
    role: "Reliability Monitor",
    detail: "A protection product can't silently break. Sentry captures errors and edge cases so the scanner never fails at the worst possible moment.",
    stats: "Custom envelope \u2022 Local fallback \u2022 20 tests",
    files: ["src/sentry.js", "scripts/sentry_smoke_demo.js"],
  },
  {
    name: "The Token Company",
    slug: "token-company",
    color: "#06b6d4",
    status: "LOCAL",
    role: "Token Compression",
    detail: "Risk-preserving compression: 66% fewer tokens while keeping every decision-critical fact intact. Proves quality maintained with Arize eval.",
    stats: "66% reduction \u2022 5/5 eval maintained \u2022 Deterministic",
    files: ["src/tokenCompress.js", "scripts/token_compress_demo.js"],
  },
  {
    name: "Fetch.ai / ASI:One",
    slug: "asi-one",
    color: "#3b82f6",
    status: "LOCAL",
    role: "Agent Coordination",
    detail: "Exposes sting as an agent-callable service. Other agents can request scam analysis via /analyze-threat without building their own detector.",
    stats: "4 endpoints \u2022 8 tests \u2022 Agent-ready protocol",
    files: ["src/asiOneWrapper.js", "agents/cloak-sting-agent.mjs"],
  },
  {
    name: "Simular",
    slug: "simular",
    color: "#10b981",
    status: "CLOUD QA",
    role: "Autonomous QA Agent",
    detail: "Tested our live product like a real user. Surfaced 19 actionable findings across 3 personas: accessibility bugs, UX issues, and edge cases we'd have missed.",
    stats: "19 findings \u2022 3 personas \u2022 Autonomous testing",
    files: ["QA_REPORT.md"],
  },
  {
    name: "Pika / Midjourney",
    slug: "pika-midjourney",
    color: "#a855f7",
    status: "SUPPORT",
    role: "Design & Demo Support",
    detail: "Visual polish that makes judges notice in the first 3 seconds. Professional assets, demo materials, and pitch presentation quality.",
    stats: "Site assets \u2022 Demo visuals \u2022 Pitch polish",
    files: ["site/ (visual assets)"],
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
              { label: "Tests Passing", value: 192, suffix: "" },
              { label: "Source Files", value: 22, suffix: "" },
              { label: "Scam Patterns", value: 10, suffix: "" },
              { label: "Sponsor Integrations", value: 10, suffix: "" },
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
              <Link to={`/arsenal/${s.slug}`} className="block">
                <div className="glass group rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:ring-1 hover:ring-white/[0.08]">
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
                  <p className="mt-3 text-[10px] font-medium text-honey opacity-0 transition-opacity group-hover:opacity-100">
                    view full proof →
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
