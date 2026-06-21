import { useParams, Link } from "react-router-dom";
import { arsenalSponsors } from "../data/arsenalData";

const PIPELINE_STAGES = [
  { key: "scan", label: "Scan", sponsors: ["deepgram", "browserbase"] },
  { key: "detect", label: "Detect", sponsors: ["token-company"] },
  { key: "explain", label: "Explain", sponsors: ["anthropic"] },
  { key: "remember", label: "Remember", sponsors: ["redis"] },
  { key: "evaluate", label: "Evaluate", sponsors: ["arize"] },
  { key: "monitor", label: "Monitor", sponsors: ["sentry"] },
  { key: "connect", label: "Connect", sponsors: ["asi-one"] },
  { key: "harden", label: "Harden", sponsors: ["simular"] },
  { key: "present", label: "Present", sponsors: ["pika-midjourney"] },
];

function StatusBadge({ status, color }) {
  const bgOpacity = "20";
  return (
    <span
      className="inline-block rounded-full px-3 py-1 text-[11px] font-bold tracking-widest uppercase"
      style={{ backgroundColor: color + bgOpacity, color }}
    >
      {status}
    </span>
  );
}

function PipelinePosition({ slug, color }) {
  const activeStage = PIPELINE_STAGES.find((s) => s.sponsors.includes(slug));
  if (!activeStage) return null;

  return (
    <div className="mb-10">
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">
        where it fits in the pipeline
      </h3>
      <div className="flex flex-wrap items-center gap-1">
        {PIPELINE_STAGES.map((stage, i) => {
          const isActive = stage.key === activeStage.key;
          return (
            <div key={stage.key} className="flex items-center">
              <div
                className={`rounded-md px-3 py-1.5 text-[11px] font-medium transition-all ${
                  isActive
                    ? "font-bold ring-1"
                    : "bg-white/[0.03] text-text-muted"
                }`}
                style={
                  isActive
                    ? { backgroundColor: color + "20", color, ringColor: color }
                    : {}
                }
              >
                {stage.label}
              </div>
              {i < PIPELINE_STAGES.length - 1 && (
                <span className="mx-0.5 text-[10px] text-text-muted/50">→</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HighlightBox({ color, children }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border-l-4 p-6"
      style={{ borderColor: color, backgroundColor: color + "08" }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: color }}
      />
      {children}
    </div>
  );
}

export default function ArsenalPage() {
  const { slug } = useParams();
  const sponsor = arsenalSponsors.find((s) => s.slug === slug);

  if (!sponsor) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary">sponsor not found</h1>
          <Link to="/" className="mt-4 inline-block text-honey hover:underline">
            ← back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-6 py-20">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <Link
          to="/#sponsors"
          className="mb-8 inline-flex items-center gap-2 text-[13px] text-text-muted transition-colors hover:text-honey"
        >
          ← back to arsenal
        </Link>

        {/* Hero header */}
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-4">
            <div
              className="h-5 w-5 rounded-full shadow-lg"
              style={{ backgroundColor: sponsor.color, boxShadow: `0 0 20px ${sponsor.color}40` }}
            />
            <h1 className="text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-tight text-text-primary">
              {sponsor.name}
            </h1>
            <StatusBadge status={sponsor.status} color={sponsor.color} />
          </div>
          <p
            className="text-[13px] font-bold uppercase tracking-widest"
            style={{ color: sponsor.color }}
          >
            {sponsor.role}
          </p>
          <p className="mt-4 text-[18px] font-medium leading-relaxed text-text-secondary">
            {sponsor.tagline}
          </p>
        </div>

        {/* Pipeline position */}
        <PipelinePosition slug={slug} color={sponsor.color} />

        {/* The Story — why we used it */}
        <section className="mb-10">
          <h2 className="mb-4 text-[15px] font-bold uppercase tracking-wider text-text-primary">
            how we use it
          </h2>
          <div className="glass rounded-2xl p-6">
            <p className="text-[15px] leading-[1.8] text-text-secondary">
              {sponsor.whatItDoes}
            </p>
          </div>
        </section>

        {/* Why we deserve the prize — the hero section */}
        <section className="mb-10">
          <h2 className="mb-4 text-[15px] font-bold uppercase tracking-wider text-text-primary">
            why we should win this prize
          </h2>
          <HighlightBox color={sponsor.color}>
            <p className="text-[15px] leading-[1.8] text-text-primary/90">
              {sponsor.whyDeservesPrize}
            </p>
          </HighlightBox>
        </section>

        {/* Live vs Fallback — split view */}
        <section className="mb-10">
          <h2 className="mb-4 text-[15px] font-bold uppercase tracking-wider text-text-primary">
            live vs fallback
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="glass rounded-2xl p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-green-400">
                  with key
                </span>
              </div>
              <p className="text-[13px] leading-[1.7] text-text-secondary">
                {sponsor.liveStatus}
              </p>
            </div>
            <div className="glass rounded-2xl p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  demo mode
                </span>
              </div>
              <p className="text-[13px] leading-[1.7] text-text-secondary">
                {sponsor.fallbackStatus}
              </p>
            </div>
          </div>
        </section>

        {/* Code paths + demo command */}
        <section className="mb-10">
          <h2 className="mb-4 text-[15px] font-bold uppercase tracking-wider text-text-primary">
            prove it — code & demo
          </h2>
          <div className="glass rounded-2xl p-6 space-y-5">
            <div>
              <h4 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                code paths
              </h4>
              <div className="flex flex-wrap gap-2">
                {sponsor.codePaths.map((f) => (
                  <span
                    key={f}
                    className="rounded-lg bg-white/[0.06] px-3 py-1.5 font-mono text-[12px] text-text-muted transition-colors hover:bg-white/[0.1] hover:text-text-primary"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                run it yourself
              </h4>
              <code className="block rounded-lg bg-black/50 px-4 py-3 font-mono text-[13px] text-honey">
                $ {sponsor.demoCommand}
              </code>
            </div>
          </div>
        </section>

        {/* Honesty section */}
        <section className="mb-12">
          <h2 className="mb-4 text-[15px] font-bold uppercase tracking-wider text-red-400/80">
            what we are NOT claiming
          </h2>
          <div className="glass rounded-2xl p-6">
            <ul className="space-y-3">
              {sponsor.doNotClaim.map((claim, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px] leading-[1.6] text-text-muted">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-500/10 text-[10px] text-red-400">
                    ✕
                  </span>
                  {claim}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Other sponsors nav */}
        <section className="border-t border-white/[0.06] pt-8">
          <h3 className="mb-4 text-[12px] font-bold uppercase tracking-wider text-text-muted">
            explore other integrations
          </h3>
          <div className="flex flex-wrap gap-2">
            {arsenalSponsors
              .filter((s) => s.slug !== slug)
              .map((s) => (
                <Link
                  key={s.slug}
                  to={`/arsenal/${s.slug}`}
                  className="group flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-[12px] text-text-muted transition-all hover:bg-white/[0.08] hover:text-text-primary hover:ring-1 hover:ring-white/[0.06]"
                >
                  <div
                    className="h-2 w-2 rounded-full transition-transform group-hover:scale-125"
                    style={{ backgroundColor: s.color }}
                  />
                  {s.name}
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
