import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <div className="relative z-10 min-h-screen px-4 py-16 max-w-3xl mx-auto text-gray-200">
      <Link to="/" className="text-amber-400 hover:text-amber-300 text-sm mb-8 inline-block">&larr; Back to STING</Link>

      <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
      <p className="text-gray-400 text-sm mb-8">Last updated: June 2026</p>

      <section className="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">1. Acceptance of Terms</h2>
          <p className="text-gray-400">
            By installing, accessing, or using the STING browser extension or website
            (collectively, the &ldquo;Service&rdquo;), you agree to be bound by these Terms of Service.
            If you do not agree, do not use the Service.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">2. Description of Service</h2>
          <p className="text-gray-400">
            STING (Scam Tracking & Intelligence Network Guard) is a browser-based tool that
            analyzes web page content locally on your device to detect potential scam patterns.
            The Service provides informational warnings and is not a substitute for professional
            security advice, legal counsel, or law enforcement.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">3. No Guarantee of Protection</h2>
          <p className="text-gray-400">
            STING uses heuristic pattern matching and is provided <strong className="text-gray-200">&ldquo;as is&rdquo;</strong> without
            warranty of any kind. We do not guarantee that:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-400 mt-2">
            <li>All scams, phishing attempts, or fraudulent content will be detected</li>
            <li>All warnings are accurate (false positives may occur)</li>
            <li>The Service will be uninterrupted or error-free</li>
            <li>The Service will protect against financial loss or data theft</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">4. User Responsibilities</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>You are responsible for your own online safety decisions</li>
            <li>Do not rely solely on STING for security; use additional measures</li>
            <li>Report suspected scams to appropriate authorities (FTC, IC3, local law enforcement)</li>
            <li>Do not use STING to facilitate, aid, or enable fraudulent activity</li>
            <li>Do not reverse-engineer, modify, or redistribute STING without permission</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">5. Intellectual Property</h2>
          <p className="text-gray-400">
            The STING name, logo, source code, and all associated materials are the property
            of their respective creators. The Service is provided under an open-source license
            as specified in the project repository.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">6. Limitation of Liability</h2>
          <p className="text-gray-400">
            To the maximum extent permitted by law, the creators and contributors of STING
            shall not be liable for any indirect, incidental, special, consequential, or
            punitive damages, including but not limited to loss of profits, data, or
            goodwill, arising from your use of or inability to use the Service.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">7. Privacy</h2>
          <p className="text-gray-400">
            Your use of the Service is also governed by our{" "}
            <Link to="/privacy" className="text-amber-400 hover:text-amber-300 underline">
              Privacy Policy
            </Link>, which describes how we handle data. All analysis is performed locally
            on your device.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">8. Modifications</h2>
          <p className="text-gray-400">
            We reserve the right to modify these Terms at any time. Continued use of the
            Service after changes constitutes acceptance of the updated Terms.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">9. Termination</h2>
          <p className="text-gray-400">
            You may stop using STING at any time by uninstalling the extension or leaving
            the website. We reserve the right to discontinue the Service at any time without notice.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">10. Governing Law</h2>
          <p className="text-gray-400">
            These Terms shall be governed by and construed in accordance with the laws of
            the State of California, United States, without regard to conflict of law provisions.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">11. Contact</h2>
          <p className="text-gray-400">
            For questions about these Terms, please open an issue on our{" "}
            <a href="https://github.com/billionairebumblebee/cloak-sting-hackathon-2026"
               className="text-amber-400 hover:text-amber-300 underline" target="_blank" rel="noopener">
              GitHub repository
            </a>.
          </p>
        </div>
      </section>

      <div className="mt-12 pt-6 border-t border-white/5 text-center text-gray-500 text-xs">
        STING — Scam Tracking & Intelligence Network Guard
      </div>
    </div>
  );
}
