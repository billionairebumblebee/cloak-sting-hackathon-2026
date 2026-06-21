import { useRef } from "react";
import { motion, useMotionValue, useTransform, useInView } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem, SectionLabel, CountUp } from "./Motion";

const sponsors = [
  {
    name: "Deepgram",
    color: "#13ef93",
    status: "LIVE",
    role: "Voice Intelligence",
    detail: "Nova-3 real-time STT with automatic language detection. Transcribes suspicious calls in English, Mandarin, and Spanish with word-level timestamps and speaker diarization.",
    stats: "3 language support • Real-time transcription • Confidence scoring",
    files: ["src/deepgramSTT.js", "src/deepgramTranscribe.js", "src/voiceScamPipeline.js"],
  },
  {
    name: "Anthropic",
    color: "#d97706",
    status: "LIVE",
    role: "Verdict Engine",
    detail: "Claude generates plain-English verdicts grounded in deterministic signal analysis. Produces safe next-step recommendations anyone can understand — including your grandma.",
    stats: "5-criteria eval system • Grounded explanations • Arize-traced",
    files: ["src/anthropicExplain.js", "src/arizeEvalCriteria.js"],
  },
  {
    name: "Browserbase",
    color: "#6366f1",
    status: "LIVE",
    role: "Safe Page Inspection",
    detail: "Opens scam URLs in an isolated cloud browser. Captures structure, redirects, and form behavior without ever exposing the user’s real browser or IP to attackers.",
    stats: "Sandboxed analysis • Form detection • Evidence capture",
    files: ["src/browserbaseInspect.js"],
  },
  {
    name: "Redis",
    color: "#dc2626",
    status: "LIVE",
    role: "Threat Memory",
    detail: "Stores evidence dossiers, case records, and attack signatures. Supports both Upstash REST and native Redis client with automatic fallback to local JSON.",
    stats: "3 backends • Case persistence • Pattern retrieval",
    files: ["src/caseStore.js"],
  },
  {
    name: "Sentry",
    color: "#362d59",
    status: "LIVE",
    role: "Reliability Monitor",
    detail: "Custom envelope protocol (no @sentry/node) captures errors and scam events across all API paths. Auto-tags with risk level, score, signal types. Proof artifacts without credential leakage.",
    stats: "Zero dependencies • All API paths covered • 20 tests",
    files: ["src/sentry.js"],
  },
  {
    name: "Fetch.ai / ASI:One",
    color: "#3b82f6",
    status: "LIVE",
    role: "Agent Coordination",
    detail: "Autonomous agent wrapper with /status, /chat, /analyze-threat endpoints. Agent-to-agent communication ready for Agentverse registration.",
    stats: "4 endpoints • 8 tests • Agentverse-ready",
    files: ["src/asiOneWrapper.js", "agents/cloak-sting-agent.mjs"],
  },
  {
    name: "Arize / Phoenix",
    color: "#f97316",
    status: "LIVE",
    role: "Eval Observability",
    detail: "5-criteria evaluation pipeline: grounded, safeAction, noOverclaim, noSecrets, clarity. Traces every AI verdict to prove the system improves over time.",
    stats: "5 eval criteria • Regression detection • Quality scoring",
    files: ["src/arizeEvalCriteria.js"],
  },
];

function SponsorCard({ s }) {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      ref={ref}
      className="glass group relative overflow-hidden rounded-2xl p-6"
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02, y: -3, transition: { duration: 0.3 } }}
    >
      {/* Hover spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) =>
              `radial-gradient(350px circle at ${x}px ${y}px, ${s.color}08, transparent 60%)`
          ),
        }}
      />

      {/* Top edge glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-40 group-hover:opacity-80 transition-opacity duration-500"
        style={{ background: `linear-gradient(to right, transparent, ${s.color}40, transparent)` }}
      />

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: s.color }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
            <h3 className="text-[14px] font-bold text-text-primary">
              {s.name}
            </h3>
          </div>
          <motion.span
            className="rounded-md px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase"
            style={{
              backgroundColor: s.color + "15",
              color: s.color,
            }}
            whileHover={{ scale: 1.1 }}
          >
            {s.status}
          </motion.span>
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
              className="rounded bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] text-text-muted transition-colors duration-300 group-hover:text-text-secondary"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function SponsorShowcase() {
  const statsRef = useRef(null);
  const isInView = useInView(statsRef, { once: true, margin: "-40px" });

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
          <div ref={statsRef} className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Tests Passing", value: 159 },
              { label: "Source Files", value: 18 },
              { label: "Scam Patterns", value: 8 },
              { label: "Sponsor APIs", value: 7 },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                className="glass rounded-2xl p-5 text-center"
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ duration: 0.3 }}
              >
                <div className="font-mono text-3xl font-bold text-honey">
                  <CountUp target={stat.value} />
                </div>
                <div className="mt-1 text-[12px] font-medium text-text-secondary">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        {/* Sponsor cards */}
        <StaggerContainer className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {sponsors.map((s) => (
            <StaggerItem key={s.name}>
              <SponsorCard s={s} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
