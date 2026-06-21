import { Shield, Users, MessageCircle } from "lucide-react";
import { FadeIn, SectionLabel, StaggerContainer, StaggerItem, GlowCard } from "./Motion";

const features = [
  {
    icon: Shield,
    title: "One-tap rescue receipt",
    description:
      "Blocked scam → shareable evidence your family can understand. One tap turns a threat into proof anyone can read.",
  },
  {
    icon: Users,
    title: "Trusted contacts",
    description:
      "Coming soon: designate people who get notified when you're in danger. Your safety circle, always in the loop.",
  },
  {
    icon: MessageCircle,
    title: "Plain-English verdicts",
    description:
      'No jargon, just "This is a scam because..." in words anyone can read. Clarity when it matters most.',
  },
];

export default function FamilyRescue() {
  return (
    <section id="family-rescue" className="relative px-6 py-28 sm:py-36">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-honey/[0.02] blur-[200px]" />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <SectionLabel>Family Rescue</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-5 text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-text-primary">
              Your family&apos;s{" "}
              <span className="gradient-text">safety net.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-lg text-[16px] leading-[1.7] text-text-secondary">
              STING doesn&apos;t just warn you — it helps you ask for help.
            </p>
          </FadeIn>
        </div>

        {/* Feature cards */}
        <StaggerContainer className="grid gap-6 sm:grid-cols-3" stagger={0.12}>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <StaggerItem key={feature.title}>
                <GlowCard className="group h-full p-8 transition-all duration-300 hover:scale-[1.02]">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-honey/15 bg-honey/[0.06]">
                    <Icon size={22} strokeWidth={1.5} className="text-honey" />
                  </div>
                  <h3 className="mb-3 text-[17px] font-semibold text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-[13px] leading-[1.7] text-text-secondary">
                    {feature.description}
                  </p>
                </GlowCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
