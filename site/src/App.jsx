import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Problem from "./components/Problem";
import ProductFlow from "./components/ProductFlow";
import InteractiveDemo from "./components/InteractiveDemo";
import Architecture from "./components/Architecture";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <ProductFlow />
        <InteractiveDemo />
        <Architecture />
      </main>
      <Footer />
    </div>
  );
}
