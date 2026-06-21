import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

const Problem = lazy(() => import("./components/Problem"));
const ProductFlow = lazy(() => import("./components/ProductFlow"));
const VoiceScanner = lazy(() => import("./components/VoiceScanner"));
const InteractiveDemo = lazy(() => import("./components/InteractiveDemo"));
const HallOfFame = lazy(() => import("./components/HallOfFame"));
const Architecture = lazy(() => import("./components/Architecture"));
const Footer = lazy(() => import("./components/Footer"));

export default function App() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Suspense>
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-honey/[0.01] to-transparent" />
            <Problem />
            <ProductFlow />
            <VoiceScanner />
            <InteractiveDemo />
            <HallOfFame />
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
