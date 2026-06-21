import { useState, useEffect, useRef } from "react";
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
import { playScanStart, playThreatDetected, playVerdictSlam, playWarningBeep } from "../utils/sounds";

const typeIcons = { SMS: MessageSquare, Website: Globe };

function SignalBadge({ severity }) {
  const colors = {
    critical:
      "bg-red-500/10 text-red-400 border-red-500/15 shadow-sm animate-severity-pulse",
    high: "bg-orange-500/8 text-orange-400 border-orange-500/10",
    medium: "bg-yellow-500/8 text-yellow-400 border-yellow-500/10",
  };
  return (
    <span
      className={`inline-block rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${colors[severity] || colors.medium}`}
    >
      {severity}
    </span>
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
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width: `${width}%`,
            transition: "width 1.2s cubic-bezier(0.25,0.4,0.25,1)",
          }}
        />
      </div>
      <span className={`font-mono text-2xl font-bold tabular-nums animate-verdict-slam ${textColor}`}>
        {score}
      </span>
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
    <div className="mt-4 overflow-hidden animate-slide-down">
      <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-5">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-mono text-[10px] font-medium tracking-widest text-text-muted uppercase">
            Evidence Dossier
          </h4>
          <button
            onClick={handleDownload}
            className="flex h-11 items-center gap-1.5 rounded-lg px-4 text-[12px] font-medium text-text-secondary transition-all hover:bg-white/[0.04] hover:text-text-primary hover:scale-[1.03] active:scale-[0.97]"
          >
            <Download size={11} />
            Download JSON
          </button>
        </div>
        <pre className="max-h-48 overflow-auto font-mono text-[10px] leading-[1.7] text-text-muted">
          {JSON.stringify(receipt, null, 2)}
        </pre>
      </div>
    </div>
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
    playScanStart();

    const phaseInterval = setInterval(() => {
      setScanPhase((p) => {
        if (p >= scanPhases.length - 1) {
          clearInterval(phaseInterval);
          return p;
        }
        playWarningBeep();
        return p + 1;
      });
    }, 600);

    setTimeout(() => {
      clearInterval(phaseInterval);
      setScanning(false);
      setShowResult(true);
      playThreatDetected();
      setTimeout(() => playVerdictSlam(), 300);
    }, 2600);
  };

  const activeCase = selectedCase;

  return (
    <section id="demo" ref={sectionRef} className="relative px-6 py-28 sm:py-36">
      {/* Ambient glow */}
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
                <button
                  key={c.id}
                  onClick={() => handleSelect(c)}
                  className={`group min-h-[80px] cursor-pointer rounded-2xl border-2 p-6 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                    isActive
                      ? "border-honey/40 bg-honey/[0.06] shadow-lg shadow-honey/10"
                      : "border-white/[0.06] bg-white/[0.02] hover:border-honey/20 hover:bg-white/[0.04]"
                  }`}
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
                  <h3
                    className={`text-[15px] font-semibold ${isActive ? "text-text-primary" : "text-text-primary"}`}
                  >
                    {c.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] text-text-secondary">
                    Click to scan &rarr;
                  </p>
                </button>
              );
            })}
          </div>
        </FadeIn>

        {/* Empty state */}
        {!activeCase && (
          <div className="glass flex flex-col items-center justify-center rounded-2xl py-24 text-center animate-fade-in">
            <div className="animate-spin-slow">
              <Crosshair size={36} className="mb-4 text-white/[0.06]" strokeWidth={1} />
            </div>
            <p className="text-[16px] font-medium text-text-primary">
              Select a scam scenario above to begin
            </p>
            <p className="mt-1.5 text-[14px] text-text-secondary">
              Choose a scam scenario and watch sting tear it apart
            </p>
          </div>
        )}

        {/* Active case display */}
        {activeCase && (
          <div
            key={activeCase.id}
            className="glass overflow-hidden rounded-2xl animate-fade-in"
          >
            {/* Input preview — target acquired */}
            <div className="border-b border-white/[0.04] p-6">
              <div className="mb-3 flex items-center gap-2 text-[10px] font-medium tracking-widest uppercase">
                <Crosshair size={10} className="text-red-400/80" />
                <span className="text-red-400/70">Target acquired</span>
              </div>
              <p className="mb-1.5 font-mono text-[11px] text-honey/70">
                {activeCase.input.source}
              </p>
              <p className="text-[13px] leading-[1.65] text-text-secondary">
                {activeCase.input.content}
              </p>
            </div>

            {/* Scanning state — predator lock-on */}
            {scanning && (
              <div className="relative flex items-center justify-center overflow-hidden py-24 animate-fade-in">
                {/* Red sweep lines */}
                <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-red-500/30 to-transparent animate-sweep-h" />
                <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent animate-sweep-v" />

                <div className="flex flex-col items-center gap-5">
                  <div className="relative">
                    <Crosshair size={28} className="text-red-400/80 animate-spin-slow" strokeWidth={1.5} />
                    <div className="absolute -inset-3 rounded-full border border-red-500/20 animate-pulse-ring" />
                  </div>
                  <p className="text-[14px] font-medium text-text-secondary">
                    {scanPhases[scanPhase]}
                  </p>
                  <div className="relative h-1 w-48 overflow-hidden rounded-full bg-white/[0.04]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-honey"
                      style={{
                        width: scanning ? "100%" : "0%",
                        transition: "width 2.4s ease-in-out",
                      }}
                    />
                    <div className="absolute inset-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-scan-bar" />
                  </div>
                </div>
              </div>
            )}

            {/* Result */}
            {showResult && (
              <div className="p-6 animate-fade-in">
                {/* Verdict header — judgment style */}
                <div
                  className={`mb-8 rounded-xl p-5 animate-slide-up ${
                    activeCase.result.riskLevel === "CRITICAL"
                      ? "glow-border-danger bg-red-500/[0.04]"
                      : "glow-border bg-orange-500/[0.03]"
                  }`}
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
                </div>

                {/* Signals */}
                <div className="mb-8 animate-slide-up" style={{ animationDelay: "0.15s" }}>
                  <h4 className="mb-4 flex items-center gap-2 text-[10px] font-medium tracking-widest text-text-muted uppercase">
                    <Zap size={11} className="text-honey/60" />
                    Threat signals identified
                  </h4>
                  <div className="space-y-2">
                    {activeCase.result.signals.map((s, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4"
                        style={{
                          animation: `slideInLeft 0.4s ease ${0.3 + i * 0.06}s both`,
                        }}
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
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation — The Breakdown */}
                <div
                  className="glow-border mb-8 rounded-xl bg-honey/[0.02] p-6 animate-slide-up"
                  style={{ animationDelay: "0.5s" }}
                >
                  <h4 className="mb-2.5 text-[11px] font-medium tracking-wider text-honey/70 uppercase">
                    The Breakdown
                  </h4>
                  <p className="text-[13px] leading-[1.7] text-text-secondary">
                    {activeCase.result.explanation}
                  </p>
                </div>

                {/* Counter-strike steps */}
                <div className="mb-8 animate-slide-up" style={{ animationDelay: "0.6s" }}>
                  <h4 className="mb-4 text-[10px] font-medium tracking-widest text-text-muted uppercase">
                    Your counter-strike
                  </h4>
                  <ol className="space-y-3">
                    {activeCase.result.nextSteps.map((step, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-[13px]"
                        style={{
                          animation: `slideInLeft 0.3s ease ${0.65 + i * 0.05}s both`,
                        }}
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-honey/10 font-mono text-[9px] font-bold text-honey/80">
                          {i + 1}
                        </span>
                        <span className="leading-[1.6] text-text-secondary">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Dossier toggle */}
                <div className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
                  <button
                    onClick={() => setShowReceipt(!showReceipt)}
                    className="flex h-12 items-center gap-2 rounded-full border border-honey/20 bg-honey/[0.06] px-6 text-[13px] font-semibold text-honey transition-all hover:bg-honey/10 hover:border-honey/30 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <CheckCircle size={13} strokeWidth={1.5} />
                    {showReceipt ? "Hide" : "View"} Evidence Dossier
                  </button>

                  {showReceipt && <Receipt caseData={activeCase} />}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
