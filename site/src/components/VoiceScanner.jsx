import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { voiceDemoCases } from "../data/demoData";
import {
  Phone,
  PhoneOff,
  Mic,
  AlertTriangle,
  Shield,
  Volume2,
} from "lucide-react";
import { FadeIn, SectionLabel } from "./Motion";

function TranscriptionLine({ text, isHighlighted }) {
  return (
    <motion.span
      className={`inline ${isHighlighted ? "rounded bg-red-500/20 px-1 font-semibold text-red-300" : "text-text-secondary"}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {text}{" "}
    </motion.span>
  );
}

function LiveTranscription({ segments, currentIndex }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [currentIndex]);

  const dangerWords = [
    "ransom", "bitcoin", "police", "harmed", "wire", "money",
    "compromised", "social security", "account number", "verification",
    "arrested", "warrant",
    "大使馆", "警察", "逮捕", "转入", "犯罪", "资金",
  ];

  return (
    <div
      ref={containerRef}
      className="h-40 overflow-y-auto rounded-xl border border-white/[0.04] bg-black/30 p-5 font-mono text-[15px] leading-[2]"
    >
      <div className="flex items-center gap-2 mb-3">
        <motion.div
          className="h-2 w-2 rounded-full bg-red-500"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-[11px] font-medium tracking-widest text-red-400/80 uppercase">
          Deepgram Live Transcription
        </span>
      </div>
      <div className="space-y-0">
        {segments.slice(0, currentIndex + 1).map((seg, i) => {
          const hasDanger = dangerWords.some((w) =>
            seg.text.toLowerCase().includes(w.toLowerCase())
          );
          return (
            <TranscriptionLine
              key={i}
              text={seg.text}
              isHighlighted={hasDanger}
            />
          );
        })}
        {currentIndex < segments.length - 1 && (
          <motion.span
            className="inline-block h-4 w-0.5 bg-honey/80"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
}

function BigVerdict({ result }) {
  const isCritical = result.riskScore >= 90;
  return (
    <motion.div
      className={`rounded-2xl border-2 p-8 text-center ${
        isCritical
          ? "border-red-500/30 bg-red-500/[0.06]"
          : "border-orange-500/30 bg-orange-500/[0.06]"
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mb-4 flex justify-center"
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
      >
        <div
          className={`flex h-20 w-20 items-center justify-center rounded-full ${
            isCritical ? "bg-red-500/15" : "bg-orange-500/15"
          }`}
        >
          <AlertTriangle
            size={40}
            className={isCritical ? "text-red-400" : "text-orange-400"}
            strokeWidth={1.5}
          />
        </div>
      </motion.div>

      <motion.p
        className={`mb-2 text-[12px] font-bold tracking-widest uppercase ${
          isCritical ? "text-red-400" : "text-orange-400"
        }`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {result.riskLevel} RISK &mdash; Score {result.riskScore}/100
      </motion.p>

      <motion.h3
        className="mb-4 text-[22px] font-bold leading-snug text-text-primary sm:text-[26px]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {result.verdict}
      </motion.h3>

      <motion.p
        className="mx-auto max-w-lg text-[15px] leading-[1.7] text-text-secondary"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {result.explanation}
      </motion.p>
    </motion.div>
  );
}

function NextSteps({ steps }) {
  return (
    <motion.div
      className="mt-6 rounded-2xl border border-green-500/10 bg-green-500/[0.03] p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <h4 className="mb-4 flex items-center gap-2 text-[14px] font-bold text-green-400">
        <Shield size={18} />
        What You Should Do:
      </h4>
      <ol className="space-y-3">
        {steps.map((step, i) => (
          <motion.li
            key={i}
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.08 }}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500/10 font-mono text-[12px] font-bold text-green-400">
              {i + 1}
            </span>
            <span className="text-[15px] leading-[1.6] text-text-secondary">
              {step}
            </span>
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}

export default function VoiceScanner() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [transcriptIndex, setTranscriptIndex] = useState(0);

  const handleSelect = (caseItem) => {
    setSelectedCase(caseItem);
    setPhase("transcribing");
    setTranscriptIndex(0);
  };

  useEffect(() => {
    if (phase !== "transcribing" || !selectedCase) return;

    const segments = selectedCase.transcription;
    if (transcriptIndex >= segments.length - 1) {
      const timer = setTimeout(() => setPhase("analyzing"), 800);
      return () => clearTimeout(timer);
    }

    const nextDelay =
      (segments[transcriptIndex + 1].time - segments[transcriptIndex].time) * 300 + 200;

    const timer = setTimeout(() => {
      setTranscriptIndex((i) => i + 1);
    }, nextDelay);

    return () => clearTimeout(timer);
  }, [phase, transcriptIndex, selectedCase]);

  useEffect(() => {
    if (phase !== "analyzing") return;
    const timer = setTimeout(() => setPhase("result"), 1500);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <section id="voice-scanner" className="relative px-6 py-28 sm:py-36">
      <div className="pointer-events-none absolute left-0 top-1/4 h-[500px] w-[500px] rounded-full bg-[#13ef93]/[0.015] blur-[180px]" />

      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <SectionLabel>Voice Scam Scanner</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-5 text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-text-primary">
              Got a suspicious{" "}
              <span className="text-[#13ef93]">phone call?</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-lg text-[16px] leading-[1.7] text-text-secondary">
              Upload a recording or tap a scenario below. Deepgram transcribes
              the call in real time, then sting analyzes every word for scam
              signals.
            </p>
          </FadeIn>
        </div>

        {/* Scenario selector */}
        <FadeIn delay={0.3}>
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            {voiceDemoCases.map((c) => {
              const isActive = selectedCase?.id === c.id;
              return (
                <motion.button
                  key={c.id}
                  onClick={() => handleSelect(c)}
                  className={`group min-h-[80px] cursor-pointer rounded-2xl border-2 p-6 text-left transition-colors duration-300 ${
                    isActive
                      ? "border-[#13ef93]/30 bg-[#13ef93]/[0.04] shadow-lg shadow-[#13ef93]/10"
                      : "border-white/[0.06] bg-white/[0.02] hover:border-[#13ef93]/15 hover:bg-white/[0.04]"
                  }`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Phone
                      size={16}
                      className={isActive ? "text-[#13ef93]" : "text-text-secondary"}
                    />
                    <span
                      className={`text-[11px] font-semibold tracking-widest uppercase ${
                        isActive ? "text-[#13ef93]" : "text-text-secondary"
                      }`}
                    >
                      {c.type} &middot; {c.duration}
                    </span>
                  </div>
                  <h3 className="mb-1 text-[15px] font-semibold text-text-primary">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-[13px] text-text-secondary">
                    {c.language} &middot; Click to scan &rarr;
                  </p>
                </motion.button>
              );
            })}
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          {/* Idle state */}
          {phase === "idle" && !selectedCase && (
            <motion.div
              key="idle"
              className="glass flex flex-col items-center justify-center rounded-2xl py-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="mb-4"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Mic size={44} className="text-[#13ef93]/20" strokeWidth={1} />
              </motion.div>
              <p className="text-[16px] font-medium text-text-primary">
                Tap a call scenario above to scan it
              </p>
              <p className="mt-2 text-[14px] text-text-secondary">
                Or upload your own recording when using the extension
              </p>
            </motion.div>
          )}

          {/* Transcribing phase */}
          {phase === "transcribing" && selectedCase && (
            <motion.div
              key="transcribing"
              className="glass rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#13ef93]/10"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Volume2 size={18} className="text-[#13ef93]" />
                  </motion.div>
                  <div>
                    <p className="text-[14px] font-semibold text-text-primary">
                      Transcribing with Deepgram Nova-3
                    </p>
                    <p className="text-[12px] text-text-secondary">
                      {selectedCase.input.source} &middot; Detecting language...
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-1.5">
                  <motion.div
                    className="h-2 w-2 rounded-full bg-red-500"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-[11px] font-medium text-red-400">LIVE</span>
                </div>
              </div>

              <LiveTranscription
                segments={selectedCase.transcription}
                currentIndex={transcriptIndex}
              />

              <div className="mt-4 flex items-center justify-between text-[11px] text-text-secondary">
                <span>Language: {selectedCase.language}</span>
                <span>
                  Confidence: 0.{Math.floor(Math.random() * 3) + 95}
                </span>
              </div>
            </motion.div>
          )}

          {/* Analyzing phase */}
          {phase === "analyzing" && (
            <motion.div
              key="analyzing"
              className="glass flex flex-col items-center justify-center rounded-2xl py-20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="mb-5"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Shield size={32} className="text-honey/80" strokeWidth={1.5} />
              </motion.div>
              <p className="text-[16px] font-semibold text-text-primary">
                Analyzing transcript for scam signals...
              </p>
              <p className="mt-2 text-[14px] text-text-secondary">
                Checking against known scam patterns
              </p>
              <motion.div
                className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-white/[0.04]"
              >
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-honey to-red-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.3, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
          )}

          {/* Result phase */}
          {phase === "result" && selectedCase && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <BigVerdict result={selectedCase.result} />
              <NextSteps steps={selectedCase.result.nextSteps} />

              {/* Signals detail */}
              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <h4 className="mb-4 text-[12px] font-medium tracking-widest text-text-secondary uppercase">
                  Scam signals detected in this call
                </h4>
                <div className="space-y-2">
                  {selectedCase.result.signals.map((s, i) => (
                    <motion.div
                      key={i}
                      className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.08 }}
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <span
                          className={`inline-block rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            s.severity === "critical"
                              ? "border-red-500/10 bg-red-500/8 text-red-400"
                              : s.severity === "high"
                                ? "border-orange-500/10 bg-orange-500/8 text-orange-400"
                                : "border-yellow-500/10 bg-yellow-500/8 text-yellow-400"
                          }`}
                        >
                          {s.severity}
                        </span>
                        <span className="text-[14px] font-medium text-text-primary">
                          {s.label}
                        </span>
                      </div>
                      <p className="text-[13px] leading-[1.65] text-text-secondary">
                        {s.detail}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Scan another */}
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <motion.button
                  onClick={() => {
                    setSelectedCase(null);
                    setPhase("idle");
                    setTranscriptIndex(0);
                  }}
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-6 text-[14px] font-medium text-text-secondary transition-all hover:border-white/[0.12] hover:text-text-primary"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <PhoneOff size={16} />
                  Scan another call
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
