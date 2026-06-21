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
}) {
  return (
    <div
      className={`glass rounded-2xl ${className}`}
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
      <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-honey/15 bg-honey/[0.04] px-5 py-2 text-[12px] font-semibold tracking-[0.15em] text-honey/80 uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-honey/70" />
        {children}
      </div>
    </FadeIn>
  );
}
