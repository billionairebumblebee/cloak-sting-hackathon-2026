import { motion } from "framer-motion";
import StingLogo from "../assets/StingLogo";
import { ArrowRight, FileText } from "lucide-react";
import { FloatingOrb } from "./Motion";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 pt-20">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,166,35,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.3) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Ambient orbs */}
      <FloatingOrb color="rgba(245, 166, 35, 0.05)" size={500} x="10%" y="20%" delay={0} />
      <FloatingOrb color="rgba(230, 194, 0, 0.03)" size={400} x="70%" y="60%" delay={5} />
      <FloatingOrb color="rgba(245, 166, 35, 0.02)" size={300} x="50%" y="10%" delay={10} />

      {/* Central glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-honey/[0.03] blur-[180px]" />

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-surface to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* Logo with pulse rings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative mb-14 flex justify-center"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="absolute h-28 w-28 rounded-full border border-honey/[0.08]"
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute h-44 w-44 rounded-full border border-honey/[0.04]"
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 4, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="animate-float">
            <StingLogo size={80} />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          className="mb-7 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.08] tracking-[-0.035em]"
        >
          <span className="gradient-text-subtle">Catch the scam</span>
          <br />
          <span className="gradient-text">before it catches you.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mb-14 max-w-md text-[16px] leading-[1.7] text-text-secondary sm:text-[17px]"
        >
          An AI second opinion for suspicious links and messages.
          <br className="hidden sm:block" />
          Inspect. Explain. Protect — in seconds.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
        >
          <motion.a
            href="#demo"
            className="group flex h-12 items-center gap-2.5 rounded-full bg-honey px-8 text-[14px] font-semibold text-surface transition-all duration-300 hover:shadow-xl hover:shadow-honey/15"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Run a demo scan
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </motion.a>
          <motion.a
            href="#demo"
            className="glass flex h-12 items-center gap-2.5 rounded-full px-8 text-[14px] font-medium text-text-secondary transition-all duration-300 hover:text-text-primary"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <FileText size={14} />
            See the evidence receipt
          </motion.a>
        </motion.div>

        {/* Hackathon badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-24 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-medium tracking-[0.2em] text-text-muted/70 uppercase"
        >
          <span>UC Berkeley AI Hackathon 2026</span>
          <span className="hidden text-white/[0.06] sm:inline">|</span>
          <span>Clean-room implementation</span>
        </motion.div>
      </div>
    </section>
  );
}
