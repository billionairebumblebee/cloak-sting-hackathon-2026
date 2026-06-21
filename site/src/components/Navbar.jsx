import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.04] bg-surface/80 backdrop-blur-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="#" className="flex items-center gap-2.5">
          <StingLogo size={28} />
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-text-primary">
            Sting
          </span>
        </a>

        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link text-[13px] font-medium text-text-muted transition-colors duration-300 hover:text-text-primary"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#demo"
            className="group relative overflow-hidden rounded-full border border-honey/20 bg-honey/[0.06] px-5 py-2 text-[13px] font-medium text-honey transition-all duration-300 hover:border-honey/30 hover:bg-honey/10"
          >
            <span className="relative z-10">Try Demo</span>
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="overflow-hidden border-t border-white/[0.04] bg-surface/95 backdrop-blur-2xl md:hidden"
          >
            <div className="px-6 py-3">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ x: -12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex h-12 items-center text-[15px] font-medium text-text-muted transition-colors hover:text-text-primary"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href="#demo"
                className="mt-2 mb-2 flex h-12 items-center justify-center rounded-xl border border-honey/20 bg-honey/[0.06] text-[15px] font-medium text-honey"
                onClick={() => setOpen(false)}
              >
                Try Demo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
