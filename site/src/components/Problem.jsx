import { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  Mic,
  ShoppingBag,
  KeyRound,
  Headset,
  Clock,
  Bot,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, SectionLabel } from "./Motion";

const threats = [
  {
    icon: Mic,
    title: "AI voice clones",
    desc: "Deepfake calls impersonating your bank, your boss, your family. Indistinguishable from real.",
    color: "#ef4444",
    size: "normal",
  },
  {
    icon: ShoppingBag,
    title: "Fake storefronts",
    desc: "AI-generated product pages with stolen photos and prices too good to be real. Your money vanishes.",
    color: "#f97316",
    size: "normal",
  },
  {
    icon: KeyRound,
    title: "Cloned login pages",
    desc: "Pixel-perfect replicas of your bank or email login. One keystroke and your credentials are gone.",
    color: "#dc2626",
    size: "normal",
  },
  {
    icon: Headset,
    title: "Fake support agents",
    desc: "AI chatbots posing as customer service, engineered to extract your credentials and drain accounts.",
    color: "#f59e0b",
    size: "normal",
  },
  {
    icon: Clock,
    title: "Weaponized urgency",
    desc: '"Act now or lose everything" — engineered panic designed to short-circuit your judgment.',
    color: "#ef4444",
    size: "normal",
  },
  {
    icon: Bot,
    title: "AI-powered deception",
    desc: "Scammers weaponize the same AI you trust. Their fakes are getting undetectable. sting sees through them.",
    color: "#dc2626",
    size: "normal",
  },
];

function ThreatCard({ threat }) {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-4, 4]);

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="glass glass-hover group relative overflow-hidden rounded-2xl p-6 cursor-default"
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Hover glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) =>
              `radial-gradient(300px circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, ${threat.color}10, transparent 60%)`
          ),
        }}
      />

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 h-20 w-20 rounded-bl-[40px] opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.08]"
        style={{ background: threat.color }}
      />

      <motion.div
        className="relative z-10 mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: threat.color + "12" }}
        whileHover={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.4 }}
      >
        <threat.icon size={19} strokeWidth={1.5} style={{ color: threat.color + "cc" }} />
      </motion.div>
      <h3 className="relative z-10 mb-2 text-[15px] font-semibold tracking-[-0.01em] text-text-primary">
        {threat.title}
      </h3>
      <p className="relative z-10 text-[14px] leading-[1.65] text-text-secondary">
        {threat.desc}
      </p>
    </motion.div>
  );
}

export default function Problem() {
  return (
    <section id="problem" className="relative px-6 py-28 sm:py-36">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-danger/[0.02] blur-[150px]" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-16 max-w-2xl">
          <SectionLabel>The Threat</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-5 text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-text-primary">
              Scams don&apos;t look
              <br />
              <span className="text-red-400/80">fake anymore.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="max-w-lg text-[16px] leading-[1.7] text-text-secondary">
              They look flawless. They sound real. They fool smart people every
              day. You need a weapon, not a warning — sting gives you a
              plain-English verdict in seconds.
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {threats.map((threat) => (
            <StaggerItem key={threat.title}>
              <ThreatCard threat={threat} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
