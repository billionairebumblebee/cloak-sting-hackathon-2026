import { useState, useEffect } from "react";
import StingLogo from "../assets/StingLogo";
import { FileText, Crosshair, Phone } from "lucide-react";
import { FloatingOrb } from "./Motion";

// Layer 3: fast foreground sparkles (2-6s cycles)
const sparkles = [
  { left: "5%", top: "12%", size: 3, delay: 0, duration: 2.5 },
  { left: "12%", top: "65%", size: 2, delay: 0.8, duration: 3 },
  { left: "22%", top: "28%", size: 3.5, delay: 1.5, duration: 2 },
  { left: "30%", top: "78%", size: 1.5, delay: 0.3, duration: 4 },
  { left: "38%", top: "8%", size: 2.5, delay: 2, duration: 2.5 },
  { left: "48%", top: "55%", size: 2, delay: 1, duration: 3.5 },
  { left: "55%", top: "18%", size: 3, delay: 0.5, duration: 2 },
  { left: "62%", top: "72%", size: 2, delay: 2.5, duration: 3 },
  { left: "70%", top: "35%", size: 3.5, delay: 0.2, duration: 2.5 },
  { left: "78%", top: "58%", size: 2, delay: 1.8, duration: 3 },
  { left: "85%", top: "15%", size: 2.5, delay: 3, duration: 2 },
  { left: "92%", top: "45%", size: 2, delay: 0.7, duration: 4 },
  { left: "18%", top: "42%", size: 1.5, delay: 2.2, duration: 3 },
  { left: "42%", top: "88%", size: 3, delay: 1.2, duration: 2.5 },
  { left: "75%", top: "8%", size: 2, delay: 3.2, duration: 2 },
  { left: "33%", top: "35%", size: 2.5, delay: 0.9, duration: 3.5 },
  { left: "58%", top: "82%", size: 2, delay: 2.8, duration: 2.5 },
  { left: "88%", top: "68%", size: 3, delay: 1.5, duration: 3 },
  { left: "10%", top: "88%", size: 2, delay: 3.5, duration: 2 },
  { left: "95%", top: "30%", size: 2.5, delay: 0.4, duration: 3.5 },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 pt-20">
      {/* Aurora effect */}
      <div className="aurora" />

      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,166,35,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.3) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Ambient orbs */}
      <FloatingOrb color="rgba(255, 167, 38, 0.10)" size={600} x="5%" y="15%" delay={0} />
      <FloatingOrb color="rgba(139, 92, 246, 0.07)" size={500} x="70%" y="55%" delay={4} />
      <FloatingOrb color="rgba(255, 143, 0, 0.06)" size={450} x="50%" y="5%" delay={8} />
      <FloatingOrb color="rgba(10, 150, 150, 0.05)" size={400} x="85%" y="20%" delay={12} />

      {/* Hero spotlight — radial glow behind headline */}
      <div className="hero-spotlight" />

      {/* Central threat glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-honey/[0.08] blur-[150px]" />

      {/* Red danger undercurrent */}
      <div className="pointer-events-none absolute top-2/3 left-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/[0.03] blur-[180px]" />

      {/* Purple accent layer */}
      <div className="pointer-events-none absolute top-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/[0.05] blur-[120px]" />

      {/* Sparkle field */}
      <div className="sparkle-field">
        {sparkles.map((s, i) => (
          <div
            key={i}
            className="sparkle-static"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

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

        {/* Headline with glow */}
        <h1
          className="mb-7 text-[clamp(3rem,7vw,6rem)] font-black leading-[1.02] tracking-[-0.04em]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s cubic-bezier(0.25,0.4,0.25,1) 0.3s, transform 0.8s cubic-bezier(0.25,0.4,0.25,1) 0.3s",
          }}
        >
          <span className="gradient-text-subtle text-glow-subtle">Scammers picked</span>
          <br />
          <span className="gradient-text text-glow-honey">the wrong target.</span>
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
          We hunt scams so you don&apos;t have to.
          <br className="hidden sm:block" />
          Voice calls. Links. Messages. Zero mercy for fraud.
        </p>

        {/* CTAs with glow */}
        <div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.8s ease 0.7s, transform 0.8s ease 0.7s",
          }}
        >
          <a
            href="#voice-scanner"
            className="group cta-glow-green flex h-12 items-center gap-2.5 rounded-full bg-[#13ef93] px-8 text-[14px] font-semibold text-surface transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
          >
            <Phone size={15} />
            Scan a suspicious call
          </a>
          <a
            href="#demo"
            className="group cta-glow flex h-12 items-center gap-2.5 rounded-full bg-honey px-8 text-[14px] font-semibold text-surface transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
          >
            <Crosshair size={15} className="transition-transform duration-300 group-hover:rotate-90" />
            Scan links &amp; text
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
