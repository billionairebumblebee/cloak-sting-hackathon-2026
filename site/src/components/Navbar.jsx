import { useState, useEffect } from "react";
import StingLogo from "../assets/StingLogo";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Problem", href: "#problem" },
  { label: "How It Works", href: "#flow" },
  { label: "Demo", href: "#demo" },
  { label: "Architecture", href: "#architecture" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    requestAnimationFrame(() => setMounted(true));
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.04] bg-surface/60 backdrop-blur-2xl"
          : "bg-transparent"
      }`}
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(-20px)",
        transition: "opacity 0.6s cubic-bezier(0.25,0.4,0.25,1), transform 0.6s cubic-bezier(0.25,0.4,0.25,1), background-color 0.5s, border-color 0.5s, backdrop-filter 0.5s",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2.5">
          <StingLogo size={32} />
          <span className="text-lg font-bold tracking-tight text-cream">
            Sting
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-[13px] font-medium text-text-secondary transition-colors duration-300 hover:text-cream"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#demo"
            className="group relative overflow-hidden rounded-full bg-honey/10 px-5 py-2 text-[13px] font-semibold text-honey transition-all duration-300 hover:bg-honey/20 hover:shadow-lg hover:shadow-honey/10"
          >
            <span className="relative z-10">Try Demo</span>
          </a>
        </div>

        <button
          className="text-text-secondary md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div
        className="overflow-hidden border-t border-white/[0.04] bg-surface/90 backdrop-blur-2xl md:hidden"
        style={{
          maxHeight: open ? "400px" : "0",
          opacity: open ? 1 : 0,
          transition: "max-height 0.3s ease, opacity 0.3s ease",
          borderTopWidth: open ? "1px" : "0",
        }}
      >
        <div className="px-6 py-4">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-3 text-sm font-medium text-text-secondary transition-all duration-300 hover:text-cream"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateX(0)" : "translateX(-20px)",
                transition: `opacity 0.3s ease ${i * 0.05}s, transform 0.3s ease ${i * 0.05}s`,
              }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#demo"
            className="mt-3 block rounded-full bg-honey/10 px-5 py-2.5 text-center text-sm font-semibold text-honey"
            onClick={() => setOpen(false)}
          >
            Try Demo
          </a>
        </div>
      </div>
    </nav>
  );
}
