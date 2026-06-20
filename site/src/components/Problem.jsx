import {
  Mic,
  ShoppingBag,
  KeyRound,
  Headset,
  Clock,
  Bot,
} from "lucide-react";

const threats = [
  {
    icon: Mic,
    title: "AI voice clones",
    desc: "Deepfake calls that sound like your bank, your boss, or your family.",
  },
  {
    icon: ShoppingBag,
    title: "Fake stores",
    desc: "AI-generated product pages with stolen photos and impossible prices.",
  },
  {
    icon: KeyRound,
    title: "Cloned login pages",
    desc: "Pixel-perfect copies of your bank, email, or social media login.",
  },
  {
    icon: Headset,
    title: "Fake support agents",
    desc: 'AI chatbots posing as customer service to extract your credentials.',
  },
  {
    icon: Clock,
    title: "Urgency tactics",
    desc: '"Act now or lose access" — engineered panic to bypass your judgment.',
  },
  {
    icon: Bot,
    title: "AI-powered deception",
    desc: "Scammers now use the same AI tools you trust to make fakes undetectable.",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 text-sm font-semibold tracking-widest text-honey uppercase">
            The Problem
          </p>
          <h2 className="mb-6 text-3xl font-bold text-cream sm:text-4xl">
            Scams don&apos;t look fake anymore.
          </h2>
          <p className="text-lg text-text-secondary">
            Normal people need a fast, understandable warning — not a 40-page
            security report. Sting gives you a plain-English verdict in seconds.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {threats.map((threat) => (
            <div
              key={threat.title}
              className="group rounded-xl border border-border bg-surface-raised p-6 transition-all hover:border-honey/30 hover:bg-surface-overlay"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-honey/10 text-honey transition-colors group-hover:bg-honey/20">
                <threat.icon size={20} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-cream">
                {threat.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {threat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
