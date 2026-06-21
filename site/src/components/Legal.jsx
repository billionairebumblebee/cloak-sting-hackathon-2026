import { Link } from "react-router-dom";

export default function Legal() {
  return (
    <div className="relative z-10 min-h-screen px-4 py-16 max-w-3xl mx-auto text-gray-200">
      <Link to="/" className="text-amber-400 hover:text-amber-300 text-sm mb-8 inline-block">&larr; Back to STING</Link>

      <h1 className="text-3xl font-bold text-white mb-2">Legal</h1>
      <p className="text-gray-400 text-sm mb-8">Last updated: June 2026</p>

      <section className="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Disclaimer</h2>
          <p className="text-gray-400">
            STING (Scam Tracking & Intelligence Network Guard) is an informational tool designed
            to help users identify potential online scams. It is <strong className="text-gray-200">not</strong> a
            law enforcement tool, legal service, financial advisor, or guaranteed security solution.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">No Legal Advice</h2>
          <p className="text-gray-400">
            Nothing provided by STING constitutes legal advice. If you believe you have been
            a victim of fraud, contact your local law enforcement, the FTC (reportfraud.ftc.gov),
            or the FBI&apos;s IC3 (ic3.gov).
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Accuracy & Limitations</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>STING uses heuristic pattern matching — it may produce false positives or miss threats</li>
            <li>A &ldquo;safe&rdquo; result does not guarantee a website is legitimate</li>
            <li>A &ldquo;threat&rdquo; result does not guarantee a website is fraudulent</li>
            <li>Detection patterns are based on known scam tactics and may not cover novel threats</li>
            <li>STING does not verify the identity of website operators</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">No Affiliation</h2>
          <p className="text-gray-400">
            STING is not affiliated with, endorsed by, or connected to any law enforcement
            agency, government body, financial institution, or the brands it may reference
            in scam pattern detection (e.g., bank names, shipping companies). Brand names
            are used solely to identify common impersonation targets.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Open Source</h2>
          <p className="text-gray-400">
            STING is an open-source project developed during the UC Berkeley AI Hackathon 2026.
            The source code is publicly available for review on{" "}
            <a href="https://github.com/billionairebumblebee/cloak-sting-hackathon-2026"
               className="text-amber-400 hover:text-amber-300 underline" target="_blank" rel="noopener">
              GitHub
            </a>.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Indemnification</h2>
          <p className="text-gray-400">
            You agree to indemnify and hold harmless the creators and contributors of STING
            from any claims, damages, or expenses arising from your use of the Service or
            violation of these terms.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">DMCA & Takedown</h2>
          <p className="text-gray-400">
            If you believe STING incorrectly flags your website, please open an issue on
            our GitHub repository with the URL in question and we will review the detection
            pattern.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-amber-400/20 bg-amber-400/[0.03]">
          <h2 className="text-lg font-semibold text-amber-400 mb-2">Related Policies</h2>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link to="/privacy" className="text-amber-400 hover:text-amber-300 underline">
                Privacy Policy
              </Link>{" "}
              — how we handle data
            </li>
            <li>
              <Link to="/terms" className="text-amber-400 hover:text-amber-300 underline">
                Terms of Service
              </Link>{" "}
              — usage agreement
            </li>
          </ul>
        </div>
      </section>

      <div className="mt-12 pt-6 border-t border-white/5 text-center text-gray-500 text-xs">
        STING — Scam Tracking & Intelligence Network Guard
      </div>
    </div>
  );
}
