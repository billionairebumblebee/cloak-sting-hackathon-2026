import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="relative z-10 min-h-screen px-4 py-16 max-w-3xl mx-auto text-gray-200">
      <Link to="/" className="text-amber-400 hover:text-amber-300 text-sm mb-8 inline-block">&larr; Back to STING</Link>

      <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="text-gray-400 text-sm mb-8">Last updated: June 2026</p>

      <section className="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Overview</h2>
          <p>
            STING (Scam Tracking & Intelligence Network Guard) is a browser extension and web application
            that detects scam patterns on web pages. We are committed to user privacy and collect the
            minimum data necessary to provide scam protection.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Data We Collect</h2>

          <div className="space-y-4 mt-4">
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <h3 className="font-semibold text-amber-400 mb-1">Website Content</h3>
              <p className="text-gray-400">
                STING reads page text, form labels, and link URLs on the current tab to analyze scam patterns.
                This data is processed <strong className="text-gray-200">locally in your browser</strong> and is
                never transmitted to external servers. No page content leaves your device.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <h3 className="font-semibold text-amber-400 mb-1">Web History (Limited)</h3>
              <p className="text-gray-400">
                STING stores the hostname and URL of pages where threats were detected, along with the
                scan result. This history is stored <strong className="text-gray-200">locally in browser
                storage</strong> (chrome.storage.local) and never leaves your device. You can clear it
                at any time from the extension popup.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <h3 className="font-semibold text-amber-400 mb-1">User Activity (Limited)</h3>
              <p className="text-gray-400">
                STING monitors page DOM changes to detect dynamically loaded scam content. It does
                <strong className="text-gray-200"> not</strong> log clicks, mouse position, scroll events,
                or keystrokes. It only observes whether new text or form fields appear that match scam patterns.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Data We Do NOT Collect</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li><strong className="text-gray-200">Personally identifiable information</strong> — no names, emails, addresses, or IDs</li>
            <li><strong className="text-gray-200">Health information</strong> — none</li>
            <li><strong className="text-gray-200">Financial and payment information</strong> — no credit cards, transactions, or financial data</li>
            <li><strong className="text-gray-200">Authentication information</strong> — no passwords, credentials, or PINs</li>
            <li><strong className="text-gray-200">Personal communications</strong> — no emails, texts, or messages</li>
            <li><strong className="text-gray-200">Location</strong> — no GPS, IP tracking, or geolocation</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Data Storage</h2>
          <p className="text-gray-400">
            All data is stored locally on your device using the browser's built-in storage APIs.
            STING does not operate any remote servers, databases, or cloud storage. Your scan
            history and preferences remain entirely on your machine.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Data Sharing</h2>
          <p className="text-gray-400">
            STING does <strong className="text-gray-200">not</strong> sell, share, transfer, or
            transmit any user data to third parties. All processing happens locally.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Third-Party Services</h2>
          <p className="text-gray-400">
            When API keys are configured (optional), STING may send anonymized, compressed scam
            evidence to Anthropic's Claude API for generating plain-English explanations. This
            only occurs when explicitly triggered by the user and contains no personally
            identifiable information — only the scam signals detected on the page.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Your Rights</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>You can disable the extension at any time</li>
            <li>You can clear all stored data from the extension's History tab</li>
            <li>You can uninstall the extension to remove all associated data</li>
            <li>No account or signup is required to use STING</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Changes to This Policy</h2>
          <p className="text-gray-400">
            We may update this policy as the product evolves. Changes will be reflected on this
            page with an updated date.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Contact</h2>
          <p className="text-gray-400">
            For questions about this privacy policy, please open an issue on our{" "}
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
