import { motion, useInView, AnimatePresence } from "framer-motion";
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
  const inView = useInView(ref, { once, margin: "-80px" });

  const dirMap = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
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

export function StaggerContainer({ children, className = "", stagger = 0.1 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

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
        hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GlowCard({ children, className = "", glowColor = "rgba(245, 166, 35, 0.08)" }) {
  return (
    <motion.div
      className={`glass glass-hover rounded-2xl ${className}`}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 0 40px ${glowColor}`,
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.98 }}
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
        duration: 20,
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
      <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-honey/10 bg-honey/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-honey uppercase">
        <span className="h-1 w-1 rounded-full bg-honey" />
        {children}
      </span>
    </FadeIn>
  );
}

export { motion, AnimatePresence };
