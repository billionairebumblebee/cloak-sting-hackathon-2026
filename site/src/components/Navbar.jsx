import { useState, useEffect } from "react";
import StingLogo from "../assets/StingLogo";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Problem", href: "#problem" },
  { label: "How It Works", href: "#flow" },
  { label: "Voice Scanner", href: "#voice-scanner" },
  { label: "Demo", href: "#demo" },
  { label: "Hall of Fame", href: "#hall-of-fame" },
  { label: "Architecture", href: "#architecture" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.04] bg-surface/80 backdrop-blur-2xl"
          : "bg-transparent"
      }`}
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(-20px)",
        transition: `opacity 0.6s cubic-bezier(0.25,0.4,0.25,1), transform 0.6s cubic-bezier(0.25,0.4,0.25,1), background 0.5s ease, border-color 0.5s ease`,
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="#" className="flex items-center gap-2.5">
          <StingLogo size={28} />
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-text-primary">
            sting
          </span>
        </a>

        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link text-[14px] font-medium text-text-secondary transition-colors duration-300 hover:text-text-primary"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#demo"
            className="group relative overflow-hidden rounded-full bg-honey px-6 py-2.5 text-[14px] font-semibold text-surface transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-honey/20 active:scale-[0.97]"
          >
            <span className="relative z-10">Try a Demo Scan</span>
          </a>
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-lg text-text-muted transition-colors hover:text-text-primary md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div
          className="overflow-hidden border-t border-white/[0.04] bg-surface/95 backdrop-blur-2xl md:hidden animate-slide-down"
        >
          <div className="px-6 py-3">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className="flex h-12 items-center text-[16px] font-medium text-text-secondary transition-colors hover:text-text-primary"
                style={{
                  animation: `slideInLeft 0.3s ease ${i * 0.04}s both`,
                }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#demo"
              className="mt-2 mb-2 flex h-12 items-center justify-center rounded-xl bg-honey text-[16px] font-semibold text-surface"
              onClick={() => setOpen(false)}
            >
              Try Demo
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
