import { useState } from "react";
import { MessageSquare, Shield, ShieldAlert, ChevronRight } from "lucide-react";
import { FadeIn, SectionLabel } from "./Motion";

const URGENCY = ["act now", "urgent", "immediately", "within 24 hours", "within 24hrs", "final notice", "account locked", "account suspended", "verify now", "limited time"];
const PAYMENT = ["wire transfer", "gift card", "crypto", "bitcoin", "zelle", "cash app", "processing fee", "redelivery fee", "customs fee", "pay to release"];
const IMPERSONATION = ["bank security", "fraud department", "irs", "usps", "fedex", "dhl", "apple support", "microsoft support", "verification center"];
const SECRET = ["do not tell", "keep this confidential", "do not contact", "avoid calling"];

function containsAny(text, terms) {
  return terms.filter((t) => text.includes(t));
}

function analyzeText(text) {
  const n = text.toLowerCase().replace(/\s+/g, " ").trim();
  const findings = [];
  for (const t of containsAny(n, URGENCY)) findings.push({ label: "Urgency pressure", weight: 12, evidence: t });
  for (const t of containsAny(n, PAYMENT)) findings.push({ label: "Unusual payment request", weight: 18, evidence: t });
  for (const t of containsAny(n, IMPERSONATION)) findings.push({ label: "Trusted institution language", weight: 14, evidence: t });
  for (const t of containsAny(n, SECRET)) findings.push({ label: "Isolation / secrecy pressure", weight: 18, evidence: t });
  const raw = findings.reduce((s, f) => s + f.weight, 0);
  const score = Math.min(100, raw);
  const level = score >= 65 ? "high" : score >= 35 ? "medium" : "low";
  return { score, level, findings };
}

const MESSAGES = [
  { sender: "Mom", initials: "M", body: "Hey honey, dinner at 7?", time: "6:42 PM" },
  { sender: "USPS", initials: "US", body: "Your package cannot be delivered. Click here to reschedule: bit.ly/usps-redeliver. Redelivery fee of $1.99 required. Act now.", time: "3:18 PM" },
  { sender: "Bank Alert", initials: "BA", body: "Unusual activity detected. Verify now: secure-bank-verify.com. Bank security fraud department. Account locked within 24 hours.", time: "1:05 PM" },
  { sender: "Dr. Chen", initials: "DC", body: "Reminder: appointment tomorrow at 2pm. Please arrive 10 minutes early.", time: "9:15 AM" },
];

function ThreatBar({ score, level }) {
  const color = level === "high"
    ? "from-red-600 to-red-400"
    : level === "medium"
      ? "from-yellow-600 to-yellow-400"
      : "from-green-600 to-green-400";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`font-mono text-xs font-bold tabular-nums ${level === "high" ? "text-red-400" : level === "medium" ? "text-yellow-400" : "text-green-400"}`}>
        {score}
      </span>
    </div>
  );
}

function MessageRow({ msg, isOpen, onToggle }) {
  const result = analyzeText(msg.body);
  const isScam = result.level === "high" || result.level === "medium";

  return (
    <div>
      <button
        onClick={onToggle}
        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${isOpen ? "bg-honey/[0.05]" : "hover:bg-white/[0.02]"}`}
      >
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isScam ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
          {msg.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-text-primary">{msg.sender}</span>
            {result.level === "high" && (
              <span className="rounded border border-red-500/20 bg-red-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-red-400">
                Quarantined
              </span>
            )}
            {result.level === "medium" && (
              <span className="rounded border border-yellow-500/15 bg-yellow-500/8 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-yellow-400">
                Warning
              </span>
            )}
          </div>
          <p className="truncate text-[11px] text-text-secondary/60">{msg.body}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-[9px] text-text-secondary/40">{msg.time}</span>
          {isScam && (
            <ChevronRight size={12} className={`text-text-secondary/30 transition-transform ${isOpen ? "rotate-90" : ""}`} />
          )}
        </div>
      </button>

      {isOpen && isScam && (
        <div className="border-t border-white/[0.03] bg-black/20 px-4 py-3 animate-fade-in">
          <div className="mb-2 flex items-center gap-1.5">
            <ShieldAlert size={11} className={result.level === "high" ? "text-red-400" : "text-yellow-400"} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${result.level === "high" ? "text-red-400" : "text-yellow-400"}`}>
              Threat Level: {result.level} — Score {result.score}/100
            </span>
          </div>
          <ThreatBar score={result.score} level={result.level} />
          <div className="mt-3 space-y-1">
            {result.findings.slice(0, 3).map((f, i) => (
              <div key={i} className="flex items-start gap-1.5 text-[11px] text-text-secondary/60">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-honey/60" />
                {f.label}: <em className="text-text-secondary/40">{f.evidence}</em>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-green-500/10 bg-green-500/[0.04] px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-green-400/80">Safe Next Steps</p>
            <p className="mt-1 text-[11px] leading-relaxed text-text-secondary/50">
              Do not click links. Verify through the official app or website. Report as spam.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MessagesDemo() {
  const [openIdx, setOpenIdx] = useState(-1);

  return (
    <section className="relative px-6 py-28 sm:py-36">
      <div className="pointer-events-none absolute left-0 top-1/3 h-[400px] w-[400px] rounded-full bg-honey/[0.012] blur-[160px]" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <SectionLabel>Messages Companion</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-5 text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-text-primary">
              Your inbox,{" "}
              <span className="gradient-text">guarded.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-md text-[15px] leading-[1.7] text-text-secondary">
              STING analyzes messages you share with it — quarantining scams and
              letting safe messages through.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.3}>
          <div className="mx-auto max-w-[400px]">
            <div className="overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#111113] shadow-2xl shadow-black/40">
              {/* Phone header */}
              <div className="border-b border-white/[0.04] px-5 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <MessageSquare size={14} className="text-honey" />
                  <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-honey">
                    STING Companion Inbox
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="divide-y divide-white/[0.03]">
                {MESSAGES.map((msg, i) => (
                  <MessageRow
                    key={i}
                    msg={msg}
                    isOpen={openIdx === i}
                    onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-white/[0.04] px-5 py-3 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <Shield size={10} className="text-text-secondary/30" />
                  <span className="text-[9px] text-text-secondary/30">
                    Analyzes messages you share with STING
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-[10px] text-text-secondary/30">
              Demo simulation. STING analyzes shared/imported messages where platform APIs allow.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
