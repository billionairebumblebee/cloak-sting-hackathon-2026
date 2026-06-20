import StingLogo from "../assets/StingLogo";
import { ArrowRight, FileText } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,166,35,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-honey/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="animate-fade-in-up mb-8 flex justify-center">
          <div className="animate-pulse-glow rounded-2xl p-4">
            <StingLogo size={96} />
          </div>
        </div>

        <h1 className="animate-fade-in-up stagger-1 mb-6 text-5xl font-extrabold leading-tight tracking-tight text-cream sm:text-6xl lg:text-7xl">
          Catch the scam
          <br />
          <span className="text-honey">before it catches you.</span>
        </h1>

        <p className="animate-fade-in-up stagger-2 mx-auto mb-10 max-w-2xl text-lg text-text-secondary sm:text-xl">
          An AI second opinion for suspicious links and messages. Sting inspects,
          explains, and gives you a clear next step — in seconds.
        </p>

        <div className="animate-fade-in-up stagger-3 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#demo"
            className="group flex items-center gap-2 rounded-xl bg-honey px-8 py-4 text-lg font-bold text-ink transition-all hover:bg-honey-light hover:shadow-lg hover:shadow-honey/20"
          >
            Run a demo scan
            <ArrowRight
              size={20}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
          <a
            href="#demo"
            className="flex items-center gap-2 rounded-xl border border-border px-8 py-4 text-lg font-medium text-text-secondary transition-all hover:border-honey/50 hover:text-cream"
          >
            <FileText size={20} />
            See the evidence receipt
          </a>
        </div>

        <div className="animate-fade-in-up stagger-4 mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-medium tracking-wide text-text-secondary uppercase">
          <span>UC Berkeley AI Hackathon 2026</span>
          <span className="hidden sm:inline">|</span>
          <span>Built during hacking period</span>
          <span className="hidden sm:inline">|</span>
          <span>Clean-room implementation</span>
        </div>
      </div>
    </section>
  );
}
