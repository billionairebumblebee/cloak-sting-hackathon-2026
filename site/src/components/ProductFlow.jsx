import { useRef } from "react";
import { motion, useMotionValue, useTransform, useInView } from "framer-motion";
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
    gradient: "from-amber-500/20 to-orange-500/5",
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
    gradient: "from-red-500/20 to-rose-500/5",
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
    gradient: "from-amber-500/20 to-yellow-500/5",
  },
];

function StepCard({ step, index, totalSteps }) {
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
      className="glass group relative rounded-2xl p-8 overflow-hidden"
      onMouseMove={handleMouseMove}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
    >
      {/* Hover glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) =>
              `radial-gradient(350px circle at ${x}px ${y}px, ${step.color}08, transparent 60%)`
          ),
        }}
      />

      {/* Top gradient accent */}
      <div
        className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${step.gradient} opacity-60`}
      />

      {/* Step connector line (desktop only) */}
      {index < totalSteps - 1 && (
        <motion.div
          className="absolute -right-2 top-1/2 hidden h-px w-4 lg:block"
          style={{ background: `linear-gradient(to right, ${step.color}30, transparent)` }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Number + icon */}
      <div className="relative z-10 mb-8 flex items-center gap-4">
        <motion.span
          className="font-mono text-5xl font-bold"
          style={{ color: step.color + "08" }}
          whileHover={{ color: step.color + "15" }}
        >
          {step.num}
        </motion.span>
        <motion.div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: step.color + "10" }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <step.icon size={20} style={{ color: step.color }} strokeWidth={1.5} />
        </motion.div>
      </div>

      <h3 className="relative z-10 mb-3 text-lg font-semibold tracking-[-0.01em] text-text-primary">
        {step.title}
      </h3>
      <p className="relative z-10 mb-6 text-[14px] leading-[1.65] text-text-secondary">
        {step.desc}
      </p>

      {/* Detail chips */}
      <div className="relative z-10 flex flex-wrap gap-2">
        {step.details.map((d, i) => (
          <motion.span
            key={d}
            className="rounded-full border border-white/[0.04] bg-white/[0.02] px-3 py-1.5 text-[12px] text-text-secondary transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.05] hover:text-text-primary"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 + 0.3 }}
          >
            {d}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

function AnimatedConnector() {
  return (
    <div className="hidden lg:flex items-center justify-center py-0">
      <motion.div
        className="h-8 w-px bg-gradient-to-b from-honey/30 via-honey/10 to-transparent"
        animate={{ scaleY: [0, 1], opacity: [0, 1] }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
    </div>
  );
}

export default function ProductFlow() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="flow" className="relative px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl" ref={ref}>
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

        {/* Animated progress line (desktop) */}
        {isInView && (
          <div className="relative mb-12 hidden lg:block">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-white/[0.03]" />
            <motion.div
              className="absolute left-0 top-1/2 h-px bg-gradient-to-r from-honey/40 via-red-500/30 to-honey/40"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            />
            <div className="flex justify-between">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2"
                  style={{
                    borderColor: step.color + "40",
                    backgroundColor: step.color + "10",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.4, type: "spring", stiffness: 200 }}
                >
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: step.color }} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <StaggerContainer className="grid gap-4 lg:grid-cols-3" stagger={0.12}>
          {steps.map((step, i) => (
            <StaggerItem key={step.num}>
              <StepCard step={step} index={i} totalSteps={steps.length} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
