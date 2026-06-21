import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  direction = "up",
  className = "",
  once = true,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-60px" });

  const dirMap = {
    up: { y: 24 },
    down: { y: -24 },
    left: { x: 24 },
    right: { x: -24 },
    none: {},
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...dirMap[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...dirMap[direction] }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = "", stagger = 0.08 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: stagger,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, filter: "blur(3px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GlowCard({ children, className = "", glowColor = "rgba(245, 166, 35, 0.06)" }) {
  return (
    <motion.div
      className={`group glass glass-hover rounded-2xl ${className}`}
      whileHover={{
        y: -2,
        boxShadow: `0 8px 40px ${glowColor}`,
        transition: { duration: 0.35, ease: [0.25, 0.4, 0.25, 1] },
      }}
    >
      {children}
    </motion.div>
  );
}

export function FloatingOrb({ color, size, x, y, delay = 0 }) {
  return (
    <motion.div
      className="orb"
      style={{
        width: size,
        height: size,
        background: color,
        left: x,
        top: y,
      }}
      animate={{
        x: [0, 30, -20, 10, 0],
        y: [0, -20, 15, -10, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
      }}
      transition={{
        duration: 25,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

export function SectionLabel({ children }) {
  return (
    <FadeIn>
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-1.5 text-[11px] font-medium tracking-[0.15em] text-text-muted uppercase">
        <span className="h-1 w-1 rounded-full bg-honey/60" />
        {children}
      </div>
    </FadeIn>
  );
}

// Re-exported via separate file to avoid react-refresh warning
// Use framer-motion imports directly in components that need motion/AnimatePresence
