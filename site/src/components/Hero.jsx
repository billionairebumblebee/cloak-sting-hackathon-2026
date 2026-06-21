import { motion } from "framer-motion";
import StingLogo from "../assets/StingLogo";
import { FileText, Crosshair } from "lucide-react";
import { FloatingOrb } from "./Motion";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 pt-20">
      {/* Background grid — threat matrix */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,166,35,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.3) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Ambient orbs — danger-tinted */}
      <FloatingOrb color="rgba(245, 166, 35, 0.05)" size={500} x="10%" y="20%" delay={0} />
      <FloatingOrb color="rgba(255, 68, 68, 0.03)" size={400} x="70%" y="60%" delay={5} />
      <FloatingOrb color="rgba(245, 166, 35, 0.03)" size={300} x="50%" y="10%" delay={10} />

      {/* Central threat glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-honey/[0.04] blur-[180px]" />

      {/* Red danger undercurrent */}
      <div className="pointer-events-none absolute top-2/3 left-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/[0.02] blur-[200px]" />

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-surface to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* Logo with threat pulse rings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative mb-14 flex justify-center"
        >
          {/* Threat pulse rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="absolute h-28 w-28 rounded-full border border-honey/15"
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute h-44 w-44 rounded-full border border-red-500/8"
              animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 3, delay: 1, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute h-60 w-60 rounded-full border border-honey/[0.04]"
              animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0, 0.15] }}
              transition={{ duration: 3, delay: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="animate-float-aggressive">
            <StingLogo size={88} animate />
          </div>
        </motion.div>

        {/* Headline — aggressive, dual-audience */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          className="mb-7 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.08] tracking-[-0.035em]"
        >
          <span className="gradient-text-subtle">Scammers picked</span>
          <br />
          <span className="gradient-text">the wrong target.</span>
        </motion.h1>

        {/* Subtitle — sharp, predatory */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mb-14 max-w-md text-[16px] leading-[1.7] text-text-secondary sm:text-[17px]"
        >
          We hunt scams so you don&apos;t have to.
          <br className="hidden sm:block" />
          AI-powered detection. Zero mercy for fraud.
        </motion.p>

        {/* CTAs — action-oriented */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
        >
          <motion.a
            href="#demo"
            className="group flex h-12 items-center gap-2.5 rounded-full bg-honey px-8 text-[14px] font-semibold text-surface transition-all duration-300 hover:shadow-xl hover:shadow-honey/20"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Crosshair size={15} className="transition-transform duration-300 group-hover:rotate-90" />
            Launch a scan
          </motion.a>
          <motion.a
            href="#demo"
            className="glass flex h-12 items-center gap-2.5 rounded-full px-8 text-[14px] font-medium text-text-secondary transition-all duration-300 hover:text-text-primary"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <FileText size={14} />
            See the evidence dossier
          </motion.a>
        </motion.div>

        {/* Threat counter tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 flex items-center justify-center gap-3"
        >
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="font-mono text-[11px] tracking-wider text-red-400/70 uppercase">
            Threat detection active
          </span>
        </motion.div>

        {/* Hackathon badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-medium tracking-[0.2em] text-text-muted/70 uppercase"
        >
          <span>UC Berkeley AI Hackathon 2026</span>
          <span className="hidden text-white/[0.06] sm:inline">|</span>
          <span>Clean-room implementation</span>
        </motion.div>
      </div>
    </section>
  );
}
