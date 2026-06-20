import { architectureNodes } from "../data/demoData";
import {
  Globe,
  Brain,
  Database,
  BarChart3,
  Bug,
  Network,
} from "lucide-react";

const iconMap = {
  browserbase: Globe,
  anthropic: Brain,
  redis: Database,
  arize: BarChart3,
  sentry: Bug,
  fetch: Network,
};

export default function Architecture() {
  return (
    <section id="architecture" className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-honey uppercase">
            Architecture
          </p>
          <h2 className="mb-4 text-3xl font-bold text-cream sm:text-4xl">
            How the stack fits together.
          </h2>
          <p className="mx-auto max-w-xl text-text-secondary">
            Each sponsor technology solves a specific problem in the scam
            detection pipeline — not logo soup.
          </p>
        </div>

        {/* Pipeline flow */}
        <div className="mb-16 flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            <span className="rounded-md border border-border bg-surface-raised px-3 py-1.5 text-text-secondary">
              Suspicious input
            </span>
            <span className="text-honey">&rarr;</span>
            <span className="rounded-md border border-[#6366f1]/30 bg-[#6366f1]/10 px-3 py-1.5 text-[#818cf8]">
              Browserbase
            </span>
            <span className="text-honey">&rarr;</span>
            <span className="rounded-md border border-border bg-surface-raised px-3 py-1.5 text-text-secondary">
              Signal analysis
            </span>
            <span className="text-honey">&rarr;</span>
            <span className="rounded-md border border-[#d97706]/30 bg-[#d97706]/10 px-3 py-1.5 text-[#fbbf24]">
              Claude
            </span>
            <span className="text-honey">&rarr;</span>
            <span className="rounded-md border border-[#dc2626]/30 bg-[#dc2626]/10 px-3 py-1.5 text-[#f87171]">
              Redis
            </span>
            <span className="text-honey">&rarr;</span>
            <span className="rounded-md border border-border bg-surface-raised px-3 py-1.5 text-text-secondary">
              Verdict + receipt
            </span>
          </div>
        </div>

        {/* Detail cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {architectureNodes.map((node) => {
            const Icon = iconMap[node.id] || Globe;
            return (
              <div
                key={node.id}
                className="group rounded-xl border border-border bg-surface-raised p-6 transition-all hover:border-opacity-50"
                style={{
                  ["--node-color"]: node.color,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = node.color + "66")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "")
                }
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: node.color + "1a" }}
                  >
                    <Icon size={20} style={{ color: node.color }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-cream">
                      {node.name}
                    </h3>
                    <p
                      className="text-xs font-medium"
                      style={{ color: node.color }}
                    >
                      {node.role}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {node.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
