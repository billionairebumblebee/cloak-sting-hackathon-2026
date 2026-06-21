import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { demoCases } from "../data/demoData";
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
      "bg-red-500/15 text-red-400 border-red-500/25 shadow-red-500/10 shadow-sm animate-severity-pulse",
    high: "bg-orange-500/15 text-orange-400 border-orange-500/20 shadow-orange-500/10 shadow-sm",
    medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/15",
  };
  return (
    <span
      className={`inline-block rounded-md border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${colors[severity] || colors.medium}`}
    >
      {severity}
    </span>
  );
}

function RiskMeter({ score }) {
  const color =
    score >= 90
      ? "bg-gradient-to-r from-red-700 via-red-500 to-red-400"
      : score >= 70
        ? "bg-gradient-to-r from-orange-700 via-orange-500 to-orange-400"
        : score >= 40
          ? "bg-gradient-to-r from-yellow-600 to-yellow-400"
          : "bg-gradient-to-r from-green-600 to-green-400";

  const glowColor =
    score >= 90 ? "shadow-red-500/30" : score >= 70 ? "shadow-orange-500/20" : "";

  return (
    <div className="flex items-center gap-3">
      <div className={`h-2 flex-1 overflow-hidden rounded-full bg-white/[0.04] ${glowColor} shadow-lg`}>
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1], delay: 0.2 }}
        />
      </div>
      <motion.span
        className={`font-mono text-3xl font-black tabular-nums ${
          score >= 90 ? "text-red-400" : score >= 70 ? "text-orange-400" : "text-cream"
        }`}
        initial={{ opacity: 0, scale: 1.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {score}
      </motion.span>
    </div>
  );
}

