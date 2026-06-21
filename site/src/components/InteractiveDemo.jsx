import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Globe,
  AlertTriangle,
  CheckCircle,
  Download,
  ChevronRight,
  Shield,
  Loader2,
} from "lucide-react";
import { FadeIn, SectionLabel } from "./Motion";

const typeIcons = { SMS: MessageSquare, Website: Globe };

function SignalBadge({ severity }) {
  const colors = {
    critical: "bg-red-500/8 text-red-400 border-red-500/10",
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
  return (
    <div className="flex items-center gap-3">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width: `${width}%`,
            transition: "width 1.2s cubic-bezier(0.25,0.4,0.25,1)",
          }}
        />
      </div>
      <span className="font-mono text-xl font-bold text-text-primary tabular-nums">
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
    a.download = `sting-receipt-${caseData.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-4 overflow-hidden animate-slide-down">
      <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-5">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-mono text-[10px] font-medium tracking-widest text-text-muted uppercase">
            Evidence Receipt
          </h4>
          <button
            onClick={handleDownload}
            className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-[11px] text-text-muted transition-colors hover:bg-white/[0.04] hover:text-text-secondary hover:scale-[1.03] active:scale-[0.97]"
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

export default function InteractiveDemo() {
  const [demoCases, setDemoCases] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
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

    setTimeout(() => {
      setScanning(false);
      setShowResult(true);
    }, 2200);
  };

  const activeCase = selectedCase;

  return (
    <section id="demo" ref={sectionRef} className="relative px-6 py-28 sm:py-36">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-honey/[0.015] blur-[180px]" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <SectionLabel>Interactive Demo</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-5 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.12] tracking-[-0.025em] text-text-primary">
              See Sting{" "}
              <span className="gradient-text">in action.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-md text-[15px] leading-[1.7] text-text-secondary">
              Select a sample scam case. Watch the analysis unfold.
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
                  className={`group min-h-[72px] rounded-xl border p-5 text-left transition-all duration-300 hover:scale-[1.015] active:scale-[0.985] ${
                    isActive
                      ? "border-honey/15 bg-honey/[0.04]"
                      : "glass glass-hover"
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Icon
                      size={14}
                      strokeWidth={1.5}
                      className={isActive ? "text-honey" : "text-text-muted"}
                    />
                    <span
                      className={`text-[10px] font-medium tracking-widest uppercase ${isActive ? "text-honey/80" : "text-text-muted"}`}
                    >
                      {c.type}
                    </span>
                  </div>
                  <h3
                    className={`text-[13px] font-medium ${isActive ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary"}`}
                  >
                    {c.title}
                  </h3>
                </button>
              );
            })}
          </div>
        </FadeIn>

        {/* Empty state */}
        {!activeCase && (
          <div className="glass flex flex-col items-center justify-center rounded-2xl py-24 text-center animate-fade-in">
            <div className="animate-float">
              <Shield size={36} className="mb-4 text-white/[0.04]" strokeWidth={1} />
            </div>
            <p className="text-[14px] font-medium text-text-secondary">
              Select a case above to run a scan
            </p>
            <p className="mt-1.5 text-[12px] text-text-muted">
              Choose any of the three sample scenarios
            </p>
          </div>
        )}

        {/* Active case display */}
        {activeCase && (
          <div
            key={activeCase.id}
            className="glass overflow-hidden rounded-2xl animate-fade-in"
          >
            {/* Input preview */}
            <div className="border-b border-white/[0.04] p-6">
              <div className="mb-3 flex items-center gap-2 text-[10px] font-medium tracking-widest text-text-muted uppercase">
                <ChevronRight size={10} />
                Scanning input
              </div>
              <p className="mb-1.5 font-mono text-[11px] text-honey/70">
                {activeCase.input.source}
              </p>
              <p className="text-[13px] leading-[1.65] text-text-secondary">
                {activeCase.input.content}
              </p>
            </div>

            {/* Scanning state */}
            {scanning && (
              <div className="flex items-center justify-center py-24 animate-fade-in">
                <div className="flex flex-col items-center gap-5">
                  <Loader2 size={24} className="text-honey/80 animate-spin-slow" strokeWidth={1.5} />
                  <p className="text-[14px] font-medium text-text-secondary">
                    Analyzing signals...
                  </p>
                  <div className="relative h-px w-48 overflow-hidden rounded-full bg-white/[0.04]">
                    <div className="absolute inset-0 h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-honey/60 to-transparent animate-scan-bar" />
                  </div>
                </div>
              </div>
            )}

            {/* Result */}
            {showResult && (
              <div className="p-6 animate-fade-in">
                {/* Verdict header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between animate-slide-up">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      size={18}
                      strokeWidth={1.5}
                      className={
                        activeCase.result.riskScore >= 90
                          ? "mt-0.5 text-red-400"
                          : "mt-0.5 text-orange-400"
                      }
                    />
                    <div>
                      <p
                        className={`mb-1 text-[10px] font-bold tracking-widest uppercase ${
                          activeCase.result.riskLevel === "CRITICAL"
                            ? "text-red-400/80"
                            : "text-orange-400/80"
                        }`}
                      >
                        {activeCase.result.riskLevel} Risk
                      </p>
                      <p className="text-[15px] font-semibold tracking-[-0.01em] text-text-primary">
                        {activeCase.result.verdict}
                      </p>
                    </div>
                  </div>
                  <div className="w-full sm:w-48">
                    <RiskMeter score={activeCase.result.riskScore} />
                  </div>
                </div>

                {/* Signals */}
                <div className="mb-8 animate-slide-up" style={{ animationDelay: "0.15s" }}>
                  <h4 className="mb-4 text-[10px] font-medium tracking-widest text-text-muted uppercase">
                    Signals detected
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

                {/* Explanation */}
                <div
                  className="glow-border mb-8 rounded-xl bg-honey/[0.02] p-6 animate-slide-up"
                  style={{ animationDelay: "0.5s" }}
                >
                  <h4 className="mb-2.5 text-[11px] font-medium tracking-wider text-honey/70 uppercase">
                    Plain-English Explanation
                  </h4>
                  <p className="text-[13px] leading-[1.7] text-text-secondary">
                    {activeCase.result.explanation}
                  </p>
                </div>

                {/* Next steps */}
                <div className="mb-8 animate-slide-up" style={{ animationDelay: "0.6s" }}>
                  <h4 className="mb-4 text-[10px] font-medium tracking-widest text-text-muted uppercase">
                    What to do next
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
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/8 font-mono text-[9px] font-bold text-green-400/80">
                          {i + 1}
                        </span>
                        <span className="leading-[1.6] text-text-secondary">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Receipt toggle */}
                <div className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
                  <button
                    onClick={() => setShowReceipt(!showReceipt)}
                    className="flex h-10 items-center gap-2 rounded-full border border-white/[0.04] bg-white/[0.02] px-5 text-[12px] font-medium text-text-muted transition-all hover:border-white/[0.08] hover:text-text-secondary hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <CheckCircle size={13} strokeWidth={1.5} />
                    {showReceipt ? "Hide" : "View"} Evidence Receipt
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
