import { Crosshair, Scan, Gavel } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, SectionLabel } from "./Motion";

const steps = [
  {
    num: "01",
    icon: Crosshair,
    title: "Acquire target",
    desc: "Drop a suspicious link, forward a sketchy message, or let sting lock onto the page you're on.",
    details: [
      "SMS messages",
      "Email links",
      "Shopping pages",
      "Login screens",
      "QR codes",
    ],
    color: "#f5a623",
  },
  {
    num: "02",
    icon: Scan,
    title: "sting hunts",
    desc: "Deterministic + AI analysis tears apart every signal a scammer tries to hide. Nothing escapes.",
    details: [
      "Domain forensics",
      "Pressure tactics",
      "Page claims vs reality",
      "Redirect traps",
      "Form behavior",
      "Impersonation patterns",
    ],
    color: "#dc2626",
  },
  {
    num: "03",
    icon: Gavel,
    title: "Verdict delivered",
    desc: "Get a plain-English conviction, threat score, evidence dossier, and exactly how to strike back.",
    details: [
      "Threat score & level",
      "Signal breakdown",
      "Plain-English verdict",
      "Counter-strike steps",
      "Shareable evidence dossier",
    ],
    color: "#f5a623",
  },
];

export default function ProductFlow() {
  return (
    <section id="flow" className="relative px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <SectionLabel>How It Works</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-5 text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-text-primary">
              Three steps.{" "}
              <span className="text-text-muted">Thirty seconds.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-md text-[16px] leading-[1.7] text-text-secondary">
              The same forensic analysis a security team would run — delivered so
              fast scammers don&apos;t see it coming.
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid gap-4 lg:grid-cols-3" stagger={0.1}>
          {steps.map((step, i) => (
            <StaggerItem key={step.num}>
              <div
                className="glass group relative rounded-2xl p-8"
              >
                {/* Step connector line (desktop only) */}
                {i < steps.length - 1 && (
                  <div className="absolute -right-2 top-1/2 hidden h-px w-4 bg-gradient-to-r from-white/[0.06] to-transparent lg:block" />
                )}

                {/* Number + icon */}
                <div className="mb-8 flex items-center gap-4">
                  <span className="font-mono text-4xl font-bold text-white/[0.03]">
                    {step.num}
                  </span>
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: step.color + "0d" }}
                  >
                    <step.icon size={19} style={{ color: step.color }} strokeWidth={1.5} />
                  </div>
                </div>

                <h3 className="mb-3 text-lg font-semibold tracking-[-0.01em] text-text-primary">
                  {step.title}
                </h3>
                <p className="mb-6 text-[14px] leading-[1.65] text-text-secondary">
                  {step.desc}
                </p>

                {/* Detail chips */}
                <div className="flex flex-wrap gap-2">
                  {step.details.map((d) => (
                    <span
                      key={d}
                      className="rounded-full border border-white/[0.04] bg-white/[0.02] px-3 py-1 text-[12px] text-text-secondary"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
