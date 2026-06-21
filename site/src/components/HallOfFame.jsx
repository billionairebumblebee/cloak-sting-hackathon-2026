import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Mail, Phone, Flame, AlertTriangle, Database } from "lucide-react";
import { scammerBlacklist } from "../data/demoData";
import { FadeIn, SectionLabel, GlowCard, CountUp } from "./Motion";

const typeIcons = {
  domain: Globe,
  email: Mail,
  phone: Phone,
};

const riskColors = {
  critical: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", glow: "rgba(239, 68, 68, 0.15)" },
  high: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", glow: "rgba(249, 115, 22, 0.12)" },
  medium: { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", glow: "rgba(234, 179, 8, 0.08)" },
};

const scamTypeLabels = {
  phishing: "Phishing",
  "fake-store": "Fake Store",
  impersonation: "Impersonation",
  vishing: "Vishing",
};

const filterTabs = [
  { key: "all", label: "All" },
  { key: "domain", label: "Domains" },
  { key: "email", label: "Emails" },
  { key: "phone", label: "Phones" },
];

function HeatIndicator({ reportCount, maxReports }) {
  const intensity = Math.min(reportCount / maxReports, 1);
  const flames = intensity > 0.7 ? 3 : intensity > 0.4 ? 2 : 1;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: flames }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
        >
          <Flame
            size={12}
            className={intensity > 0.7 ? "text-red-400" : intensity > 0.4 ? "text-orange-400" : "text-yellow-500"}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function HallOfFame() {
  const [activeFilter, setActiveFilter] = useState("all");

  const totalReports = useMemo(
    () => scammerBlacklist.reduce((sum, entry) => sum + entry.reportCount, 0),
    [],
  );

  const maxReports = useMemo(
    () => Math.max(...scammerBlacklist.map((e) => e.reportCount)),
    [],
  );

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? scammerBlacklist
        : scammerBlacklist.filter((e) => e.type === activeFilter),
    [activeFilter],
  );

  return (
    <section id="hall-of-fame" className="relative px-6 py-28 sm:py-36">
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-500/[0.02] blur-[200px]" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <SectionLabel>Wall of Shame</SectionLabel>
          <FadeIn delay={0.1}>
            <h2 className="mb-5 text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-text-primary">
              Scammer Hall of{" "}
              <span className="text-danger">Fame</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-lg text-[16px] leading-[1.7] text-text-secondary">
              Every scam sting catches becomes shared memory. These are real
              patterns from our detection pipeline.
            </p>
          </FadeIn>
        </div>

        {/* Live counter */}
        <FadeIn delay={0.3}>
          <div className="mb-10 flex justify-center">
            <motion.div
              className="glass rounded-xl px-6 py-3 text-center"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AlertTriangle size={16} className="text-danger" />
                </motion.div>
                <span className="font-mono text-2xl font-bold text-text-primary">
                  <CountUp target={totalReports} />
                </span>
                <span className="text-[14px] text-text-secondary">
                  total reports filed
                </span>
              </div>
            </motion.div>
          </div>
        </FadeIn>

        {/* Filter tabs */}
        <FadeIn delay={0.35}>
          <div className="mb-8 flex justify-center gap-2">
            {filterTabs.map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`relative min-h-[44px] rounded-xl px-5 py-2.5 text-[13px] font-semibold transition-colors duration-300 ${
                  activeFilter === tab.key
                    ? "text-danger"
                    : "border border-white/[0.06] bg-white/[0.03] text-text-secondary hover:text-text-primary"
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {activeFilter === tab.key && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-danger/40 bg-danger/10"
                    layoutId="filter-active"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </FadeIn>

        {/* Table */}
        <FadeIn delay={0.4}>
          <div className="glass overflow-hidden rounded-2xl">
            {/* Table header */}
            <div className="grid grid-cols-[2rem_1fr_4.5rem_4rem_5.5rem_5.5rem] items-center gap-3 border-b border-white/[0.04] px-5 py-3 text-[11px] font-medium tracking-[0.08em] text-text-muted uppercase sm:grid-cols-[2.5rem_1fr_5rem_4.5rem_6rem_6.5rem]">
              <span>Type</span>
              <span>Value</span>
              <span>Risk</span>
              <span>Heat</span>
              <span className="hidden sm:block">First Seen</span>
              <span>Scam Type</span>
            </div>

            {/* Rows */}
            <AnimatePresence mode="popLayout">
              {filtered.map((entry, i) => {
                const Icon = typeIcons[entry.type];
                const risk = riskColors[entry.riskLevel];

                return (
                  <motion.div
                    key={entry.value}
                    className="group grid grid-cols-[2rem_1fr_4.5rem_4rem_5.5rem_5.5rem] items-center gap-3 border-b border-white/[0.02] px-5 py-3 transition-colors duration-300 hover:bg-red-500/[0.03] sm:grid-cols-[2.5rem_1fr_5rem_4.5rem_6rem_6.5rem]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    layout
                  >
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${risk.bg}`}>
                      <Icon size={13} className={risk.text} />
                    </div>

                    <span className="truncate font-mono text-[12px] text-text-primary group-hover:text-red-300 transition-colors duration-300">
                      {entry.value}
                    </span>

                    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase ${risk.text} ${risk.bg} ${risk.border}`}>
                      {entry.riskLevel}
                    </span>

                    <HeatIndicator
                      reportCount={entry.reportCount}
                      maxReports={maxReports}
                    />

                    <span className="hidden text-[11px] text-text-muted sm:block">
                      {new Date(entry.firstSeen).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "2-digit",
                      })}
                    </span>

                    <span className="text-[11px] text-text-secondary capitalize">
                      {scamTypeLabels[entry.associatedScamType] || entry.associatedScamType}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </FadeIn>

        {/* Redis callout */}
        <FadeIn delay={0.5}>
          <GlowCard className="mt-10 p-6">
            <div className="flex items-start gap-4">
              <motion.div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10"
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
                <Database size={17} className="text-red-400" />
              </motion.div>
              <div>
                <h4 className="mb-1.5 text-[13px] font-semibold text-text-primary">
                  Powered by Redis scam memory
                </h4>
                <p className="text-[12px] leading-[1.7] text-text-secondary">
                  Every receipt becomes a shared blocklist entry, repeated
                  sightings create a heat map, and families can reuse evidence
                  instead of facing each scam alone.
                </p>
              </div>
            </div>
          </GlowCard>
        </FadeIn>
      </div>
    </section>
  );
}
