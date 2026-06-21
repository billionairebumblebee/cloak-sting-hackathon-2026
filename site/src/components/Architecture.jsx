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
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/[0.02] blur-[150px]" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-20 text-center">
          <SectionLabel>Architecture</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-5 text-4xl font-bold tracking-tight text-cream sm:text-5xl">
              How the stack{" "}
              <span className="text-text-secondary">fits together.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-md text-base text-text-secondary">
              Each sponsor technology solves a specific problem in the pipeline
              — not logo soup.
            </p>
          </FadeIn>
        </div>

        {/* Pipeline flow */}
        <FadeIn delay={0.3}>
          <div className="mb-20 flex flex-wrap items-center justify-center gap-2">
            {pipelineSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className={`rounded-lg px-3 py-1.5 font-mono text-[11px] transition-transform duration-300 hover:scale-[1.08] hover:-translate-y-0.5 ${
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
                >
                  {step.label}
                </span>
                {i < pipelineSteps.length - 1 && (
                  <span className="text-white/10 animate-arrow-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
                    &rarr;
                  </span>
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
                <div
                  className="glass group rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1"
                  style={{
                    "--hover-glow": `${node.color}08`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 30px ${node.color}08`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 hover:scale-110 hover:rotate-[5deg]"
                      style={{ backgroundColor: node.color + "10" }}
                    >
                      <Icon size={18} style={{ color: node.color }} strokeWidth={1.5} />
                    </div>
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
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

const architectureNodes = [
  {
    id: "browserbase",
    name: "Browserbase",
    role: "Safe page inspection",
    description:
      "Opens suspicious URLs in an isolated cloud browser. Captures page structure, redirects, and form behavior without exposing the user's real browser or IP to the scam site.",
    color: "#6366f1",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    role: "Grounded explanations",
    description:
      "Takes deterministic signal output and generates a plain-English explanation a non-technical person can understand. Also produces safe next-step recommendations grounded in the actual evidence.",
    color: "#d97706",
  },
  {
    id: "redis",
    name: "Redis",
    role: "Case memory & receipts",
    description:
      "Stores evidence receipts, case records, and scam pattern signatures. Enables similar-scam retrieval so Sting can say 'we've seen 47 variants of this scam' with real data.",
    color: "#dc2626",
  },
  {
    id: "arize",
    name: "Arize / Phoenix",
    role: "Trace & eval observability",
    description:
      "Traces every AI verdict through the pipeline. Logs input signals, model reasoning, and output quality so we can prove the system is improving and catch regressions.",
    color: "#8b5cf6",
  },
  {
    id: "sentry",
    name: "Sentry",
    role: "Reliability monitoring",
    description:
      "Captures errors, performance issues, and edge cases in production. Ensures the scanning pipeline doesn't silently fail when encountering novel scam patterns.",
    color: "#362d59",
  },
  {
    id: "fetch",
    name: "Fetch.ai",
    role: "Agent coordination",
    description:
      "Enables autonomous agent-to-agent communication for distributed scam investigation — one agent inspects the page, another checks domain reputation, another generates the receipt.",
    color: "#1e3a5f",
  },
];
