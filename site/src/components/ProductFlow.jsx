import { Link2, Search, ShieldCheck } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Link2,
    title: "Paste or open",
    desc: "Drop a suspicious link, forward a sketchy message, or let Sting scan the page you're on.",
    details: [
      "SMS messages",
      "Email links",
      "Shopping pages",
      "Login screens",
      "QR codes",
    ],
  },
  {
    num: "02",
    icon: Search,
    title: "Sting inspects",
    desc: "Deterministic + AI analysis checks every signal a scammer tries to hide.",
    details: [
      "Domain age & shape",
      "Pressure tactics",
      "Page claims vs reality",
      "Risky redirects",
      "Form behavior",
      "Impersonation patterns",
    ],
  },
  {
    num: "03",
    icon: ShieldCheck,
    title: "Verdict + receipt",
    desc: "Get a plain-English explanation, risk score, evidence trail, and exactly what to do next.",
    details: [
      "Risk score & level",
      "Signal breakdown",
      "Plain-English explanation",
      "Recommended next steps",
      "Shareable evidence receipt",
    ],
  },
];

export default function ProductFlow() {
  return (
    <section id="flow" className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-honey uppercase">
            How It Works
          </p>
          <h2 className="mb-4 text-3xl font-bold text-cream sm:text-4xl">
            Three steps. Thirty seconds.
          </h2>
          <p className="mx-auto max-w-xl text-text-secondary">
            Sting runs the same checks a security analyst would — then explains
            the result so anyone can understand it.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.num} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute top-12 -right-4 hidden h-px w-8 bg-gradient-to-r from-honey/40 to-transparent lg:block" />
              )}
              <div className="rounded-2xl border border-border bg-surface-raised p-8 transition-all hover:border-honey/30">
                <div className="mb-6 flex items-center gap-4">
                  <span className="font-mono text-3xl font-bold text-honey/30">
                    {step.num}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-honey/10 text-honey">
                    <step.icon size={24} />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-bold text-cream">
                  {step.title}
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-text-secondary">
                  {step.desc}
                </p>
                <ul className="space-y-2">
                  {step.details.map((d) => (
                    <li
                      key={d}
                      className="flex items-center gap-2 text-sm text-text-secondary"
                    >
                      <span className="h-1 w-1 rounded-full bg-honey" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
