import { Crosshair, Scan, Gavel } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem, SectionLabel } from "./Motion";

const steps = [
  {
    num: "01",
    icon: Crosshair,
    title: "Acquire target",
    desc: "Drop a suspicious link, forward a sketchy message, or let Sting lock onto the page you're on.",
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
    title: "Sting hunts",
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
    <section id="flow" className="relative px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-6xl">
        <div className="mb-20 text-center">
          <SectionLabel>How It Works</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-5 text-4xl font-bold tracking-tight text-cream sm:text-5xl">
              Three steps.{" "}
              <span className="gradient-text">Thirty seconds.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-md text-base text-text-secondary">
              The same forensic analysis a security team would run — delivered
              so fast scammers don&apos;t see it coming.
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid gap-6 lg:grid-cols-3" stagger={0.12}>
          {steps.map((step, i) => (
            <StaggerItem key={step.num}>
              <motion.div
                className="glass group relative rounded-2xl p-8 transition-all duration-500"
                whileHover={{
                  y: -4,
                  transition: { duration: 0.3 },
                }}
              >
                {/* Step connector line (desktop only) */}
                {i < steps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-gradient-to-r from-white/10 to-transparent lg:block" />
                )}

                {/* Number + icon */}
                <div className="mb-8 flex items-center gap-4">
                  <span className="font-mono text-4xl font-black text-white/[0.04]">
                    {step.num}
                  </span>
                  <motion.div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: step.color + "12" }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <step.icon size={20} style={{ color: step.color }} strokeWidth={1.5} />
                  </motion.div>
                </div>

                <h3 className="mb-3 text-xl font-bold text-cream">
                  {step.title}
                </h3>
                <p className="mb-6 text-[13px] leading-relaxed text-text-secondary">
                  {step.desc}
                </p>

                {/* Detail chips */}
                <div className="flex flex-wrap gap-2">
                  {step.details.map((d) => (
                    <span
                      key={d}
                      className="rounded-full border border-white/[0.04] bg-white/[0.02] px-3 py-1 text-[11px] text-text-muted transition-colors duration-300 group-hover:border-white/[0.08] group-hover:text-text-secondary"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
