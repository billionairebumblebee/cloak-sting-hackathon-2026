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
    <section id="architecture" className="relative px-6 py-32 sm:py-40">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/[0.02] blur-[150px]" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-20 text-center">
          <SectionLabel>Architecture</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-5 text-4xl font-bold tracking-tight text-cream sm:text-5xl">
              The arsenal{" "}
              <span className="text-text-secondary">behind the hunt.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-md text-base text-text-secondary">
              Each technology is a weapon in the pipeline — purpose-built to
              detect, analyze, and convict.
            </p>
          </FadeIn>
        </div>

        {/* Pipeline flow */}
        <FadeIn delay={0.3}>
          <div className="mb-20 flex flex-wrap items-center justify-center gap-2">
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
                          backgroundColor: step.color + "10",
                          color: step.color,
                          border: `1px solid ${step.color}20`,
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
                    className="text-white/10"
                    animate={{ opacity: [0.1, 0.4, 0.1] }}
                    transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                  >
                    &rarr;
                  </motion.span>
                )}
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Detail cards */}
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {architectureNodes.map((node) => {
            const Icon = iconMap[node.id] || Globe;
            return (
              <StaggerItem key={node.id}>
                <motion.div
                  className="glass group rounded-2xl p-6 transition-all duration-500"
                  whileHover={{
                    y: -4,
                    boxShadow: `0 0 30px ${node.color}08`,
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="mb-5 flex items-center gap-3">
                    <motion.div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: node.color + "10" }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon size={18} style={{ color: node.color }} strokeWidth={1.5} />
                    </motion.div>
                    <div>
                      <h3 className="text-[13px] font-bold text-cream">
                        {node.name}
                      </h3>
                      <p
                        className="text-[11px] font-medium"
                        style={{ color: node.color + "99" }}
                      >
                        {node.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-[12px] leading-relaxed text-text-secondary">
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
