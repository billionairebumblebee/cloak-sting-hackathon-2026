import { useState } from "react";
import { Mail, ShieldAlert, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { FadeIn, SectionLabel } from "./Motion";

const URGENCY_TERMS = ["act now", "urgent", "immediately", "within 24 hours", "final notice", "account locked", "account suspended", "verify now", "limited time"];
const PAYMENT_TERMS = ["wire transfer", "gift card", "crypto", "bitcoin", "zelle", "cash app", "processing fee", "redelivery fee", "customs fee", "pay to release"];
const TRUST_IMPERSONATION_TERMS = ["bank security", "fraud department", "irs", "usps", "fedex", "dhl", "apple support", "microsoft support", "verification center"];
const CREDENTIAL_HARVEST_TERMS = ["seed phrase", "recovery phrase", "private key", "wallet key", "enter your 12 words", "enter your 24 words", "mnemonic", "password", "passcode", "security code", "one-time code", "otp"];

function analyzeText(text) {
  const normalized = text.toLowerCase().replace(/\s+/g, " ").trim();
  const findings = [];
  for (const term of URGENCY_TERMS) {
    if (normalized.includes(term)) findings.push({ type: "urgency", label: "Urgency pressure", evidence: term, weight: 12 });
  }
  for (const term of PAYMENT_TERMS) {
    if (normalized.includes(term)) findings.push({ type: "payment", label: "Unusual payment request", evidence: term, weight: 18 });
  }
  for (const term of TRUST_IMPERSONATION_TERMS) {
    if (normalized.includes(term)) findings.push({ type: "impersonation", label: "Trusted institution impersonation", evidence: term, weight: 14 });
  }
  for (const term of CREDENTIAL_HARVEST_TERMS) {
    if (normalized.includes(term)) findings.push({ type: "credential", label: "Credential harvesting", evidence: term, weight: 16 });
  }
  const rawScore = findings.reduce((sum, f) => sum + f.weight, 0);
  const score = Math.min(100, rawScore);
  let level = "low";
  if (score >= 65) level = "high";
  else if (score >= 35) level = "medium";
  return { score, level, findings };
}

const emails = [
  {
    id: 1,
    from: "Apple Support",
    subject: "Your Apple ID has been locked! Verify immediately",
    body: "Your Apple ID has been locked due to suspicious activity. Verify your identity immediately or your account will be permanently suspended. Enter your password and security code. Act now \u2014 final notice.",
  },
  {
    id: 2,
    from: "PayPal Security",
    subject: "Unusual activity \u2014 confirm identity or account will be suspended",
    body: "We detected unusual activity on your PayPal account. Account will be suspended within 24 hours unless you verify now. Enter your password and one-time security code. Urgent \u2014 act now immediately.",
  },
  {
    id: 3,
    from: "Sarah Chen",
    subject: "Lunch tomorrow?",
    body: "Hey! Want to grab lunch tomorrow at that new Thai place? Let me know if noon works.",
  },
  {
    id: 4,
    from: "Amazon Delivery",
    subject: "Your package #AMZ-8847291 is being held \u2014 pay $2.99 redelivery fee",
    body: "Your package could not be delivered. A small redelivery fee of $2.99 is required. Pay the processing fee now. Limited time before return to sender.",
  },
].map((email) => {
  const result = analyzeText(email.subject + " " + email.body);
  return { ...email, analysis: result, isScam: result.level === "high" || result.level === "medium" };
});

function EmailRow({ email }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-200 ${
        email.isScam
          ? "border-red-500/20 bg-red-500/[0.03]"
          : "border-white/[0.06] bg-white/[0.02]"
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 text-left"
      >
        <Mail
          size={16}
          className={email.isScam ? "text-red-400" : "text-green-400"}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-text-primary truncate">
              {email.from}
            </span>
            <span
              className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                email.isScam
                  ? "bg-red-500/10 text-red-400"
                  : "bg-green-500/10 text-green-400"
              }`}
            >
              {email.isScam ? "Quarantined" : "Safe"}
            </span>
          </div>
          <p className="mt-0.5 text-[12px] text-text-secondary truncate">
            {email.subject}
          </p>
        </div>
        {expanded ? (
          <ChevronUp size={14} className="text-text-muted shrink-0" />
        ) : (
          <ChevronDown size={14} className="text-text-muted shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="mt-3 border-t border-white/[0.04] pt-3 animate-fade-in">
          <p className="mb-3 text-[12px] leading-[1.6] text-text-secondary">
            {email.body}
          </p>
          {email.isScam && (
            <div className="rounded-lg border border-honey/15 bg-honey/[0.03] p-3">
              <div className="mb-2 flex items-center gap-1.5">
                <ShieldAlert size={12} className="text-honey" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-honey">
                  STING Analysis — Score: {email.analysis.score}/100
                </span>
              </div>
              <ul className="space-y-1">
                {email.analysis.findings.slice(0, 3).map((f, i) => (
                  <li
                    key={i}
                    className="text-[11px] text-text-secondary"
                  >
                    <span className="text-honey/70">&rarr;</span>{" "}
                    <span className="font-medium text-text-primary">{f.label}</span>:{" "}
                    &ldquo;{f.evidence}&rdquo;
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!email.isScam && (
            <div className="flex items-center gap-1.5 rounded-lg border border-green-500/15 bg-green-500/[0.03] p-3">
              <ShieldCheck size={12} className="text-green-400" />
              <span className="text-[11px] text-green-400/80">
                No threat signals detected
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function EmailDemo() {
  const scamEmails = emails.filter((e) => e.isScam);
  const safeEmails = emails.filter((e) => !e.isScam);

  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <SectionLabel>Email Protection</SectionLabel>
          <FadeIn delay={0.1}>
            <h3 className="mb-3 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Email <span className="gradient-text">Quarantine</span>
            </h3>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-md text-[14px] leading-[1.7] text-text-secondary">
              STING scans incoming emails and quarantines phishing attempts before they reach your inbox.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.3}>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5">
            {/* Quarantine section */}
            <div className="mb-4">
              <div className="mb-3 flex items-center gap-2">
                <ShieldAlert size={13} className="text-red-400" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-red-400">
                  Quarantine ({scamEmails.length})
                </span>
              </div>
              <div className="space-y-2">
                {scamEmails.map((email) => (
                  <EmailRow key={email.id} email={email} />
                ))}
              </div>
            </div>

            {/* Safe section */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck size={13} className="text-green-400" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-green-400">
                  Inbox ({safeEmails.length})
                </span>
              </div>
              <div className="space-y-2">
                {safeEmails.map((email) => (
                  <EmailRow key={email.id} email={email} />
                ))}
              </div>
            </div>

            <p className="mt-4 text-center text-[10px] text-text-muted">
              Demo simulation. Email scanning requires integration with your email provider.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
