import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FadeIn, StaggerContainer, StaggerItem, SectionLabel } from "./Motion";
import { playClick } from "../utils/sounds";

const integrations = [
  {
    name: "Deepgram",
    slug: "deepgram",
    color: "#13ef93",
    status: "FALLBACK",
    role: "Voice Intelligence",
    detail: "Nova-3 STT turns scam calls into analyzable text. Catches voice scams most tools ignore entirely.",
    files: ["src/deepgramSTT.js", "src/voiceScamPipeline.js"],
  },
  {
    name: "Anthropic",
    slug: "anthropic",
    color: "#d97706",
    status: "FALLBACK",
    role: "Explanation Layer",
    detail: "Claude translates raw detector output into calm, plain-English safety explanations anyone can understand.",
    files: ["src/anthropicExplain.js"],
  },
  {
    name: "Browserbase",
    slug: "browserbase",
    color: "#6366f1",
    status: "SEAM",
    role: "Isolated Link Inspection",
    detail: "The bomb squad robot — opens dangerous URLs in a sandboxed cloud browser so your device stays safe.",
    files: ["src/browserbaseInspect.js"],
  },
  {
    name: "Redis",
    slug: "redis",
    color: "#dc2626",
    status: "FALLBACK",
    role: "Threat Memory",
    detail: "Scam memory that turns one person's encounter into protection for the next victim.",
    files: ["src/caseStore.js"],
  },
  {
    name: "Arize / Phoenix",
    slug: "arize",
    color: "#f97316",
    status: "LOCAL",
    role: "Eval Observability",
    detail: "5-criteria eval proves AI explanations are grounded, safe, and never overclaiming.",
    files: ["src/arizeEvalCriteria.js"],
  },
  {
    name: "Sentry",
    slug: "sentry",
    color: "#362d59",
    status: "FALLBACK",
    role: "Reliability Monitor",
    detail: "A protection product can't silently break. Captures errors so the scanner never fails when it matters most.",
    files: ["src/sentry.js"],
  },
  {
    name: "The Token Company",
    slug: "token-company",
    color: "#06b6d4",
    status: "LOCAL",
    role: "Token Compression",
    detail: "Risk-preserving compression: 66% fewer tokens while keeping every decision-critical fact intact.",
    files: ["src/tokenCompress.js"],
  },
  {
    name: "Fetch.ai / ASI:One",
    slug: "asi-one",
    color: "#3b82f6",
    status: "LOCAL",
    role: "Agent Coordination",
    detail: "Exposes sting as an agent-callable service. Other agents can request scam analysis without building their own detector.",
    files: ["src/asiOneWrapper.js"],
  },
  {
    name: "Simular",
    slug: "simular",
    color: "#10b981",
    status: "CLOUD QA",
    role: "Autonomous QA Agent",
    detail: "Tested the live product across 3 personas. Surfaced 19 actionable findings we'd have missed.",
    files: ["QA_REPORT.md"],
  },
  {
    name: "Pika / Midjourney",
    slug: "pika-midjourney",
    color: "#a855f7",
    status: "SUPPORT",
    role: "Design & Demo",
    detail: "Visual polish that makes judges notice in the first 3 seconds. Professional assets and demo quality.",
    files: ["site/"],
  },
  {
    name: "OpenAI Codex",
    slug: null,
    color: "#00a67e",
    status: "DEV TOOL",
    role: "AI Pair Programming",
    detail: "Accelerated implementation of detection heuristics, test fixtures, and scam pattern databases across the entire codebase.",
    files: ["(whole codebase)"],
  },
  {
    name: "Devin (Cognition)",
    slug: null,
    color: "#ff6b35",
    status: "DEV TOOL",
    role: "AI Software Engineer",
    detail: "Built site, extension, CI pipeline, sponsor integrations, and 192 tests. The engineering backbone of this project.",
    files: ["(whole project)"],
  },
];

