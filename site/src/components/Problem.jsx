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
    desc: "Deepfake calls impersonating your bank, your boss, your family. Indistinguishable from real.",
  },
  {
    icon: ShoppingBag,
    title: "Fake storefronts",
    desc: "AI-generated product pages with stolen photos and prices too good to be real. Your money vanishes.",
  },
  {
    icon: KeyRound,
    title: "Cloned login pages",
    desc: "Pixel-perfect replicas of your bank or email login. One keystroke and your credentials are gone.",
  },
  {
    icon: Headset,
    title: "Fake support agents",
    desc: "AI chatbots posing as customer service, engineered to extract your credentials and drain accounts.",
  },
  {
    icon: Clock,
    title: "Weaponized urgency",
    desc: '"Act now or lose everything" \u2014 engineered panic designed to short-circuit your judgment.',
  },
  {
    icon: Bot,
    title: "AI-powered deception",
    desc: "Scammers weaponize the same AI you trust. Their fakes are getting undetectable. Sting sees through them.",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="relative px-6 py-32 sm:py-40">
      {/* Danger glow */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-danger/[0.03] blur-[120px]" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-20 max-w-2xl">
          <SectionLabel>The Threat</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-cream sm:text-5xl">
              Scams don&apos;t look
              <br />
              <span className="text-red-400/80">fake anymore.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-base leading-relaxed text-text-secondary">
              They look flawless. They sound real. They fool smart people every
              day. You need a weapon, not a warning — Sting gives you a
              plain-English verdict in seconds.
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {threats.map((threat) => (
            <StaggerItem key={threat.title}>
              <GlowCard className="p-6" glowColor="rgba(220, 38, 38, 0.06)">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/[0.06] text-red-400/60 transition-colors duration-300 group-hover:text-red-400">
                  <threat.icon size={18} strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-[15px] font-bold text-cream">
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
