import { useState, useEffect } from "react";
import StingLogo from "../assets/StingLogo";
import { FileText, Crosshair } from "lucide-react";
import { FloatingOrb } from "./Motion";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

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
        <div
          className="relative mb-14 flex justify-center"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "scale(1)" : "scale(0.8)",
            transition: "opacity 1s cubic-bezier(0.25,0.4,0.25,1), transform 1s cubic-bezier(0.25,0.4,0.25,1)",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute h-28 w-28 rounded-full border border-honey/15 animate-pulse-ring" />
            <div className="absolute h-44 w-44 rounded-full border border-red-500/8 animate-pulse-ring-delayed" />
            <div className="absolute h-60 w-60 rounded-full border border-honey/[0.04] animate-pulse-ring" style={{ animationDelay: "2s" }} />
          </div>
          <div className="animate-float-aggressive">
            <StingLogo size={88} animate />
          </div>
        </div>

        {/* Headline — aggressive, dual-audience */}
        <h1
          className="mb-7 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.08] tracking-[-0.035em]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s cubic-bezier(0.25,0.4,0.25,1) 0.3s, transform 0.8s cubic-bezier(0.25,0.4,0.25,1) 0.3s",
          }}
        >
          <span className="gradient-text-subtle">Scammers picked</span>
          <br />
          <span className="gradient-text">the wrong target.</span>
        </h1>

        {/* Subtitle — sharp, predatory */}
        <p
          className="mx-auto mb-14 max-w-md text-[16px] leading-[1.7] text-text-secondary sm:text-[17px]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s",
          }}
        >
          We hunt scams so you don&apos;t have to.
          <br className="hidden sm:block" />
          AI-powered detection. Zero mercy for fraud.
        </p>

        {/* CTAs — action-oriented */}
        <div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.8s ease 0.7s, transform 0.8s ease 0.7s",
          }}
        >
          <a
            href="#demo"
            className="group flex h-12 items-center gap-2.5 rounded-full bg-honey px-8 text-[14px] font-semibold text-surface transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-honey/20 active:scale-[0.97]"
          >
            <Crosshair size={15} className="transition-transform duration-300 group-hover:rotate-90" />
            Launch a scan
          </a>
          <a
            href="#demo"
            className="glass flex h-12 items-center gap-2.5 rounded-full px-8 text-[14px] font-medium text-text-secondary transition-all duration-300 hover:scale-[1.03] hover:text-text-primary active:scale-[0.97]"
          >
            <FileText size={14} />
            See the evidence dossier
          </a>
        </div>

        {/* Threat counter tagline */}
        <div
          className="mt-16 flex items-center justify-center gap-3"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 1s ease 1s",
          }}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-threat-blink" />
          <span className="font-mono text-[11px] tracking-wider text-red-400/70 uppercase">
            Threat detection active
          </span>
        </div>

        {/* Hackathon badge */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-medium tracking-[0.2em] text-text-muted/70 uppercase"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 1s ease 1.2s",
          }}
        >
          <span>UC Berkeley AI Hackathon 2026</span>
          <span className="hidden text-white/[0.06] sm:inline">|</span>
          <span>Clean-room implementation</span>
        </div>
      </div>
    </section>
  );
}
