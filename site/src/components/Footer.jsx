import StingLogo from "../assets/StingLogo";

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <StingLogo size={28} />
            <span className="font-semibold text-cream">Sting</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center sm:items-end sm:text-right">
            <p className="text-xs text-text-secondary">
              Built at UC Berkeley AI Hackathon 2026
            </p>
            <p className="text-xs text-text-secondary/60">
              Clean-room implementation. All code and assets created during the
              hacking period.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
