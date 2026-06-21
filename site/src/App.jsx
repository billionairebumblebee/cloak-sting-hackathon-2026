import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
const ArsenalPage = lazy(() => import("./pages/ArsenalPage"));

function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Suspense>
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-honey/[0.01] to-transparent" />
            <Problem />
            <div className="section-divider mx-6" />
            <ProductFlow />
            <div className="section-divider mx-6" />
            <VoiceScanner />
            <div className="section-divider mx-6" />
            <InteractiveDemo />
            <div className="section-divider mx-6" />
            <HallOfFame />
            <div className="section-divider mx-6" />
            <SponsorShowcase />
            <div className="section-divider mx-6" />
            <Architecture />
          </div>
        </Suspense>
      </main>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}

function ArsenalLayout() {
  return (
    <>
      <Navbar />
      <Suspense>
        <ArsenalPage />
      </Suspense>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen">
        {/* Gradient mesh background — multi-layer */}
        <div className="gradient-mesh">
          {/* Layer 1: slow (60s) */}
          <div className="mesh-orb-amber" />
          <div className="mesh-orb-teal" />
          {/* Layer 2: mid-speed (30s) */}
          <div className="mesh-orb-purple" />
          <div className="mesh-orb-rose" />
        </div>

        {/* Film grain */}
        <div className="grain-overlay" />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/arsenal/:slug" element={<ArsenalLayout />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
