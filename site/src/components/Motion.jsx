import { useRef, useEffect, useState, Children, cloneElement } from "react";

function useInView(ref, { once = true, margin = "-60px" } = {}) {
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
  const inView = useInView(ref, { once, margin: "-60px" });

  const dirMap = {
    up: "translate3d(0, 24px, 0)",
    down: "translate3d(0, -24px, 0)",
    left: "translate3d(24px, 0, 0)",
    right: "translate3d(-24px, 0, 0)",
    none: "translate3d(0, 0, 0)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate3d(0, 0, 0)" : dirMap[direction],
        transition: `opacity ${duration}s cubic-bezier(0.25,0.4,0.25,1) ${delay}s, transform ${duration}s cubic-bezier(0.25,0.4,0.25,1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

export function StaggerContainer({ children, className = "", stagger = 0.08 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, i) =>
        child
          ? cloneElement(child, {
              _staggerDelay: i * stagger,
              _staggerVisible: inView,
            })
          : null
      )}
    </div>
  );
}

export function StaggerItem({
  children,
  className = "",
  _staggerDelay = 0,
  _staggerVisible = false,
}) {
  return (
    <div
      className={className}
      style={{
        opacity: _staggerVisible ? 1 : 0,
        transform: _staggerVisible
          ? "translateY(0) blur(0)"
          : "translateY(20px)",
        filter: _staggerVisible ? "blur(0px)" : "blur(3px)",
        transition: `opacity 0.5s cubic-bezier(0.25,0.4,0.25,1) ${_staggerDelay}s, transform 0.5s cubic-bezier(0.25,0.4,0.25,1) ${_staggerDelay}s, filter 0.5s cubic-bezier(0.25,0.4,0.25,1) ${_staggerDelay}s`,
        willChange: "opacity, transform, filter",
      }}
    >
      {children}
    </div>
  );
}

export function GlowCard({
  children,
  className = "",
  glowColor = "rgba(245, 166, 35, 0.06)",
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`group glass glass-hover rounded-2xl transition-transform duration-300 ${className}`}
      style={{
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? `0 8px 40px ${glowColor}` : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
}

export function FloatingOrb({ color, size, x, y, delay = 0 }) {
  return (
    <div
      className="orb animate-orb-drift"
      style={{
        width: size,
        height: size,
        background: color,
        left: x,
        top: y,
        animationDelay: `${delay}s`,
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
