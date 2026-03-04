import "./App.css";
import { useState, useCallback } from "react";
import SpellsList from "./components/SpellsList";
import SplashScreen from "./components/SplashScreen";
import BottomNav from "./components/BottomNav";
import PocketScreen from "./components/PocketScreen";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePocket } from "./hooks/usePocket";

const queryClient = new QueryClient();

type Tab = "spells" | "pocket";

function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);
  const [activeTab, setActiveTab] = useState<Tab>("spells");
  const { pocketedSpells, togglePocket, isInPocket } = usePocket();

  return (
    <QueryClientProvider client={queryClient}>
      <SplashScreen onDone={handleSplashDone} />

      <div className={splashDone ? "app-fade-in" : "opacity-0"}>
        {/* Header */}
        <div className="flex h-12 flex-row items-center gap-4 bg-white p-2">
          <div className="h-8 w-8 rounded-full bg-linear-to-br from-rose-400 to-pink-600"></div>
          <h1 className="text-xl font-semibold">Pocket Spells</h1>
        </div>

        {/* Screen content — padded so it doesn't hide behind the nav bar */}
        <div className="pb-16">
          {activeTab === "spells" && (
            <SpellsList isInPocket={isInPocket} onTogglePocket={togglePocket} />
          )}
          {activeTab === "pocket" && (
            <PocketScreen
              pocketedSpells={pocketedSpells}
              isInPocket={isInPocket}
              onTogglePocket={togglePocket}
            />
          )}
        </div>

        {/* Bottom navigation */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
