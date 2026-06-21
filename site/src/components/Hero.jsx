import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import StingLogo from "../assets/StingLogo";
import { Crosshair, Phone } from "lucide-react";
import { FloatingOrb, MagneticButton } from "./Motion";

const sparkles = Array.from({ length: 24 }, (_, i) => ({
  left: `${5 + (i * 3.8) % 90}%`,
  top: `${8 + ((i * 7.3 + 13) % 84)}%`,
  size: 1.5 + (i % 3),
  delay: i * 0.2,
  duration: 2 + (i % 3),
}));

const letterVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -90 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      delay: 0.6 + i * 0.03,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

const wordVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(12px)" },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      delay: 1.0 + i * 0.06,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

function AnimatedHeadline({ text, className, startDelay = 0.6 }) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          custom={i}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
            visible: (i) => ({
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: {
                duration: 0.6,
                delay: startDelay + i * 0.025,
                ease: [0.25, 0.4, 0.25, 1],
              },
            }),
          }}
          style={{ display: char === " " ? "inline" : "inline-block" }}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 pt-20"
    >
      {/* Aurora effect */}
      <div className="aurora" />

      {/* Background grid with parallax */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          y: bgY,
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

      {/* Hero spotlight */}
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

      <motion.div
        className="relative z-10 mx-auto max-w-3xl text-center"
        style={{ opacity, scale }}
      >
        {/* Logo with threat pulse rings */}
        <motion.div
          className="relative mb-14 flex justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.2,
            ease: [0.25, 0.4, 0.25, 1],
            scale: { type: "spring", stiffness: 100, damping: 15 },
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="absolute h-28 w-28 rounded-full border border-honey/15"
              animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.6, 0.2, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute h-44 w-44 rounded-full border border-red-500/8"
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            />
            <motion.div
              className="absolute h-60 w-60 rounded-full border border-honey/[0.04]"
              animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.6, 0.2, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </div>
          <motion.div
            animate={{
              y: [0, -8, 4, 0],
              rotate: [0, -1, 1, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <StingLogo size={88} animate />
          </motion.div>
        </motion.div>

        {/* Headline with character-by-character reveal */}
        <h1 className="mb-7 text-[clamp(3rem,7vw,6rem)] font-black leading-[1.02] tracking-[-0.04em]">
          <AnimatedHeadline
            text="Scammers picked"
            className="gradient-text-subtle text-glow-subtle"
            startDelay={0.4}
          />
          <br />
          <AnimatedHeadline
            text="the wrong target."
            className="gradient-text text-glow-honey"
            startDelay={0.8}
          />
        </h1>

        {/* Subtitle with word reveal */}
        <motion.p
          className="mx-auto mb-14 max-w-md text-[16px] leading-[1.7] text-text-secondary sm:text-[17px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5, ease: [0.25, 0.4, 0.25, 1] }}
        >
          We hunt scams so you don&apos;t have to.
          <br className="hidden sm:block" />
          Voice calls. Links. Messages. Zero mercy for fraud.
        </motion.p>

        {/* CTAs with magnetic effect */}
        <motion.div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <MagneticButton
            as="a"
            href="#voice-scanner"
            className="group cta-glow-green flex h-13 items-center gap-2.5 rounded-full bg-[#13ef93] px-9 text-[14px] font-semibold text-surface transition-colors duration-300 hover:bg-[#10d683]"
          >
            <Phone size={15} />
            Scan a suspicious call
          </MagneticButton>
          <MagneticButton
            as="a"
            href="#demo"
            className="group cta-glow flex h-13 items-center gap-2.5 rounded-full bg-honey px-9 text-[14px] font-semibold text-surface transition-colors duration-300 hover:bg-honey-dark"
          >
            <motion.span
              animate={{ rotate: [0, 90, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Crosshair size={15} />
            </motion.span>
            Scan links &amp; text
          </MagneticButton>
        </motion.div>

        {/* Threat counter tagline */}
        <motion.div
          className="mt-16 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
        >
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="font-mono text-[11px] tracking-wider text-red-400/70 uppercase">
            Threat detection active
          </span>
        </motion.div>

        {/* Hackathon badge */}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-medium tracking-[0.2em] text-text-muted/70 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
        >
          <span>UC Berkeley AI Hackathon 2026</span>
          <span className="hidden text-white/[0.06] sm:inline">|</span>
          <span>Clean-room implementation</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
