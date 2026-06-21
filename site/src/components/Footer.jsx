import StingLogo from "../assets/StingLogo";
import { FadeIn } from "./Motion";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.03] px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <a
              href="#"
              className="flex items-center gap-2.5 transition-transform duration-300 hover:scale-[1.03]"
            >
              <StingLogo size={22} />
              <span className="text-[14px] font-semibold tracking-[-0.01em] text-text-primary">
                Sting
              </span>
            </a>
            <div className="flex flex-col items-center gap-1.5 text-center sm:items-end sm:text-right">
              <p className="text-[11px] text-text-muted">
                Built at UC Berkeley AI Hackathon 2026
              </p>
              <p className="text-[10px] text-text-muted/50">
                Clean-room implementation. All code and assets created during the
                hacking period.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
