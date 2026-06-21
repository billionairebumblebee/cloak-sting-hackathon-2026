import { useRef } from "react";
import {
  Globe,
  Brain,
  Database,
  BarChart3,
  Bug,
  Network,
  Mic,
} from "lucide-react";
import { motion, useMotionValue, useTransform, useInView } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem, SectionLabel } from "./Motion";

const iconMap = {
  deepgram: Mic,
  browserbase: Globe,
  anthropic: Brain,
  redis: Database,
  arize: BarChart3,
  sentry: Bug,
  fetch: Network,
};

const architectureNodes = [
  {
    id: "browserbase",
    name: "Browserbase",
    role: "Safe page inspection",
    color: "#6366f1",
    description:
      "Opens suspicious URLs in an isolated cloud browser. Captures page structure, redirects, and form behavior without exposing the user’s real browser or IP to the scam site.",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    role: "Grounded explanations",
    color: "#d97706",
    description:
      "Takes deterministic signal output and generates a plain-English explanation a non-technical person can understand. Also produces safe next-step recommendations grounded in the actual evidence.",
  },
  {
    id: "redis",
    name: "Redis",
    role: "Case memory & receipts",
    color: "#dc2626",
    description:
      "Stores evidence receipts, case records, and scam pattern signatures. Enables similar-scam retrieval so sting can say ‘we’ve seen 47 variants of this scam’ with real data.",
  },
  {
    id: "arize",
    name: "Arize / Phoenix",
    role: "Trace & eval observability",
    color: "#f97316",
    description:
      "Traces every AI verdict through the pipeline. Logs input signals, model reasoning, and output quality so we can prove the system is improving and catch regressions.",
  },
  {
    id: "sentry",
    name: "Sentry",
    role: "Reliability monitoring",
    color: "#8b5cf6",
    description:
      "Captures errors, performance issues, and edge cases in production. Ensures the scanning pipeline doesn’t silently fail when encountering novel scam patterns.",
  },
  {
    id: "fetch",
    name: "Fetch.ai",
    role: "Agent coordination",
    color: "#3b82f6",
    description:
      "Enables autonomous agent-to-agent communication for distributed scam investigation — one agent inspects the page, another checks domain reputation, another generates the receipt.",
  },
];

const pipelineSteps = [
  { label: "Suspicious input", color: null },
  { label: "Deepgram STT", color: "#13ef93" },
  { label: "Browserbase", color: "#6366f1" },
  { label: "Signal analysis", color: null },
  { label: "Claude", color: "#d97706" },
  { label: "Redis", color: "#dc2626" },
  { label: "Verdict + receipt", color: null },
];

function ArchCard({ node, Icon }) {
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
      {/* Hover glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) =>
              `radial-gradient(300px circle at ${x}px ${y}px, ${node.color}08, transparent 60%)`
          ),
        }}
      />

      <div className="relative z-10">
        <div className="mb-5 flex items-center gap-3">
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: node.color + "0d" }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Icon size={17} style={{ color: node.color }} strokeWidth={1.5} />
          </motion.div>
          <div>
            <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-text-primary">
              {node.name}
            </h3>
            <p
              className="text-[11px] font-medium"
              style={{ color: node.color + "80" }}
            >
              {node.role}
            </p>
          </div>
        </div>
        <p className="text-[12px] leading-[1.65] text-text-secondary">
          {node.description}
        </p>
      </div>
    </motion.div>
  );
}

function PipelineFlow() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="mb-16 flex flex-wrap items-center justify-center gap-2">
      {pipelineSteps.map((step, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.08, duration: 0.4 }}
        >
          <motion.span
            className={`rounded-lg px-3 py-1.5 font-mono text-[12px] ${
              step.color
                ? ""
                : "border border-white/[0.04] bg-white/[0.02] text-text-muted"
            }`}
            style={
              step.color
                ? {
                    backgroundColor: step.color + "0d",
                    color: step.color,
                    border: `1px solid ${step.color}15`,
                  }
                : {}
            }
            whileHover={{ scale: 1.08, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {step.label}
          </motion.span>
          {i < pipelineSteps.length - 1 && (
            <motion.span
              className="text-[12px] text-white/[0.08]"
              animate={{ opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            >
              &rarr;
            </motion.span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default function Architecture() {
  return (
    <section id="architecture" className="relative px-6 py-28 sm:py-36">
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/[0.015] blur-[180px]" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <SectionLabel>Architecture</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-5 text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-text-primary">
              The arsenal{" "}
              <span className="text-text-muted">behind the hunt.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-md text-[16px] leading-[1.7] text-text-secondary">
              Each technology is a weapon in the pipeline — purpose-built to
              detect, analyze, and convict.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.3}>
          <PipelineFlow />
        </FadeIn>

        <StaggerContainer className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {architectureNodes.map((node) => {
            const Icon = iconMap[node.id] || Globe;
            return (
              <StaggerItem key={node.id}>
                <ArchCard node={node} Icon={Icon} />
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
