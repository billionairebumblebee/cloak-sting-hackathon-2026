import { motion } from "framer-motion";
import StingLogo from "../assets/StingLogo";
import { FadeIn } from "./Motion";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.03] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
            <motion.a
              href="#"
              className="flex items-center gap-2.5"
              whileHover={{ scale: 1.03 }}
            >
              <StingLogo size={24} />
              <span className="font-semibold text-cream">Sting</span>
            </motion.a>
            <div className="flex flex-col items-center gap-1.5 text-center sm:items-end sm:text-right">
              <p className="text-[11px] text-text-muted">
                Built at UC Berkeley AI Hackathon 2026
              </p>
              <p className="text-[10px] text-text-muted/60">
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
