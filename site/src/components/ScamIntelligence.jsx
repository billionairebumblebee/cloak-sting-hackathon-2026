import { Network, Link2, Shield, Clock } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, SectionLabel } from "./Motion";

const mockClusters = [
  {
    name: "Fake Bank Cluster #1",
    risk: "critical",
    reports: 3,
    domains: [
      "login.secure-banking-verify.example",
      "update.secure-banking-verify.example",
      "verify.secure-banking-verify.example",
    ],
    indicators: ["Credential harvesting", "Urgency pressure", "Brand impersonation"],
    payment: [],
    firstSeen: "Jun 15",
    lastSeen: "Jun 17",
  },
  {
    name: "Prize Claim Network #2",
    risk: "critical",
    reports: 3,
    domains: [
      "prizes-winner-2026.top",
      "mega-prize-claim.click",
      "lucky-draw-rewards.xyz",
    ],
    indicators: ["Fee-advance fraud", "Deadline pressure", "Novelty TLDs"],
    payment: ["Gift cards", "Processing fees"],
    firstSeen: "Jun 14",
    lastSeen: "Jun 18",
  },
];

function ClusterCard({ cluster }) {
  return (
    <div className="glass group relative overflow-hidden rounded-2xl p-6">
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-honey to-transparent opacity-60" />

      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-lg font-bold text-text-primary">{cluster.name}</h3>
        <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-red-400">
          {cluster.risk}
        </span>
      </div>

      {/* Meta */}
      <div className="mb-5 flex items-center gap-4 text-[13px] text-text-secondary">
        <span className="flex items-center gap-1.5">
          <Network size={13} className="text-honey" />
          {cluster.reports} reports
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={13} className="text-text-muted" />
          {cluster.firstSeen} – {cluster.lastSeen}
        </span>
      </div>

      {/* Network mini-visualization */}
      <div className="relative mb-5 flex h-24 items-center justify-center rounded-xl bg-black/30">
        {/* Center node */}
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-honey/50 bg-honey/10">
          <Link2 size={14} className="text-honey" />
        </div>
        {/* Orbiting nodes */}
        {cluster.domains.slice(0, 3).map((_, i) => {
          const angle = (i * 120 - 90) * (Math.PI / 180);
          const r = 38;
          const x = 50 + r * Math.cos(angle);
          const y = 50 + r * Math.sin(angle);
          return (
            <div
              key={i}
              className="absolute h-6 w-6 rounded-full border border-purple-400/40 bg-purple-500/10"
              style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
            />
          );
        })}
        {/* Connection lines via SVG */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {cluster.domains.slice(0, 3).map((_, i) => {
            const angle = (i * 120 - 90) * (Math.PI / 180);
            const r = 38;
            const x = 50 + r * Math.cos(angle);
            const y = 50 + r * Math.sin(angle);
            return (
              <line key={i} x1="50" y1="50" x2={x} y2={y} stroke="rgba(245,166,35,0.2)" strokeWidth="0.5" />
            );
          })}
        </svg>
      </div>

      {/* Linked domains */}
      <div className="mb-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Linked Domains
        </p>
        <div className="space-y-1">
          {cluster.domains.map((d) => (
            <p key={d} className="font-mono text-[12px] text-text-secondary">{d}</p>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Shared Indicators
        </p>
        <div className="flex flex-wrap gap-1.5">
          {cluster.indicators.map((ind) => (
            <span
              key={ind}
              className="rounded-full border border-white/[0.04] bg-white/[0.02] px-2.5 py-0.5 text-[11px] text-text-secondary"
            >
              {ind}
            </span>
          ))}
          {cluster.payment.map((p) => (
            <span
              key={p}
              className="rounded-full border border-red-500/20 bg-red-500/5 px-2.5 py-0.5 text-[11px] text-red-300"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ScamIntelligence() {
  return (
    <section id="intelligence" className="relative px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <SectionLabel>Scam Intelligence</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-5 text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-text-primary">
              From one receipt to a{" "}
              <span className="text-honey">suspected network.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-lg text-[16px] leading-[1.7] text-text-secondary">
              STING clusters reported scam indicators into infrastructure profiles — connecting
              domains, payment methods, and tactics to suspected operations.
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid gap-6 lg:grid-cols-2" stagger={0.15}>
          {mockClusters.map((cluster) => (
            <StaggerItem key={cluster.name}>
              <ClusterCard cluster={cluster} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Disclaimer */}
        <FadeIn delay={0.4}>
          <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-red-500/10 bg-red-500/[0.03] px-6 py-4 text-center">
            <div className="mb-1 flex items-center justify-center gap-2">
              <Shield size={14} className="text-red-400" />
              <span className="text-[12px] font-semibold uppercase tracking-wider text-red-400">
                Safety Disclaimer
              </span>
            </div>
            <p className="text-[13px] leading-[1.6] text-text-secondary">
              Profiles represent patterns from reported indicators. They do not identify individuals
              or make legal conclusions. Verification by appropriate authorities is required before
              any action is taken.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
