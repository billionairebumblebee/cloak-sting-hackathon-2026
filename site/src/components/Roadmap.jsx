import {
  Globe,
  MessageSquare,
  Voicemail,
  MailWarning,
  Users,
  CheckCircle2,
  Hammer,
  CalendarClock,
  Sparkles,
} from "lucide-react";
import { FadeIn, SectionLabel, GlowCard } from "./Motion";

const phases = [
  {
    version: "v1",
    label: "Now",
    title: "Browser Extension",
    status: "LIVE",
    icon: Globe,
    color: "#22c55e",
    features: [
      "Real-time web scam detection",
      "Warning overlay on dangerous pages",
      "Family rescue receipts",
    ],
  },
  {
    version: "v2",
    label: "Next",
    title: "Messages Companion",
    status: "BUILDING",
    icon: MessageSquare,
    color: "#F5A623",
    features: [
      "SMS/text scam quarantine",
      "Suspicious link previews",
      "Share-to-STING from messaging apps",
    ],
  },
  {
    version: "v3",
    label: "Next",
    title: "Voicemail Guard",
    status: "PLANNED",
    icon: Voicemail,
    color: "#a855f7",
    features: [
      "AI-transcribed voicemail scanning",
      "Robocall detection",
      "Scam pattern matching on voice",
    ],
  },
  {
    version: "v4",
    label: "Future",
    title: "Email Shield",
    status: "PLANNED",
    icon: MailWarning,
    color: "#3b82f6",
    features: [
      "Phishing quarantine",
      "Attachment scanning",
      "Sender reputation scoring",
    ],
  },
  {
    version: "v5",
    label: "Vision",
    title: "Family Safety Network",
    status: "PLANNED",
    icon: Users,
    color: "#06b6d4",
    features: [
      "Shared family dashboard",
      "Elder-friendly alerts",
      "Community-sourced scam intelligence",
    ],
  },
];

const statusConfig = {
  LIVE: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    border: "border-green-500/25",
    icon: CheckCircle2,
  },
  BUILDING: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/25",
    icon: Hammer,
  },
  PLANNED: {
    bg: "bg-white/[0.04]",
    text: "text-text-muted",
    border: "border-white/[0.08]",
    icon: CalendarClock,
  },
};

function PhaseCard({ phase, index }) {
  const status = statusConfig[phase.status];
  const StatusIcon = status.icon;
  const isLive = phase.status === "LIVE";

  return (
    <FadeIn delay={0.15 + index * 0.1}>
      <div className="group relative">
        {/* Vertical timeline connector */}
        {index < phases.length - 1 && (
          <div className="absolute left-6 top-[4.5rem] -bottom-4 w-px bg-gradient-to-b from-white/[0.08] to-transparent sm:left-7" />
        )}

        <div className="flex gap-5 sm:gap-6">
          {/* Timeline node */}
          <div className="relative flex shrink-0 flex-col items-center">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl sm:h-14 sm:w-14 ${
                isLive ? "ring-1 ring-green-500/20" : ""
              }`}
              style={{ backgroundColor: phase.color + "12" }}
            >
              <phase.icon
                size={20}
                style={{ color: phase.color }}
                strokeWidth={1.5}
              />
            </div>
            {isLive && (
              <span
                className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#0a0a0f] bg-green-400"
                style={{ boxShadow: "0 0 8px rgba(74, 222, 128, 0.5)" }}
              />
            )}
          </div>

          {/* Card content */}
          <div className="glass flex-1 rounded-2xl p-6 transition-all duration-300 group-hover:ring-1 group-hover:ring-white/[0.06]">
            {/* Header row */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="font-mono text-[11px] font-bold tracking-wider text-text-muted uppercase">
                {phase.label} · {phase.version}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${status.bg} ${status.text} ${status.border}`}
              >
                <StatusIcon size={10} />
                {phase.status}
              </span>
            </div>

            <h3 className="mb-3 text-lg font-semibold tracking-[-0.01em] text-text-primary">
              {phase.title}
            </h3>

            {/* Feature list */}
            <ul className="space-y-2">
              {phase.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-[13px] leading-[1.6] text-text-secondary"
                >
                  <span
                    className="mt-[7px] h-1 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: phase.color + "80" }}
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

export default function Roadmap() {
  return (
    <section id="roadmap" className="relative px-6 py-28 sm:py-36">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-honey/[0.015] blur-[200px]" />

      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <SectionLabel>Roadmap</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-5 text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-text-primary">
              Where STING is{" "}
              <span className="gradient-text">going.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-lg text-[16px] leading-[1.7] text-text-secondary">
              Browser warnings today. A full scam-proof companion inbox
              tomorrow.
            </p>
          </FadeIn>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          {phases.map((phase, i) => (
            <PhaseCard key={phase.version} phase={phase} index={i} />
          ))}
        </div>

        {/* Disclaimer */}
        <FadeIn delay={0.8}>
          <GlowCard className="mt-12 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-honey/[0.06]">
                <Sparkles size={17} className="text-honey/70" />
              </div>
              <div>
                <h4 className="mb-1.5 text-[13px] font-semibold text-text-primary">
                  Built in public, shipped honestly
                </h4>
                <p className="text-[12px] leading-[1.7] text-text-secondary">
                  Roadmap reflects our vision. We build where platform APIs
                  allow. Companion features use share/import flows — never
                  undocumented access.
                </p>
              </div>
            </div>
          </GlowCard>
        </FadeIn>
      </div>
    </section>
  );
}