function Receipt({ caseData }) {
  const now = new Date().toISOString();
  const receipt = {
    id: `STING-${caseData.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
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

  const handleDownload = () => {
    const text = JSON.stringify(receipt, null, 2);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sting-receipt-${caseData.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 overflow-hidden"
    >
      <div className="glass rounded-xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-mono text-[10px] font-semibold tracking-widest text-honey uppercase">
            Evidence Dossier
          </h4>
          <motion.button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-[11px] text-text-secondary transition-colors hover:text-honey"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={11} />
            Download JSON
          </motion.button>
        </div>
        <pre className="max-h-48 overflow-auto font-mono text-[10px] leading-relaxed text-text-secondary">
          {JSON.stringify(receipt, null, 2)}
        </pre>
      </div>
    </motion.div>
  );
}

export default function InteractiveDemo() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [scanPhase, setScanPhase] = useState(0);

  const scanPhases = [
    "Acquiring target...",
    "Analyzing threat signals...",
    "Cross-referencing known patterns...",
    "Rendering judgment...",
  ];

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
    <section id="demo" className="relative px-6 py-32 sm:py-40">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-honey/[0.02] blur-[150px]" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-20 text-center">
          <SectionLabel>Live Demo</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-5 text-4xl font-bold tracking-tight text-cream sm:text-5xl">
              Watch Sting{" "}
              <span className="gradient-text">hunt.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-md text-base text-text-secondary">
              Pick a target. Watch it get dissected in real time.
            </p>
          </FadeIn>
        </div>

        {/* Case selector */}
        <FadeIn delay={0.3}>
          <div className="mb-8 grid gap-3 sm:grid-cols-3">
            {demoCases.map((c) => {
              const Icon = typeIcons[c.type] || Globe;
              const isActive = activeCase?.id === c.id;
              return (
                <motion.button
                  key={c.id}
                  onClick={() => handleSelect(c)}
                  className={`group rounded-xl border p-5 text-left transition-all duration-300 ${
                    isActive
                      ? "border-honey/25 bg-honey/[0.08]"
                      : "glass glass-hover"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Icon
                      size={14}
                      strokeWidth={1.5}
                      className={isActive ? "text-honey" : "text-text-muted"}
                    />
                    <span
                      className={`text-[10px] font-semibold tracking-widest uppercase ${isActive ? "text-honey" : "text-text-muted"}`}
                    >
                      {c.type}
                    </span>
                  </div>
                  <h3
                    className={`text-[13px] font-semibold ${isActive ? "text-cream" : "text-text-secondary group-hover:text-cream"}`}
                  >
                    {c.title}
                  </h3>
                </motion.button>
              );
            })}
          </div>
        </FadeIn>

        {/* Empty state */}
        <AnimatePresence mode="wait">
          {!activeCase && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass flex flex-col items-center justify-center rounded-2xl py-24 text-center"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Crosshair size={40} className="mb-4 text-honey/20" strokeWidth={1} />
              </motion.div>
              <p className="text-sm font-semibold text-text-secondary">
                Select a target to begin the hunt
              </p>
              <p className="mt-1 text-[12px] text-text-muted">
                Choose a scam scenario and watch Sting tear it apart
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active case display */}
        <AnimatePresence mode="wait">
          {activeCase && (
            <motion.div
              key={activeCase.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="glass overflow-hidden rounded-2xl"
            >
              {/* Input preview */}
              <div className="border-b border-white/[0.04] p-6">
                <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold tracking-widest text-text-muted uppercase">
                  <Crosshair size={10} className="text-red-400/60" />
                  Target acquired
                </div>
                <p className="mb-1 font-mono text-[11px] text-honey/80">
                  {activeCase.input.source}
                </p>
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  {activeCase.input.content}
                </p>
              </div>

              {/* Scanning state — predator lock-on */}
              <AnimatePresence mode="wait">
                {scanning && (
                  <motion.div
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative flex items-center justify-center py-24"
                  >
                    {/* Red sweep lines */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                      <motion.div
                        className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-red-500/30 to-transparent"
                        animate={{ x: ["0%", "100vw"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.div
                        className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent"
                        animate={{ y: ["0%", "300%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    </div>

                    <div className="flex flex-col items-center gap-5">
                      {/* Pulsing crosshair */}
                      <motion.div
                        className="relative"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <Crosshair size={32} className="text-red-400" strokeWidth={1.5} />
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <div className="h-8 w-8 rounded-full border border-red-500/30" />
                        </motion.div>
                      </motion.div>

                      <AnimatePresence mode="wait">
                        <motion.p
                          key={scanPhase}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="font-mono text-sm font-medium text-red-400/80"
                        >
                          {scanPhases[scanPhase]}
                        </motion.p>
                      </AnimatePresence>

                      {/* Aggressive progress bar */}
                      <div className="relative h-1 w-56 overflow-hidden rounded-full bg-white/[0.04]">
                        <motion.div
                          className="absolute inset-0 h-full bg-gradient-to-r from-red-600 via-red-400 to-honey"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2.4, ease: "easeInOut" }}
                        />
                        <motion.div
                          className="absolute inset-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: ["-100%", "500%"] }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Result — JUDGMENT */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="p-6"
                  >
                    {/* Verdict header — conviction, not suggestion */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                      className={`mb-8 rounded-xl p-5 ${
                        activeCase.result.riskLevel === "CRITICAL"
                          ? "glow-border-danger bg-red-500/[0.04]"
                          : "glow-border bg-orange-500/[0.03]"
                      }`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3">
                          <motion.div
                            initial={{ rotate: -20, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                          >
                            <ShieldAlert
                              size={24}
                              strokeWidth={2}
                              className={
                                activeCase.result.riskScore >= 90
                                  ? "mt-0.5 text-red-400"
                                  : "mt-0.5 text-orange-400"
                              }
                            />
                          </motion.div>
                          <div>
                            <motion.p
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.15 }}
                              className={`mb-1 text-[11px] font-black tracking-widest uppercase ${
                                activeCase.result.riskLevel === "CRITICAL"
                                  ? "text-red-400"
                                  : "text-orange-400"
                              }`}
                            >
                              {activeCase.result.riskLevel === "CRITICAL"
                                ? "GUILTY \u2014 CRITICAL THREAT"
                                : "GUILTY \u2014 HIGH THREAT"}
                            </motion.p>
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
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="mb-8"
                    >
                      <h4 className="mb-4 flex items-center gap-2 text-[10px] font-bold tracking-widest text-red-400/70 uppercase">
                        <Zap size={10} />
                        Threat signals identified
                      </h4>
                      <div className="space-y-2">
                        {activeCase.result.signals.map((s, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.08 }}
                            className={`glass rounded-xl p-4 ${
                              s.severity === "critical"
                                ? "border-red-500/10"
                                : ""
                            }`}
                          >
                            <div className="mb-1.5 flex items-center gap-2">
                              <SignalBadge severity={s.severity} />
                              <span className="text-[13px] font-bold text-cream">
                                {s.label}
                              </span>
                            </div>
                            <p className="text-[12px] leading-relaxed text-text-secondary">
                              {s.detail}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Explanation */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="glow-border mb-8 rounded-xl bg-honey/[0.03] p-6"
                    >
                      <h4 className="mb-2 text-[11px] font-bold tracking-wider text-honey uppercase">
                        The Breakdown
                      </h4>
                      <p className="text-[13px] leading-relaxed text-cream/80">
                        {activeCase.result.explanation}
                      </p>
                    </motion.div>

                    {/* Next steps — empowering, not cautious */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="mb-8"
                    >
                      <h4 className="mb-4 text-[10px] font-bold tracking-widest text-honey/70 uppercase">
                        Your counter-strike
                      </h4>
                      <ol className="space-y-2.5">
                        {activeCase.result.nextSteps.map((step, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.75 + i * 0.06 }}
                            className="flex items-start gap-3 text-[13px]"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-honey/15 font-mono text-[9px] font-black text-honey">
                              {i + 1}
                            </span>
                            <span className="text-text-secondary">{step}</span>
                          </motion.li>
                        ))}
                      </ol>
                    </motion.div>

                    {/* Receipt toggle */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <motion.button
                        onClick={() => setShowReceipt(!showReceipt)}
                        className="glass flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-semibold text-text-secondary transition-all hover:text-cream"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
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
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
