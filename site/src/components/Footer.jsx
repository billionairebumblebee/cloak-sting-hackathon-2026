import { Link } from "react-router-dom";
import StingLogo from "../assets/StingLogo";
import { FadeIn } from "./Motion";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.03] px-6 py-14 overflow-hidden">
      {/* Footer mystery glow */}
      <div className="footer-glow" />
      <div className="mx-auto max-w-6xl relative z-10">
        <FadeIn>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <a
              href="#"
              className="flex items-center gap-2.5"
            >
              <StingLogo size={22} />
              <span className="text-[14px] font-bold tracking-[-0.01em] text-text-primary">
                STING
              </span>
            </a>
            <div className="flex flex-col items-center gap-1.5 text-center sm:items-end sm:text-right">
              <p className="text-[12px] font-medium text-text-secondary">
                Built at UC Berkeley AI Hackathon 2026
              </p>
              <p className="text-[11px] text-text-muted">
                Clean-room implementation. Every line written during the hacking
                period. Zero tolerance for fraud.
              </p>
              <div className="flex gap-3 mt-1">
                <Link to="/privacy" className="text-[11px] text-amber-400/60 hover:text-amber-400 transition-colors">
                  Privacy
                </Link>
                <Link to="/terms" className="text-[11px] text-amber-400/60 hover:text-amber-400 transition-colors">
                  Terms
                </Link>
                <Link to="/legal" className="text-[11px] text-amber-400/60 hover:text-amber-400 transition-colors">
                  Legal
                </Link>
                <Link to="/support" className="text-[11px] text-amber-400/60 hover:text-amber-400 transition-colors">
                  Support
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
