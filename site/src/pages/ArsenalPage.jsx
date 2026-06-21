import { useParams, Link } from "react-router-dom";
import { arsenalSponsors } from "../data/arsenalData";

function StatusBadge({ status, color }) {
  return (
    <span
      className="inline-block rounded-md px-3 py-1 text-[11px] font-bold tracking-widest uppercase"
      style={{ backgroundColor: color + "20", color }}
    >
      {status}
    </span>
  );
}

function CodeBlock({ children }) {
  return (
    <code className="rounded bg-white/[0.06] px-2 py-0.5 font-mono text-[12px] text-text-muted">
      {children}
    </code>
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
          ← back to home
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-4">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: sponsor.color }}
            />
            <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold text-text-primary">
              {sponsor.name}
            </h1>
            <StatusBadge status={sponsor.status} color={sponsor.color} />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: sponsor.color }}>
            {sponsor.role}
          </p>
          <p className="mt-3 text-[16px] leading-relaxed text-text-secondary">
            {sponsor.tagline}
          </p>
        </div>

        {/* What it does */}
        <section className="mb-8">
          <h2 className="mb-3 text-[14px] font-bold uppercase tracking-wider text-text-primary">
            what it does in cloak sting
          </h2>
          <div className="glass rounded-xl p-5">
            <p className="text-[14px] leading-[1.7] text-text-secondary">
              {sponsor.whatItDoes}
            </p>
          </div>
        </section>

        {/* Code paths */}
        <section className="mb-8">
          <h2 className="mb-3 text-[14px] font-bold uppercase tracking-wider text-text-primary">
            exact code paths
          </h2>
          <div className="glass rounded-xl p-5">
            <div className="flex flex-wrap gap-2">
              {sponsor.codePaths.map((f) => (
                <span
                  key={f}
                  className="rounded bg-white/[0.06] px-3 py-1.5 font-mono text-[12px] text-text-muted"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Demo command */}
        <section className="mb-8">
          <h2 className="mb-3 text-[14px] font-bold uppercase tracking-wider text-text-primary">
            demo command
          </h2>
          <div className="glass rounded-xl p-5">
            <code className="block rounded bg-black/40 px-4 py-3 font-mono text-[13px] text-honey">
              {sponsor.demoCommand}
            </code>
          </div>
        </section>

        {/* Live vs fallback */}
        <section className="mb-8">
          <h2 className="mb-3 text-[14px] font-bold uppercase tracking-wider text-text-primary">
            live vs fallback status
          </h2>
          <div className="glass rounded-xl p-5 space-y-4">
            <div>
              <span className="mb-1 inline-block rounded bg-green-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-green-400">
                with key
              </span>
              <p className="mt-1 text-[13px] leading-[1.6] text-text-secondary">
                {sponsor.liveStatus}
              </p>
            </div>
            <div>
              <span className="mb-1 inline-block rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-400">
                without key (demo mode)
              </span>
              <p className="mt-1 text-[13px] leading-[1.6] text-text-secondary">
                {sponsor.fallbackStatus}
              </p>
            </div>
          </div>
        </section>

        {/* Why it deserves the prize */}
        <section className="mb-8">
          <h2 className="mb-3 text-[14px] font-bold uppercase tracking-wider text-text-primary">
            why this deserves the prize
          </h2>
          <div className="glass rounded-xl p-5 border-l-2" style={{ borderColor: sponsor.color }}>
            <p className="text-[14px] leading-[1.7] text-text-secondary italic">
              {sponsor.whyDeservesPrize}
            </p>
          </div>
        </section>

        {/* What NOT to claim */}
        <section className="mb-12">
          <h2 className="mb-3 text-[14px] font-bold uppercase tracking-wider text-red-400">
            ⚠ what we are not claiming
          </h2>
          <div className="glass rounded-xl p-5">
            <ul className="space-y-2">
              {sponsor.doNotClaim.map((claim, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-text-muted">
                  <span className="mt-0.5 text-red-400">×</span>
                  {claim}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Other sponsors nav */}
        <section className="border-t border-white/[0.05] pt-8">
          <h3 className="mb-4 text-[12px] font-bold uppercase tracking-wider text-text-muted">
            other arsenal pages
          </h3>
          <div className="flex flex-wrap gap-2">
            {arsenalSponsors
              .filter((s) => s.slug !== slug)
              .map((s) => (
                <Link
                  key={s.slug}
                  to={`/arsenal/${s.slug}`}
                  className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-[12px] text-text-muted transition-colors hover:bg-white/[0.08] hover:text-text-primary"
                >
                  {s.name}
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
