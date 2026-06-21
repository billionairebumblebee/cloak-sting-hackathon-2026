import { lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

const Problem = lazy(() => import("./components/Problem"));
const ProductFlow = lazy(() => import("./components/ProductFlow"));
const VoiceScanner = lazy(() => import("./components/VoiceScanner"));
const InteractiveDemo = lazy(() => import("./components/InteractiveDemo"));
const HallOfFame = lazy(() => import("./components/HallOfFame"));
const SponsorShowcase = lazy(() => import("./components/SponsorShowcase"));
const Architecture = lazy(() => import("./components/Architecture"));
const Footer = lazy(() => import("./components/Footer"));

function SectionDivider() {
  return (
    <div className="section-divider mx-6">
      <motion.div
        className="absolute inset-0"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
      />
    </div>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen">
      {/* Gradient mesh background — multi-layer */}
      <div className="gradient-mesh">
        <div className="mesh-orb-amber" />
        <div className="mesh-orb-teal" />
        <div className="mesh-orb-purple" />
        <div className="mesh-orb-rose" />
      </div>

      {/* Film grain */}
      <div className="grain-overlay" />

      {/* Cursor glow */}
      <div className="cursor-glow" id="cursor-glow" />

      <Navbar />
      <main>
        <Hero />
        <Suspense>
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-honey/[0.01] to-transparent" />
            <Problem />
            <SectionDivider />
            <ProductFlow />
            <SectionDivider />
            <VoiceScanner />
            <SectionDivider />
            <InteractiveDemo />
            <SectionDivider />
            <HallOfFame />
            <SectionDivider />
            <SponsorShowcase />
            <SectionDivider />
            <Architecture />
          </div>
        </Suspense>
      </main>
      <Suspense>
        <Footer />
      </Suspense>
    </div>
  );
}
