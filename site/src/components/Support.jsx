import { Link } from "react-router-dom";

export default function Support() {
  return (
    <div className="relative z-10 min-h-screen px-4 py-16 max-w-3xl mx-auto text-gray-200">
      <Link to="/" className="text-amber-400 hover:text-amber-300 text-sm mb-8 inline-block">&larr; Back to STING</Link>

      <h1 className="text-3xl font-bold text-white mb-2">Support</h1>
      <p className="text-gray-400 text-sm mb-8">Need help? We&apos;re here for you.</p>

      <section className="space-y-6 text-sm leading-relaxed">
        <div className="p-5 rounded-xl border border-amber-400/20 bg-amber-400/[0.03]">
          <h2 className="text-lg font-semibold text-amber-400 mb-2">Report a Bug or Issue</h2>
          <p className="text-gray-400">
            Found a bug, false positive, or something not working right? Open an issue on our
            GitHub repository and we&apos;ll look into it.
          </p>
          <a
            href="https://github.com/billionairebumblebee/cloak-sting-hackathon-2026/issues/new"
            className="inline-block mt-3 px-4 py-2 rounded-lg bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 transition-colors text-sm font-medium"
            target="_blank"
            rel="noopener"
          >
            Open a GitHub Issue &rarr;
          </a>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
          <h2 className="text-lg font-semibold text-white mb-2">Frequently Asked Questions</h2>
          <div className="space-y-4 mt-3">
            <div>
              <h3 className="font-medium text-gray-200">Does STING send my data anywhere?</h3>
              <p className="text-gray-400 mt-1">
                No. All scanning happens locally on your device. Nothing is transmitted to external servers.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-200">Why did STING flag a page I trust?</h3>
              <p className="text-gray-400 mt-1">
                STING uses pattern matching and may occasionally produce false positives. If a
                trusted site is flagged, you can safely dismiss the warning. Please report it as
                a bug so we can improve our detection.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-200">How do I disable STING on a specific site?</h3>
              <p className="text-gray-400 mt-1">
                Right-click the STING extension icon → Manage Extension → Site Access, and
                set it to &ldquo;Do not allow on this site.&rdquo;
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-200">Is STING free?</h3>
              <p className="text-gray-400 mt-1">
                Yes. STING is completely free and open-source.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-200">How do I uninstall STING?</h3>
              <p className="text-gray-400 mt-1">
                Right-click the STING icon in your toolbar → Remove from Chrome. All local data
                is deleted when you uninstall.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
          <h2 className="text-lg font-semibold text-white mb-2">Feature Requests</h2>
          <p className="text-gray-400">
            Have an idea for how STING could better protect you? We&apos;d love to hear it.
            Open a feature request on GitHub.
          </p>
          <a
            href="https://github.com/billionairebumblebee/cloak-sting-hackathon-2026/issues/new?labels=enhancement&title=Feature+request:+"
            className="inline-block mt-3 px-4 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-colors text-sm font-medium"
            target="_blank"
            rel="noopener"
          >
            Request a Feature &rarr;
          </a>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
          <h2 className="text-lg font-semibold text-white mb-2">Security Vulnerability</h2>
          <p className="text-gray-400">
            If you&apos;ve found a security vulnerability, please report it responsibly
            through GitHub&apos;s private vulnerability reporting on our repository.
          </p>
          <a
            href="https://github.com/billionairebumblebee/cloak-sting-hackathon-2026/security/advisories/new"
            className="inline-block mt-3 px-4 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-colors text-sm font-medium"
            target="_blank"
            rel="noopener"
          >
            Report Privately &rarr;
          </a>
        </div>
      </section>

      <div className="mt-12 pt-6 border-t border-white/5 text-center text-gray-500 text-xs">
        STING — Scam Tracking & Intelligence Network Guard
      </div>
    </div>
  );
}
