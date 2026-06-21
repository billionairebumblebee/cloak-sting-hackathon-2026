import {
  Mic,
  ShoppingBag,
  KeyRound,
  Headset,
  Clock,
  Bot,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, GlowCard, SectionLabel } from "./Motion";

const threats = [
  {
    icon: Mic,
    title: "AI voice clones",
    desc: "Deepfake calls that sound like your bank, your boss, or your family.",
  },
  {
    icon: ShoppingBag,
    title: "Fake stores",
    desc: "AI-generated product pages with stolen photos and impossible prices.",
  },
  {
    icon: KeyRound,
    title: "Cloned login pages",
    desc: "Pixel-perfect copies of your bank, email, or social media login.",
  },
  {
    icon: Headset,
    title: "Fake support agents",
    desc: 'AI chatbots posing as customer service to extract your credentials.',
  },
  {
    icon: Clock,
    title: "Urgency tactics",
    desc: '"Act now or lose access" — engineered panic to bypass your judgment.',
  },
  {
    icon: Bot,
    title: "AI-powered deception",
    desc: "Scammers use the same AI tools you trust to make fakes undetectable.",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="relative px-6 py-28 sm:py-36">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-danger/[0.015] blur-[150px]" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-16 max-w-2xl">
          <SectionLabel>The Problem</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-5 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.12] tracking-[-0.025em] text-text-primary sm:text-4xl">
              Scams don&apos;t look
              <br />
              <span className="text-text-muted">fake anymore.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="max-w-lg text-[15px] leading-[1.7] text-text-secondary">
              Normal people need a fast, understandable warning — not a 40-page
              security report. Sting gives you a plain-English verdict in seconds.
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {threats.map((threat) => (
            <StaggerItem key={threat.title}>
              <GlowCard className="p-6" glowColor="rgba(220, 38, 38, 0.04)">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03] text-text-muted transition-colors duration-300 group-hover:text-honey">
                  <threat.icon size={18} strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-[14px] font-semibold tracking-[-0.01em] text-text-primary">
                  {threat.title}
                </h3>
                <p className="text-[13px] leading-[1.65] text-text-secondary">
                  {threat.desc}
                </p>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
