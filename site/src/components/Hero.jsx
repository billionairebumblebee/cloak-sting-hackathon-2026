import { useState, useEffect } from "react";
import StingLogo from "../assets/StingLogo";
import { ArrowRight, FileText } from "lucide-react";
import { FloatingOrb } from "./Motion";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

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
        <div
          className="relative mb-14 flex justify-center"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "scale(1)" : "scale(0.8)",
            transition: "opacity 1s cubic-bezier(0.25,0.4,0.25,1), transform 1s cubic-bezier(0.25,0.4,0.25,1)",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute h-28 w-28 rounded-full border border-honey/[0.08] animate-pulse-ring" />
            <div className="absolute h-44 w-44 rounded-full border border-honey/[0.04] animate-pulse-ring-delayed" />
          </div>
          <div className="animate-float">
            <StingLogo size={80} />
          </div>
        </div>

        {/* Headline */}
        <h1
          className="mb-7 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.08] tracking-[-0.035em]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s cubic-bezier(0.25,0.4,0.25,1) 0.3s, transform 0.8s cubic-bezier(0.25,0.4,0.25,1) 0.3s",
          }}
        >
          <span className="gradient-text-subtle">Catch the scam</span>
          <br />
          <span className="gradient-text">before it catches you.</span>
        </h1>

        {/* Subtitle */}
        <p
          className="mx-auto mb-14 max-w-md text-[16px] leading-[1.7] text-text-secondary sm:text-[17px]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s",
          }}
        >
          An AI second opinion for suspicious links and messages.
          <br className="hidden sm:block" />
          Inspect. Explain. Protect — in seconds.
        </p>

        {/* CTAs */}
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
            className="group flex h-12 items-center gap-2.5 rounded-full bg-honey px-8 text-[14px] font-semibold text-surface transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-honey/15 active:scale-[0.97]"
          >
            Run a demo scan
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </a>
          <a
            href="#demo"
            className="glass flex h-12 items-center gap-2.5 rounded-full px-8 text-[14px] font-medium text-text-secondary transition-all duration-300 hover:scale-[1.03] hover:text-text-primary active:scale-[0.97]"
          >
            <FileText size={14} />
            See the evidence receipt
          </a>
        </div>

        {/* Hackathon badge */}
        <div
          className="mt-24 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-medium tracking-[0.2em] text-text-muted/70 uppercase"
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
