import { useState } from "react";
import { demoCases } from "../data/demoData";
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

const typeIcons = { SMS: MessageSquare, Website: Globe };

function SignalBadge({ severity }) {
  const colors = {
    critical: "bg-danger/15 text-red-400 border-red-500/20",
    high: "bg-orange-500/15 text-orange-400 border-orange-500/20",
    medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  };
  return (
    <span
      className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${colors[severity] || colors.medium}`}
    >
      {severity}
    </span>
  );
}

function RiskMeter({ score }) {
  const color =
    score >= 90
      ? "bg-danger"
      : score >= 70
        ? "bg-orange-500"
        : score >= 40
          ? "bg-warn"
          : "bg-safe";
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-overlay">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="font-mono text-2xl font-bold text-cream">{score}</span>
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
    <div className="mt-4 rounded-lg border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-mono text-xs font-semibold text-honey">
          EVIDENCE RECEIPT
        </h4>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1 text-xs text-text-secondary transition-colors hover:text-honey"
        >
          <Download size={12} />
          Download
        </button>
      </div>
      <pre className="max-h-48 overflow-auto text-[11px] leading-relaxed text-text-secondary">
        {JSON.stringify(receipt, null, 2)}
      </pre>
    </div>
  );
}

export default function InteractiveDemo() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleSelect = (caseItem) => {
    setSelectedCase(caseItem);
    setShowResult(false);
    setShowReceipt(false);
    setScanning(true);

    setTimeout(() => {
      setScanning(false);
      setShowResult(true);
    }, 2000);
  };

  const activeCase = selectedCase;

  return (
    <section id="demo" className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-honey uppercase">
            Interactive Demo
          </p>
          <h2 className="mb-4 text-3xl font-bold text-cream sm:text-4xl">
            See Sting in action.
          </h2>
          <p className="mx-auto max-w-xl text-text-secondary">
            Select a sample scam case below. Sting will analyze it and produce a
            verdict, evidence breakdown, and safe next steps.
          </p>
        </div>

        {/* Case selector */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {demoCases.map((c) => {
            const Icon = typeIcons[c.type] || Globe;
            const isActive = activeCase?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleSelect(c)}
                className={`group rounded-xl border p-5 text-left transition-all ${
                  isActive
                    ? "border-honey bg-honey/10"
                    : "border-border bg-surface-raised hover:border-honey/30"
                }`}
              >
                <div className="mb-3 flex items-center gap-2">
                  <Icon
                    size={16}
                    className={isActive ? "text-honey" : "text-text-secondary"}
                  />
                  <span
                    className={`text-xs font-semibold uppercase ${isActive ? "text-honey" : "text-text-secondary"}`}
                  >
                    {c.type}
                  </span>
                </div>
                <h3
                  className={`text-sm font-semibold ${isActive ? "text-cream" : "text-text-secondary group-hover:text-cream"}`}
                >
                  {c.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Empty state */}
        {!activeCase && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
            <Shield size={48} className="mb-4 text-border" />
            <p className="text-lg font-medium text-text-secondary">
              Select a case above to run a scan
            </p>
            <p className="mt-1 text-sm text-text-secondary/60">
              Choose any of the three sample scam scenarios
            </p>
          </div>
        )}

        {/* Active case display */}
        {activeCase && (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-raised">
            {/* Input preview */}
            <div className="border-b border-border p-6">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-text-secondary uppercase">
                <ChevronRight size={12} />
                Scanning input
              </div>
              <p className="mb-1 font-mono text-xs text-honey">
                {activeCase.input.source}
              </p>
              <p className="text-sm leading-relaxed text-text-secondary">
                {activeCase.input.content}
              </p>
            </div>

            {/* Scanning state */}
            {scanning && (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <Loader2
                    size={32}
                    className="animate-spin text-honey"
                  />
                  <p className="font-medium text-text-secondary">
                    Analyzing signals...
                  </p>
                  <div className="relative h-1 w-48 overflow-hidden rounded-full bg-surface-overlay">
                    <div className="animate-scan-line absolute inset-0 h-full w-1/3 rounded-full bg-honey" />
                  </div>
                </div>
              </div>
            )}

            {/* Result */}
            {showResult && (
              <div className="p-6">
                {/* Verdict header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      size={24}
                      className={
                        activeCase.result.riskScore >= 90
                          ? "mt-0.5 text-red-400"
                          : "mt-0.5 text-orange-400"
                      }
                    />
                    <div>
                      <p
                        className={`mb-1 text-xs font-bold uppercase ${
                          activeCase.result.riskLevel === "CRITICAL"
                            ? "text-red-400"
                            : "text-orange-400"
                        }`}
                      >
                        {activeCase.result.riskLevel} RISK
                      </p>
                      <p className="text-lg font-semibold text-cream">
                        {activeCase.result.verdict}
                      </p>
                    </div>
                  </div>
                  <div className="w-full sm:w-48">
                    <RiskMeter score={activeCase.result.riskScore} />
                  </div>
                </div>

                {/* Signals */}
                <div className="mb-6">
                  <h4 className="mb-3 text-sm font-semibold text-text-secondary uppercase">
                    Signals detected
                  </h4>
                  <div className="space-y-3">
                    {activeCase.result.signals.map((s, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-border bg-surface p-4"
                      >
                        <div className="mb-1 flex items-center gap-2">
                          <SignalBadge severity={s.severity} />
                          <span className="text-sm font-semibold text-cream">
                            {s.label}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary">
                          {s.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                <div className="mb-6 rounded-lg border border-honey/20 bg-honey/5 p-5">
                  <h4 className="mb-2 text-sm font-semibold text-honey">
                    Plain-English Explanation
                  </h4>
                  <p className="text-sm leading-relaxed text-cream/90">
                    {activeCase.result.explanation}
                  </p>
                </div>

                {/* Next steps */}
                <div className="mb-6">
                  <h4 className="mb-3 text-sm font-semibold text-text-secondary uppercase">
                    What to do next
                  </h4>
                  <ol className="space-y-2">
                    {activeCase.result.nextSteps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-safe/20 font-mono text-[10px] font-bold text-green-400">
                          {i + 1}
                        </span>
                        <span className="text-text-secondary">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Receipt toggle */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowReceipt(!showReceipt)}
                    className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-all hover:border-honey/30 hover:text-cream"
                  >
                    <CheckCircle size={14} />
                    {showReceipt ? "Hide" : "View"} Evidence Receipt
                  </button>
                </div>

                {showReceipt && <Receipt caseData={activeCase} />}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
