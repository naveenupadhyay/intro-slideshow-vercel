import { AnimatePresence } from "framer-motion";
import { CaseStudiesSection, IntroAnimation } from "./components/IntroAnimation";

function App() {
  const path = typeof window === "undefined" ? "/" : window.location.pathname;

  if (path === "/case-studies" || path === "/case-studies/") {
    return (
      <main className="min-h-screen overflow-x-hidden bg-black text-white">
        <CaseStudiesSection standalone />
      </main>
    );
  }

  return (
    <main className="relative h-dvh overflow-hidden bg-[#fbfaf7] text-zinc-950">
      <AnimatePresence mode="wait">
        <IntroAnimation />
      </AnimatePresence>
    </main>
  );
}

export default App;
