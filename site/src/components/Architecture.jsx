import { architectureNodes } from "../data/demoData";
import { motion } from "framer-motion";
import {
  Globe,
  Brain,
  Database,
  BarChart3,
  Bug,
  Network,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, SectionLabel } from "./Motion";

const iconMap = {
  browserbase: Globe,
  anthropic: Brain,
  redis: Database,
  arize: BarChart3,
  sentry: Bug,
  fetch: Network,
};

const pipelineSteps = [
  { label: "Suspicious input", color: null },
  { label: "Browserbase", color: "#6366f1" },
  { label: "Signal analysis", color: null },
  { label: "Claude", color: "#d97706" },
  { label: "Redis", color: "#dc2626" },
  { label: "Verdict + receipt", color: null },
];

export default function Architecture() {
  return (
    <section id="architecture" className="relative px-6 py-28 sm:py-36">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/[0.015] blur-[180px]" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <SectionLabel>Architecture</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-5 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.12] tracking-[-0.025em] text-text-primary">
              The arsenal{" "}
              <span className="text-text-muted">behind the hunt.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-md text-[15px] leading-[1.7] text-text-secondary">
              Each technology is a weapon in the pipeline — purpose-built to
              detect, analyze, and convict.
            </p>
          </FadeIn>
        </div>

        {/* Pipeline flow */}
        <FadeIn delay={0.3}>
          <div className="mb-16 flex flex-wrap items-center justify-center gap-2">
            {pipelineSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <motion.span
                  className={`rounded-lg px-3 py-1.5 font-mono text-[11px] ${
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
                  whileHover={{ scale: 1.06, y: -1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {step.label}
                </motion.span>
                {i < pipelineSteps.length - 1 && (
                  <motion.span
                    className="text-[12px] text-white/[0.08]"
                    animate={{ opacity: [0.08, 0.3, 0.08] }}
                    transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity }}
                  >
                    &rarr;
                  </motion.span>
                )}
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Detail cards */}
        <StaggerContainer className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {architectureNodes.map((node) => {
            const Icon = iconMap[node.id] || Globe;
            return (
              <StaggerItem key={node.id}>
                <motion.div
                  className="glass glass-hover group rounded-2xl p-6"
                  whileHover={{
                    y: -2,
                    boxShadow: `0 8px 40px ${node.color}06`,
                    transition: { duration: 0.35, ease: [0.25, 0.4, 0.25, 1] },
                  }}
                >
                  <div className="mb-5 flex items-center gap-3">
                    <motion.div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: node.color + "0d" }}
                      whileHover={{ scale: 1.08, rotate: 3 }}
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
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
