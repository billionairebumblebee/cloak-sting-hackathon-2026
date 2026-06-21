import { Shield, ExternalLink, FileText, ArrowRight } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, SectionLabel } from "./Motion";

const authorities = [
  {
    name: "FTC ReportFraud",
    url: "https://reportfraud.ftc.gov/",
    when: "All consumer fraud — phishing, impersonation, fake fees",
    color: "#3b82f6",
  },
  {
    name: "FBI IC3",
    url: "https://www.ic3.gov/",
    when: "Internet-enabled crime — online scams, ransomware, BEC",
    color: "#6366f1",
  },
  {
    name: "CFPB",
    url: "https://www.consumerfinance.gov/complaint/",
    when: "Bank fraud, credit card scams, predatory lending",
    color: "#10b981",
  },
  {
    name: "SEC / CFTC",
    url: "https://www.sec.gov/tcr",
    when: "Crypto scams, fake investments, pump-and-dump schemes",
    color: "#f59e0b",
  },
];

const steps = [
  { label: "STING detects scam", detail: "Signals analyzed in real time" },
  { label: "Evidence packaged", detail: "Structured report with findings" },
  { label: "Channels identified", detail: "Matched to the right authorities" },
  { label: "You file the report", detail: "Direct links to official portals" },
];

export default function ReportingRoutes() {
  return (
    <section id="reporting-routes" className="relative px-6 py-28 sm:py-36">
      <div className="pointer-events-none absolute top-0 right-1/4 h-[400px] w-[400px] rounded-full bg-amber-500/[0.012] blur-[180px]" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <SectionLabel>Reporting Routes</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-5 text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-text-primary">
              One report.{" "}
              <span className="text-text-muted">Right channels.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-lg text-[16px] leading-[1.7] text-text-secondary">
              STING packages your scam evidence into a structured report and
              routes it to the authorities that can actually act. You file — we
              never submit on your behalf.
            </p>
          </FadeIn>
        </div>

        {/* Pipeline steps */}
        <FadeIn delay={0.3}>
          <div className="mb-16 flex flex-wrap items-center justify-center gap-3">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-center">
                  <p className="font-mono text-[12px] font-semibold text-text-primary">
                    {step.label}
                  </p>
                  <p className="text-[10px] text-text-muted">{step.detail}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight
                    size={14}
                    className="text-white/[0.12] animate-arrow-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                )}
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Authority cards */}
        <StaggerContainer
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.06}
        >
          {authorities.map((auth) => (
            <StaggerItem key={auth.name}>
              <div className="glass rounded-2xl p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: auth.color + "0d" }}
                  >
                    <Shield
                      size={17}
                      style={{ color: auth.color }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-text-primary">
                    {auth.name}
                  </h3>
                </div>
                <p className="mb-4 text-[12px] leading-[1.65] text-text-secondary">
                  {auth.when}
                </p>
                <a
                  href={auth.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-honey/70 transition-colors hover:text-honey"
                >
                  Visit portal{" "}
                  <ExternalLink size={10} className="opacity-60" />
                </a>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Report packet preview */}
        <FadeIn delay={0.5}>
          <div className="glass mx-auto mt-12 max-w-2xl rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-3">
              <FileText size={18} className="text-honey/60" />
              <h3 className="text-[14px] font-semibold text-text-primary">
                Structured Evidence Packet
              </h3>
            </div>
            <div className="rounded-xl bg-black/30 p-4 font-mono text-[11px] leading-[1.7] text-text-muted">
              <p className="text-text-secondary">
                {"{"} caseId, summary, evidence: {"{"} url, hostname, signals
                {"}"},{" "}
              </p>
              <p className="text-text-secondary">
                {"  "}recommendedChannels: [{"{"} name, url, reason, howToFile{" "}
                {"}"}],
              </p>
              <p className="text-honey/50">
                {"  "}disclaimer: &quot;STING does not submit reports on your
                behalf.&quot;
              </p>
              <p className="text-text-secondary">
                {"  "}userNote: &quot;Copy this report and paste into the forms
                above.&quot; {"}"}
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Disclaimer */}
        <FadeIn delay={0.6}>
          <p className="mt-8 text-center text-[12px] text-text-muted">
            STING does not submit reports. You file with official channels.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
