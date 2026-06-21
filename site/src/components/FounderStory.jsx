import { Users, Shield, Heart } from "lucide-react";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  GlowCard,
  SectionLabel,
} from "./Motion";

const audiences = [
  {
    icon: Users,
    title: "Families with elderly parents",
    desc: "Set it up once on Mom's phone and get peace of mind. STING watches her inbox so you don't have to.",
  },
  {
    icon: Shield,
    title: "Non-technical internet users",
    desc: "No jargon, no settings to tweak. Plain-English verdicts anyone can understand at a glance.",
  },
  {
    icon: Heart,
    title: "Community volunteers who want to help",
    desc: "Help your neighbors stay safe. Share scam alerts and protect the people around you.",
  },
];

export default function FounderStory() {
  return (
    <section id="why" className="relative px-6 py-28 sm:py-36">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/3 h-[500px] w-[500px] rounded-full bg-honey/[0.03] blur-[160px]" />

      <div className="mx-auto max-w-4xl">
        <SectionLabel>Why We Built This</SectionLabel>

        <FadeIn delay={0.1}>
          <h2 className="mb-10 text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-text-primary">
            Built because someone&apos;s grandma
            <br />
            <span className="text-honey">got scammed.</span>
          </h2>
        </FadeIn>

        <div className="mb-20 max-w-2xl space-y-5">
          <FadeIn delay={0.2}>
            <p className="text-[16px] leading-[1.75] text-text-secondary">
              Scam calls, fake texts, phishing emails — they all target people
              who trust too easily. The victims aren&apos;t careless. They&apos;re
              our parents, grandparents, and neighbors. People who pick up the
              phone because someone might need help.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-[16px] leading-[1.75] text-text-secondary">
              We realized warnings don&apos;t work when they&apos;re buried in
              fine print or hidden behind three menus. They need to be dead
              simple — one tap, plain English, shareable with family. If
              your&nbsp;kid can&apos;t explain it to Grandma, it&apos;s too
              complicated.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="text-[16px] leading-[1.75] text-text-secondary">
              So we&apos;re building an inbox that quarantines scams before they
              reach vulnerable people — messages, voicemail, email — all in one
              place. It&apos;s a hackathon project today, but the vision is
              bigger: nobody&apos;s grandma should lose her savings to a fake
              IRS&nbsp;call.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.45}>
          <h3 className="mb-6 text-[13px] font-semibold tracking-[0.15em] text-honey/70 uppercase">
            Who STING is for
          </h3>
        </FadeIn>

        <StaggerContainer
          className="grid gap-4 sm:grid-cols-3"
          stagger={0.08}
        >
          {audiences.map((a) => (
            <StaggerItem key={a.title}>
              <GlowCard className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-honey/[0.07] text-honey/80">
                  <a.icon size={18} strokeWidth={1.5} />
                </div>
                <h4 className="mb-2 text-[15px] font-semibold tracking-[-0.01em] text-text-primary">
                  {a.title}
                </h4>
                <p className="text-[14px] leading-[1.65] text-text-secondary">
                  {a.desc}
                </p>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
