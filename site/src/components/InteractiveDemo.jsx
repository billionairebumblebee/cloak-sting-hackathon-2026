import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Globe,
  CheckCircle,
  Download,
  Crosshair,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { FadeIn, SectionLabel } from "./Motion";

const typeIcons = { SMS: MessageSquare, Website: Globe };

function SignalBadge({ severity }) {
  const colors = {
    critical:
      "bg-red-500/10 text-red-400 border-red-500/15 shadow-sm",
    high: "bg-orange-500/8 text-orange-400 border-orange-500/10",
    medium: "bg-yellow-500/8 text-yellow-400 border-yellow-500/10",
  };
  return (
    <motion.span
      className={`inline-block rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${colors[severity] || colors.medium}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {severity}
    </motion.span>
  );
}

function RiskMeter({ score }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 200);
    return () => clearTimeout(t);
  }, [score]);

  const color =
    score >= 90
      ? "bg-gradient-to-r from-red-600 to-red-400"
      : score >= 70
        ? "bg-gradient-to-r from-orange-600 to-orange-400"
        : score >= 40
          ? "bg-gradient-to-r from-yellow-600 to-yellow-400"
          : "bg-gradient-to-r from-green-600 to-green-400";
  const textColor =
    score >= 90
      ? "text-red-400"
      : score >= 70
        ? "text-orange-400"
        : "text-text-primary";
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1.2, ease: [0.25, 0.4, 0.25, 1] }}
        />
      </div>
      <motion.span
        className={`font-mono text-2xl font-bold tabular-nums ${textColor}`}
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
      >
        {score}
      </motion.span>
    </div>
  );
}

function Receipt({ caseData }) {
  const [receipt] = useState(() => {
    const now = new Date().toISOString();
    const rid = Date.now().toString(36).toUpperCase();
    return {
      id: `STING-${caseData.id.toUpperCase()}-${rid}`,
      timestamp: now,
      source: caseData.input.source,
      verdict: caseData.result.verdict,
      riskScore: caseData.result.riskScore,
      signals: caseData.result.signals.map((s) => ({
        type: s.type,
        label: s.label,
        severity: s.severity,
      })),
      recommendation: caseData.result.nextSteps[0],
    };
  });

  const handleDownload = () => {
    const text = JSON.stringify(receipt, null, 2);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sting-dossier-${caseData.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      className="mt-4 overflow-hidden"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-5">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-mono text-[10px] font-medium tracking-widest text-text-muted uppercase">
            Evidence Dossier
          </h4>
          <motion.button
            onClick={handleDownload}
            className="flex h-11 items-center gap-1.5 rounded-lg px-4 text-[12px] font-medium text-text-secondary transition-all hover:bg-white/[0.04] hover:text-text-primary"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Download size={11} />
            Download JSON
          </motion.button>
        </div>
        <pre className="max-h-48 overflow-auto font-mono text-[10px] leading-[1.7] text-text-muted">
          {JSON.stringify(receipt, null, 2)}
        </pre>
      </div>
    </motion.div>
  );
}

const scanPhases = [
  "Acquiring target...",
  "Analyzing threat signals...",
  "Cross-referencing patterns...",
  "Rendering judgment...",
];

export default function InteractiveDemo() {
  const [demoCases, setDemoCases] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [scanPhase, setScanPhase] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          import("../data/demoData").then((m) => setDemoCases(m.demoCases));
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSelect = (caseItem) => {
    setSelectedCase(caseItem);
    setShowResult(false);
    setShowReceipt(false);
    setScanning(true);
    setScanPhase(0);

    const phaseInterval = setInterval(() => {
      setScanPhase((p) => {
        if (p >= scanPhases.length - 1) {
          clearInterval(phaseInterval);
          return p;
        }
        return p + 1;
      });
    }, 600);

    setTimeout(() => {
      clearInterval(phaseInterval);
      setScanning(false);
      setShowResult(true);
    }, 2600);
  };

  const activeCase = selectedCase;

  return (
    <section id="demo" ref={sectionRef} className="relative px-6 py-28 sm:py-36">
      <div className="pointer-events-none absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-honey/[0.015] blur-[180px]" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <SectionLabel>Live Demo</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-5 text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-text-primary">
              Watch sting{" "}
              <span className="gradient-text">hunt.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-md text-[16px] leading-[1.7] text-text-secondary">
              Pick a scam scenario below and watch sting tear it apart in real time.
            </p>
          </FadeIn>
        </div>

        {/* Case selector */}
        <FadeIn delay={0.3}>
          <div className="mb-8 grid gap-3 sm:grid-cols-3">
            {(demoCases || []).map((c) => {
              const Icon = typeIcons[c.type] || Globe;
              const isActive = activeCase?.id === c.id;
              return (
                <motion.button
                  key={c.id}
                  onClick={() => handleSelect(c)}
                  className={`group min-h-[80px] cursor-pointer rounded-2xl border-2 p-6 text-left transition-colors duration-300 ${
                    isActive
                      ? "border-honey/40 bg-honey/[0.06] shadow-lg shadow-honey/10"
                      : "border-white/[0.06] bg-white/[0.02] hover:border-honey/20 hover:bg-white/[0.04]"
                  }`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Icon
                      size={16}
                      strokeWidth={1.5}
                      className={isActive ? "text-honey" : "text-text-secondary"}
                    />
                    <span
                      className={`text-[11px] font-semibold tracking-widest uppercase ${isActive ? "text-honey" : "text-text-secondary"}`}
                    >
                      {c.type}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-text-primary">
                    {c.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] text-text-secondary">
                    Click to scan &rarr;
                  </p>
                </motion.button>
              );
            })}
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          {/* Empty state */}
          {!activeCase && (
            <motion.div
              key="empty"
              className="glass flex flex-col items-center justify-center rounded-2xl py-24 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Crosshair size={36} className="mb-4 text-white/[0.06]" strokeWidth={1} />
              </motion.div>
              <p className="text-[16px] font-medium text-text-primary">
                Select a scam scenario above to begin
              </p>
              <p className="mt-1.5 text-[14px] text-text-secondary">
                Choose a scam scenario and watch sting tear it apart
              </p>
            </motion.div>
          )}

          {/* Active case display */}
          {activeCase && (
            <motion.div
              key={activeCase.id}
              className="glass overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Input preview */}
              <div className="border-b border-white/[0.04] p-6">
                <motion.div
                  className="mb-3 flex items-center gap-2 text-[10px] font-medium tracking-widest uppercase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Crosshair size={10} className="text-red-400/80" />
                  </motion.div>
                  <span className="text-red-400/70">Target acquired</span>
                </motion.div>
                <p className="mb-1.5 font-mono text-[11px] text-honey/70">
                  {activeCase.input.source}
                </p>
                <p className="text-[13px] leading-[1.65] text-text-secondary">
                  {activeCase.input.content}
                </p>
              </div>

              {/* Scanning state */}
              <AnimatePresence mode="wait">
                {scanning && (
                  <motion.div
                    key="scanning"
                    className="relative flex items-center justify-center overflow-hidden py-24"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Animated sweep lines */}
                    <motion.div
                      className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-red-500/30 to-transparent"
                      animate={{ left: ["0%", "100%"] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent"
                      animate={{ top: ["0%", "100%"] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                    />

                    <div className="flex flex-col items-center gap-5">
                      <div className="relative">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Crosshair size={28} className="text-red-400/80" strokeWidth={1.5} />
                        </motion.div>
                        <motion.div
                          className="absolute -inset-3 rounded-full border border-red-500/20"
                          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </div>
                      <motion.p
                        key={scanPhase}
                        className="text-[14px] font-medium text-text-secondary"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {scanPhases[scanPhase]}
                      </motion.p>
                      <div className="relative h-1.5 w-48 overflow-hidden rounded-full bg-white/[0.04]">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-red-500 to-honey"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2.4, ease: "easeInOut" }}
                        />
                        <motion.div
                          className="absolute inset-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ left: ["-25%", "125%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Result */}
              {showResult && (
                <motion.div
                  className="p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Verdict header */}
                  <motion.div
                    className={`mb-8 rounded-xl p-5 ${
                      activeCase.result.riskLevel === "CRITICAL"
                        ? "glow-border-danger bg-red-500/[0.04]"
                        : "glow-border bg-orange-500/[0.03]"
                    }`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <ShieldAlert
                          size={20}
                          strokeWidth={1.5}
                          className={
                            activeCase.result.riskScore >= 90
                              ? "mt-0.5 text-red-400"
                              : "mt-0.5 text-orange-400"
                          }
                        />
                        <div>
                          <p
                            className={`mb-1.5 text-[11px] font-bold tracking-widest uppercase ${
                              activeCase.result.riskLevel === "CRITICAL"
                                ? "text-red-400"
                                : "text-orange-400"
                            }`}
                          >
                            {activeCase.result.riskLevel === "CRITICAL"
                              ? "GUILTY — CRITICAL THREAT"
                              : "GUILTY — HIGH THREAT"}
                          </p>
                          <p className="text-base font-bold text-cream">
                            {activeCase.result.verdict}
                          </p>
                        </div>
                      </div>
                      <div className="w-full sm:w-52">
                        <RiskMeter score={activeCase.result.riskScore} />
                      </div>
                    </div>
                  </motion.div>

                  {/* Signals */}
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="mb-4 flex items-center gap-2 text-[10px] font-medium tracking-widest text-text-muted uppercase">
                      <Zap size={11} className="text-honey/60" />
                      Threat signals identified
                    </h4>
                    <div className="space-y-2">
                      {activeCase.result.signals.map((s, i) => (
                        <motion.div
                          key={i}
                          className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4 transition-colors duration-300 hover:bg-white/[0.03]"
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.06 }}
                        >
                          <div className="mb-1.5 flex items-center gap-2">
                            <SignalBadge severity={s.severity} />
                            <span className="text-[13px] font-medium text-text-primary">
                              {s.label}
                            </span>
                          </div>
                          <p className="text-[12px] leading-[1.65] text-text-secondary">
                            {s.detail}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Explanation */}
                  <motion.div
                    className="glow-border mb-8 rounded-xl bg-honey/[0.02] p-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h4 className="mb-2.5 text-[11px] font-medium tracking-wider text-honey/70 uppercase">
                      The Breakdown
                    </h4>
                    <p className="text-[13px] leading-[1.7] text-text-secondary">
                      {activeCase.result.explanation}
                    </p>
                  </motion.div>

                  {/* Counter-strike steps */}
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h4 className="mb-4 text-[10px] font-medium tracking-widest text-text-muted uppercase">
                      Your counter-strike
                    </h4>
                    <ol className="space-y-3">
                      {activeCase.result.nextSteps.map((step, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start gap-3 text-[13px]"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.65 + i * 0.05 }}
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-honey/10 font-mono text-[9px] font-bold text-honey/80">
                            {i + 1}
                          </span>
                          <span className="leading-[1.6] text-text-secondary">{step}</span>
                        </motion.li>
                      ))}
                    </ol>
                  </motion.div>

                  {/* Dossier toggle */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <motion.button
                      onClick={() => setShowReceipt(!showReceipt)}
                      className="flex h-12 items-center gap-2 rounded-full border border-honey/20 bg-honey/[0.06] px-6 text-[13px] font-semibold text-honey transition-colors hover:bg-honey/10 hover:border-honey/30"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <CheckCircle size={13} strokeWidth={1.5} />
                      {showReceipt ? "Hide" : "View"} Evidence Dossier
                    </motion.button>

                    <AnimatePresence>
                      {showReceipt && <Receipt caseData={activeCase} />}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
