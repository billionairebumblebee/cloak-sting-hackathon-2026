import { FadeIn, SectionLabel, StaggerContainer, StaggerItem } from "./Motion";

const safetyDisclaimers = [
  {
    title: "No perfect scam blocking",
    body:
      "STING looks for scam, phishing, impersonation, payment-pressure, and credential-harvesting signals, but scammers change tactics constantly. We cannot and do not guarantee that STING will detect, block, prevent, or warn about every scam, fraud attempt, unsafe message, malicious website, or financial loss.",
  },
  {
    title: "You stay in control",
    body:
      "STING provides risk signals and plain-language explanations. It is not legal, financial, cybersecurity, law-enforcement, banking, medical, or emergency advice. Verify suspicious requests through official channels before sending money, passwords, one-time codes, documents, crypto, or personal information.",
  },
  {
    title: "Liability limit",
    body:
      "Use STING at your own risk. To the maximum extent allowed by law, STING and its creators are not liable for losses, scams, missed warnings, incorrect warnings, blocked or unblocked content, business interruption, lost funds, or other damages arising from use of the extension, website, demos, receipts, or recommendations.",
  },
];

const privacyPoints = [
  {
    label: "What we process",
    text:
      "The extension may inspect page text, URLs, form labels, message content, transcripts, scam signals, screenshots you choose to capture, and generated receipts/case records so it can evaluate risk and explain what it found.",
  },
  {
    label: "Where data lives",
    text:
      "The core browser scan is designed to run locally and store recent receipts in browser storage where possible. Demo, voice, sandbox, observability, or case-memory features may send limited evidence or sanitized events to services used for transcription, isolated inspection, reliability monitoring, evaluation, or storage.",
  },
  {
    label: "How we use it",
    text:
      "We use data to produce scam warnings, evidence receipts, safer next-step suggestions, bug/reliability monitoring, abuse prevention, and product improvement. We do not sell personal information or use scam evidence to advertise to you.",
  },
  {
    label: "Your choices",
    text:
      "Do not paste secrets, passwords, one-time codes, private keys, full bank details, or highly sensitive personal information into optional demos. You can uninstall the extension, clear browser storage, and avoid optional upload/transcription/sandbox features if you do not want that data processed.",
  },
];

const termsPoints = [
  {
    label: "Allowed use",
    text:
      "Use STING only for lawful personal safety, education, testing, or research. Do not use it to harass people, make false accusations, bypass security, scrape private data, or automate attacks.",
  },
  {
    label: "No warranties",
    text:
      "The website, extension, demos, scans, receipts, and explanations are provided “as is” and “as available,” without warranties of accuracy, availability, security, fitness for a particular purpose, or non-infringement.",
  },
  {
    label: "Reporting and emergencies",
    text:
      "If you believe you are being scammed or threatened, pause, stop communicating with the suspected scammer, contact your bank/card issuer if money or credentials were involved, and report through official channels such as the FTC, IC3, local law enforcement, or relevant platform support.",
  },
  {
    label: "Non-waivable rights",
    text:
      "Nothing here limits rights that cannot be limited by law. These terms are startup-stage safety terms, not a substitute for advice from a qualified attorney for production launch or regulated use cases.",
  },
];

export default function LegalSafety() {
  return (
    <section id="legal" className="relative px-6 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-1/3 mx-auto h-[420px] max-w-4xl rounded-full bg-honey/[0.025] blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <FadeIn>
          <div className="mb-12 max-w-3xl">
            <SectionLabel>Safety, privacy & terms</SectionLabel>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,3.25rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-text-primary">
              Scam defense is a warning system, {" "}
              <span className="text-text-muted">not a guarantee.</span>
            </h2>
            <p className="mt-5 text-[15px] leading-[1.75] text-text-secondary sm:text-[16px]">
              STING is built to help people pause before a scam gets expensive.
              It can surface risk signals and safer next steps, but it cannot
              promise that every scam will be caught or that every warning will
              be correct.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid gap-4 lg:grid-cols-3" stagger={0.06}>
          {safetyDisclaimers.map((item) => (
            <StaggerItem key={item.title}>
              <div className="glass h-full rounded-3xl border border-honey/[0.08] p-6">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-honey/80">
                  Disclaimer
                </p>
                <h3 className="mb-3 text-[17px] font-bold tracking-[-0.02em] text-text-primary">
                  {item.title}
                </h3>
                <p className="text-[13px] leading-[1.75] text-text-secondary">
                  {item.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <LegalPanel title="Privacy summary" eyebrow="Privacy Policy" items={privacyPoints} />
          <LegalPanel title="Terms summary" eyebrow="Terms of Use" items={termsPoints} />
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-6 rounded-2xl border border-white/[0.05] bg-white/[0.025] p-5 text-[12px] leading-[1.7] text-text-muted">
            Last updated June 2026. This summary is intended to make the hackathon
            demo safer and clearer. Before a public production launch, have a
            qualified attorney review the privacy policy, terms, liability
            language, data flows, and Chrome Web Store disclosures.
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function LegalPanel({ eyebrow, title, items }) {
  return (
    <FadeIn delay={0.12}>
      <div className="glass h-full rounded-3xl p-7">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-sting-teal/80">
          {eyebrow}
        </p>
        <h3 className="mb-6 text-[22px] font-extrabold tracking-[-0.03em] text-text-primary">
          {title}
        </h3>
        <div className="space-y-5">
          {items.map((item) => (
            <div key={item.label}>
              <h4 className="mb-1.5 text-[13px] font-bold text-text-primary">
                {item.label}
              </h4>
              <p className="text-[13px] leading-[1.7] text-text-secondary">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}
