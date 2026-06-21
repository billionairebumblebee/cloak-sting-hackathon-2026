import { useRef, useEffect, useState, Children, cloneElement } from "react";

function useInView(ref, { once = true, margin = "-80px" } = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin: margin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, once, margin]);
  return inView;
}

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

  const dirStyles = {
    up: "translate3d(0, 40px, 0)",
    down: "translate3d(0, -40px, 0)",
    left: "translate3d(40px, 0, 0)",
    right: "translate3d(-40px, 0, 0)",
    none: "translate3d(0, 0, 0)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate3d(0,0,0)" : dirStyles[direction],
        transition: `opacity ${duration}s cubic-bezier(0.25,0.4,0.25,1) ${delay}s, transform ${duration}s cubic-bezier(0.25,0.4,0.25,1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

export function StaggerContainer({ children, className = "", stagger = 0.1 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, i) =>
        child
          ? cloneElement(child, {
              _staggerDelay: i * stagger,
              _visible: inView,
            })
          : null
      )}
    </div>
  );
}

export function StaggerItem({ children, className = "", _staggerDelay = 0, _visible = false }) {
  return (
    <div
      className={className}
      style={{
        opacity: _visible ? 1 : 0,
        transform: _visible ? "translate3d(0,0,0)" : "translate3d(0, 30px, 0)",
        filter: _visible ? "blur(0px)" : "blur(4px)",
        transition: `opacity 0.6s cubic-bezier(0.25,0.4,0.25,1) ${_staggerDelay}s, transform 0.6s cubic-bezier(0.25,0.4,0.25,1) ${_staggerDelay}s, filter 0.6s cubic-bezier(0.25,0.4,0.25,1) ${_staggerDelay}s`,
        willChange: "opacity, transform, filter",
      }}
    >
      {children}
    </div>
  );
}

export function GlowCard({ children, className = "", glowColor = "rgba(245, 166, 35, 0.08)" }) {
  return (
    <div
      className={`glass rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${className}`}
      style={{
        "--glow-color": glowColor,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 40px ${glowColor}`;
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
        e.currentTarget.style.borderColor = "rgba(245, 166, 35, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "";
        e.currentTarget.style.background = "";
        e.currentTarget.style.borderColor = "";
      }}
    >
      {children}
    </div>
  );
}

export function FloatingOrb({ color, size, x, y }) {
  return (
    <div
      className="orb animate-orb-drift"
      style={{
        width: size,
        height: size,
        background: color,
        left: x,
        top: y,
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
