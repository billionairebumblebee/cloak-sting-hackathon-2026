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
    <section id="problem" className="relative px-6 py-32 sm:py-40">
      <div className="pointer-events-none absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-danger/[0.02] blur-[120px]" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-20 max-w-2xl">
          <SectionLabel>The Problem</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-cream sm:text-5xl">
              Scams don&apos;t look
              <br />
              <span className="text-text-secondary">fake anymore.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-base leading-relaxed text-text-secondary">
              Normal people need a fast, understandable warning — not a 40-page
              security report. Sting gives you a plain-English verdict in seconds.
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {threats.map((threat) => (
            <StaggerItem key={threat.title}>
              <GlowCard className="p-6" glowColor="rgba(220, 38, 38, 0.05)">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03] text-text-secondary transition-colors duration-300 group-hover:text-honey">
                  <threat.icon size={18} strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-[15px] font-semibold text-cream">
                  {threat.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-text-secondary">
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
