import { useState } from "react";

export default function VideoShowcase() {
  const [activeTab, setActiveTab] = useState("hype");

  const videos = {
    hype: {
      src: "/sting-launch-hype.mp4",
      title: "Launch Hype",
      description: "STING in 30 seconds.",
    },
    demo: {
      src: "/demo-with-voice-over.mp4",
      title: "Full Demo",
      description: "Watch STING detect scams in real time — with narration.",
    },
  };

  const current = videos[activeTab];

  return (
    <section id="videos" className="relative py-24 px-6">
      <div className="mx-auto max-w-5xl text-center">
        <span className="inline-block rounded-full border border-honey/30 bg-honey/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-honey">
          See it in action
        </span>
        <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="text-white">Don't take our word for it.</span>{" "}
          <span className="text-honey">Watch.</span>
        </h2>
        <p className="mt-4 text-neutral-400 text-lg max-w-2xl mx-auto">
          Two videos. One story. STING catches what others miss.
        </p>

        {/* Tab switcher */}
        <div className="mt-8 inline-flex gap-2 rounded-xl bg-neutral-900/60 border border-neutral-700/50 p-1.5">
          {Object.entries(videos).map(([key, v]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === key
                  ? "bg-honey/20 text-honey border border-honey/40 shadow-lg shadow-honey/10"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
              }`}
            >
              {v.title}
            </button>
          ))}
        </div>

        {/* Video player */}
        <div className="mt-8 relative rounded-2xl overflow-hidden border border-neutral-700/50 bg-black/40 shadow-2xl shadow-honey/5">
          <video
            key={current.src}
            controls
            playsInline
            preload="metadata"
            className="w-full aspect-video"
            poster=""
          >
            <source src={current.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pointer-events-none">
            <p className="text-left text-sm text-neutral-300">{current.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
