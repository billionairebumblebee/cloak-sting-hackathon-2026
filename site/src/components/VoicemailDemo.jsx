import { useState } from "react";
import { Phone, ShieldAlert, ShieldCheck, Play, ChevronDown } from "lucide-react";
import { FadeIn } from "./Motion";

const voicemails = [
  {
    id: 1,
    caller: "Unknown",
    duration: "0:34",
    transcript:
      "This is the IRS. You owe back taxes and must act now. Failure to pay immediately will result in arrest. This is your final notice.",
    level: "scam",
    score: 82,
    signals: ["Urgency pressure", "IRS impersonation", "Threat of arrest"],
  },
  {
    id: 2,
    caller: "Mom",
    duration: "0:12",
    transcript: "Hi sweetie, just calling to check in. Love you!",
    level: "safe",
    score: 0,
    signals: [],
  },
  {
    id: 3,
    caller: "Unknown",
    duration: "1:02",
    transcript:
      "Grandma? It's me, I'm in jail and I need bail money. Send $5,000 in gift cards. Do not tell mom and dad.",
    level: "scam",
    score: 91,
    signals: ["Secrecy pressure", "Gift card payment", "Social engineering"],
  },
];

function VoicemailEntry({ vm, isExpanded, onToggle }) {
  const isScam = vm.level === "scam";

  function handlePlay(e) {
    e.stopPropagation();
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(vm.transcript);
    utter.rate = 1.0;
    window.speechSynthesis.speak(utter);
  }

  return (
    <div
      className="border-b border-white/[0.04] last:border-b-0"
      onClick={onToggle}
    >
      <div className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02]">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
            isScam
              ? "bg-red-500/10 text-red-400"
              : "bg-green-500/10 text-green-400"
          }`}
        >
          {vm.caller[0]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-text-primary">
              {vm.caller}
            </span>
            <span className="text-[11px] text-text-secondary">
              {vm.duration}
            </span>
          </div>
          <p className="truncate text-[12px] text-text-secondary">
            {vm.transcript}
          </p>
        </div>
        {isScam ? (
          <span className="shrink-0 rounded-md border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-400">
            Quarantined
          </span>
        ) : (
          <ShieldCheck size={16} className="shrink-0 text-green-400/60" />
        )}
        <ChevronDown
          size={14}
          className={`shrink-0 text-text-secondary transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>

      {isExpanded && (
        <div className="border-t border-white/[0.03] bg-black/20 px-4 py-3">
          <p className="mb-2 text-[12px] leading-relaxed text-text-primary">
            &ldquo;{vm.transcript}&rdquo;
          </p>
          {isScam && (
            <div className="mb-2 rounded-lg border border-red-500/10 bg-red-500/[0.04] p-2">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-red-400">
                STING Analysis — Score {vm.score}/100
              </p>
              <div className="flex flex-wrap gap-1">
                {vm.signals.map((s, i) => (
                  <span
                    key={i}
                    className="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] text-red-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={handlePlay}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 text-[11px] text-text-secondary transition-colors hover:border-honey/30 hover:text-honey"
          >
            <Play size={10} />
            Play
          </button>
        </div>
      )}
    </div>
  );
}

export default function VoicemailDemo() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <div className="flex flex-col items-center md:flex-row md:items-start md:gap-12">
            {/* Phone mockup */}
            <div className="w-full max-w-[320px] shrink-0">
              <div className="overflow-hidden rounded-[24px] border border-white/[0.06] bg-surface shadow-2xl shadow-black/40">
                {/* Phone header */}
                <div className="flex items-center justify-between border-b border-white/[0.04] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-honey" />
                    <span className="text-[13px] font-semibold text-text-primary">
                      Voicemail
                    </span>
                  </div>
                  <span className="rounded-full bg-honey/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-honey">
                    STING
                  </span>
                </div>

                {/* Voicemail list */}
                <div>
                  {voicemails.map((vm) => (
                    <VoicemailEntry
                      key={vm.id}
                      vm={vm}
                      isExpanded={expandedId === vm.id}
                      onToggle={() =>
                        setExpandedId(expandedId === vm.id ? null : vm.id)
                      }
                    />
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-white/[0.04] px-4 py-2 text-center">
                  <p className="text-[9px] text-text-secondary">
                    Analyzes voicemail transcripts where platform APIs allow
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8 md:mt-4">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-honey/10 bg-honey/[0.04] px-3 py-1">
                <ShieldAlert size={12} className="text-honey" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-honey">
                  Voicemail Quarantine
                </span>
              </div>
              <h3 className="mb-3 text-[24px] font-bold leading-tight text-text-primary sm:text-[28px]">
                Scam voicemails,{" "}
                <span className="text-honey">caught before you listen.</span>
              </h3>
              <p className="max-w-md text-[15px] leading-[1.7] text-text-secondary">
                STING analyzes voicemail transcripts for known scam patterns —
                urgency pressure, impersonation, credential harvesting, and
                social engineering — then quarantines threats before they reach
                you.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
