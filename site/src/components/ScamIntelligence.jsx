import { Network, ArrowRight, AlertTriangle } from "lucide-react";
import { FadeIn, SectionLabel, GlowCard } from "./Motion";

const clusterNodes = [
  { id: "a", label: "secure-pay-now.biz", x: "15%", y: "30%" },
  { id: "b", label: "verify-account-fast.net", x: "50%", y: "10%" },
  { id: "c", label: "urgent-refund-claim.org", x: "75%", y: "45%" },
];

const sharedIndicators = [
  "Same hosting provider (AS-BULLETPROOF-204)",
  "Same payment processor (flagged)",
  "Similar urgency language patterns",
];

export default function ScamIntelligence() {
  return (
    <section id="scam-intelligence" className="relative px-6 py-28 sm:py-36">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-honey/[0.015] blur-[200px]" />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <SectionLabel>Scam Intelligence</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-5 text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-text-primary">
              From one receipt to a{" "}
              <span className="gradient-text">network.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-lg text-[16px] leading-[1.7] text-text-secondary">
              STING clusters scam indicators into suspected profiles — building
              shared intelligence.
            </p>
          </FadeIn>
        </div>

        {/* Network visualization */}
        <FadeIn delay={0.3}>
          <GlowCard className="overflow-hidden p-8">
            {/* Mock network graph */}
            <div className="relative mx-auto mb-8 h-64 max-w-3xl sm:h-80">
              {/* Connection lines (SVG) */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 400 200"
                preserveAspectRatio="xMidYMid meet"
                fill="none"
              >
                {/* a → b */}
                <line
                  x1="80" y1="75" x2="200" y2="30"
                  stroke="rgba(245, 166, 35, 0.25)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
                {/* b → c */}
                <line
                  x1="200" y1="30" x2="310" y2="105"
                  stroke="rgba(245, 166, 35, 0.25)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                />
                {/* a → c */}
                <line
                  x1="80" y1="75" x2="310" y2="105"
                  stroke="rgba(245, 166, 35, 0.15)"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                  className="animate-pulse"
                  style={{ animationDelay: "1s" }}
                />
              </svg>

              {/* Domain nodes */}
              {clusterNodes.map((node) => (
                <div
                  key={node.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: node.x, top: node.y }}
                >
                  <div className="group flex flex-col items-center gap-2">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-red-500/20 bg-red-500/[0.08] shadow-lg shadow-red-500/5 sm:h-12 sm:w-12">
                      <Network
                        size={18}
                        strokeWidth={1.5}
                        className="text-red-400"
                      />
                      <div className="absolute -inset-1 animate-pulse rounded-full border border-red-500/10" />
                    </div>
                    <span className="max-w-[120px] truncate rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] text-text-secondary sm:max-w-none sm:text-[11px]">
                      {node.label}
                    </span>
                  </div>
                </div>
              ))}

              {/* Central cluster label */}
              <div className="absolute left-1/2 top-2/3 -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center gap-2 rounded-full border border-honey/20 bg-honey/[0.06] px-4 py-2">
                  <AlertTriangle size={13} className="text-honey" />
                  <span className="text-[11px] font-semibold text-honey/90">
                    Suspected scam cluster
                  </span>
                </div>
              </div>
            </div>

            {/* Shared indicators */}
            <div className="mx-auto max-w-2xl">
              <h4 className="mb-4 text-center text-[11px] font-medium tracking-widest text-text-muted uppercase">
                Shared indicators
              </h4>
              <div className="flex flex-wrap justify-center gap-3">
                {sharedIndicators.map((indicator) => (
                  <div
                    key={indicator}
                    className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5"
                  >
                    <ArrowRight
                      size={11}
                      className="shrink-0 text-honey/60"
                    />
                    <span className="text-[12px] text-text-secondary">
                      {indicator}
                    </span>
                  </div>
                ))}
              </div>

              {/* Report stats */}
              <FadeIn delay={0.5}>
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-6 py-3">
                    <span className="font-mono text-2xl font-bold text-text-primary">
                      47
                    </span>
                    <span className="text-[13px] text-text-secondary">
                      reports from
                    </span>
                    <span className="font-mono text-2xl font-bold text-honey">
                      12
                    </span>
                    <span className="text-[13px] text-text-secondary">
                      families
                    </span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </GlowCard>
        </FadeIn>

        {/* Disclaimer */}
        <FadeIn delay={0.6}>
          <p className="mx-auto mt-6 max-w-2xl text-center text-[11px] leading-[1.7] text-text-muted">
            Profiles represent suspected patterns from reported indicators.
            Verification by authorities required.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
