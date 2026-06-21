import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Problem from "./components/Problem";
import ProductFlow from "./components/ProductFlow";
import InteractiveDemo from "./components/InteractiveDemo";
import HallOfFame from "./components/HallOfFame";
import Architecture from "./components/Architecture";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="relative min-h-screen">
      {/* Film grain / noise overlay */}
      <div className="noise-overlay" />

      <Navbar />
      <main>
        <Hero />
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-honey/[0.01] to-transparent" />
          <Problem />
          <ProductFlow />
          <InteractiveDemo />
          <HallOfFame />
          <Architecture />
        </div>
      </main>
      <Footer />
    </div>
  );
}
