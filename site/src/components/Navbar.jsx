import { useState } from "react";
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="#" className="flex items-center gap-2">
          <StingLogo size={36} />
          <span className="text-xl font-bold tracking-tight text-cream">
            Sting
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-secondary transition-colors hover:text-honey"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#demo"
            className="rounded-lg bg-honey px-4 py-2 text-sm font-semibold text-ink transition-all hover:bg-honey-light"
          >
            Try Demo
          </a>
        </div>

        <button
          className="text-text-secondary md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-surface px-6 pb-4 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-3 text-sm font-medium text-text-secondary transition-colors hover:text-honey"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#demo"
            className="mt-2 block rounded-lg bg-honey px-4 py-2 text-center text-sm font-semibold text-ink"
            onClick={() => setOpen(false)}
          >
            Try Demo
          </a>
        </div>
      )}
    </nav>
  );
}
