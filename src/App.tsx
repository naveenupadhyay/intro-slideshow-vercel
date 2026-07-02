import { AnimatePresence } from "framer-motion";
import { IntroAnimation } from "./components/IntroAnimation";

function App() {
  return (
    <main className="relative h-dvh overflow-hidden bg-[#fbfaf7] text-zinc-950">
      <AnimatePresence mode="wait">
        <IntroAnimation />
      </AnimatePresence>
    </main>
  );
}

export default App;
