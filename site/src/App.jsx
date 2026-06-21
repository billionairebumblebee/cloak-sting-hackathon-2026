import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

const Problem = lazy(() => import("./components/Problem"));
const ProductFlow = lazy(() => import("./components/ProductFlow"));
const InteractiveDemo = lazy(() => import("./components/InteractiveDemo"));
const HallOfFame = lazy(() => import("./components/HallOfFame"));
const Architecture = lazy(() => import("./components/Architecture"));
const Footer = lazy(() => import("./components/Footer"));

function LazyFallback() {
  return <div className="flex items-center justify-center py-32" />;
}

export default function App() {
  return (
    <div className="relative min-h-screen">
      <div className="noise-overlay" />

      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<LazyFallback />}>
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-honey/[0.01] to-transparent" />
            <Problem />
            <ProductFlow />
            <InteractiveDemo />
            <HallOfFame />
            <Architecture />
          </div>
          <Footer />
        </Suspense>
      </main>
    </div>
  );
}