const statusColors = {
  FALLBACK: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  SEAM: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" },
  LOCAL: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
  "CLOUD QA": { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
  SUPPORT: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  "DEV TOOL": { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
};

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

function IntegrationCard({ item }) {
  const colors = statusColors[item.status] || statusColors.LOCAL;

  const inner = (
    <div className="glass group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:ring-1 hover:ring-white/[0.08]">
      {/* Accent glow */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
        style={{ backgroundColor: item.color }}
      />

      <div className="relative">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full shadow-lg"
              style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}40` }}
            />
            <h3 className="text-[15px] font-bold text-text-primary">
              {item.name}
            </h3>
          </div>
          <span
            className={`rounded-md border px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase ${colors.bg} ${colors.text} ${colors.border}`}
          >
            {item.status}
          </span>
        </div>

        {/* Role */}
        <p
          className="mb-3 text-[11px] font-bold uppercase tracking-wider"
          style={{ color: item.color }}
        >
          {item.role}
        </p>

        {/* Description */}
        <p className="mb-4 text-[13px] leading-[1.7] text-text-secondary">
          {item.detail}
        </p>

        {/* Files */}
        <div className="flex flex-wrap gap-1.5">
          {item.files.map((f) => (
            <span
              key={f}
              className="rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-text-muted"
            >
              {f}
            </span>
          ))}
        </div>

        {/* Hover hint */}
        {item.slug && (
          <p className="mt-4 text-[11px] font-medium text-honey opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            view full proof →
          </p>
        )}
      </div>
    </div>
  );

  if (item.slug) {
    return (
      <Link to={`/arsenal/${item.slug}`} className="block" onClick={playClick}>
        {inner}
      </Link>
    );
  }
  return inner;
}

export default function SponsorShowcase() {
  return (
    <section id="arsenal" className="relative px-6 py-28 sm:py-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-honey/[0.02] blur-[200px]" />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <SectionLabel>The Arsenal</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-5 text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-text-primary">
              12 integrations.{" "}
              <span className="gradient-text">zero logo soup.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-lg text-[16px] leading-[1.7] text-text-secondary">
              every tool maps to one stage of the scam-defense pipeline.
              without API keys, each path degrades gracefully to a local fallback.
            </p>
          </FadeIn>
        </div>

        {/* Stats bar */}
        <FadeIn delay={0.3}>
          <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Tests Passing", value: 192 },
              { label: "Source Files", value: 22 },
              { label: "Scam Patterns", value: 10 },
              { label: "Integrations", value: 12 },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-2xl p-5 text-center"
              >
                <div className="font-mono text-3xl font-bold text-honey">
                  <AnimatedCount end={stat.value} />
                </div>
                <div className="mt-1 text-[12px] font-medium text-text-secondary">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Pipeline visualization */}
        <FadeIn delay={0.35}>
          <div className="mb-12 overflow-x-auto">
            <div className="flex items-center justify-center gap-1 min-w-max px-4 py-4">
              {[
                { label: "Input", color: null },
                { label: "Deepgram", color: "#13ef93" },
                { label: "Browserbase", color: "#6366f1" },
                { label: "Detect", color: null },
                { label: "Claude", color: "#d97706" },
                { label: "Arize", color: "#f97316" },
                { label: "Redis", color: "#dc2626" },
                { label: "Sentry", color: "#362d59" },
                { label: "Verdict", color: null },
              ].map((step, i, arr) => (
                <div key={i} className="flex items-center gap-1">
                  <span
                    className={`rounded-lg px-3 py-1.5 font-mono text-[11px] font-medium ${
                      step.color
                        ? ""
                        : "border border-white/[0.06] bg-white/[0.02] text-text-muted"
                    }`}
                    style={
                      step.color
                        ? {
                            backgroundColor: step.color + "15",
                            color: step.color,
                            border: `1px solid ${step.color}25`,
                          }
                        : {}
                    }
                  >
                    {step.label}
                  </span>
                  {i < arr.length - 1 && (
                    <span className="text-[11px] text-white/10">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Integration cards */}
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
          {integrations.map((item) => (
            <StaggerItem key={item.name}>
              <IntegrationCard item={item} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Legend */}
        <FadeIn delay={0.8}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-[11px] text-text-muted">
            {Object.entries(statusColors).map(([label, colors]) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={`inline-block h-2 w-2 rounded-full ${colors.bg} border ${colors.border}`} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
