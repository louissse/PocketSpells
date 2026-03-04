import "./App.css";
import { useState, useCallback } from "react";
import SpellsList from "./components/SpellsList";
import SplashScreen from "./components/SplashScreen";
import BottomNav from "./components/BottomNav";
import PocketScreen from "./components/PocketScreen";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePocket } from "./hooks/usePocket";
import { useCustomSpells } from "./hooks/useCustomSpells";
import { useSwipeable } from "react-swipeable";

const queryClient = new QueryClient();

const TABS = ["spells", "pocket"] as const;
type Tab = (typeof TABS)[number];

function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);
  const [activeTab, setActiveTab] = useState<Tab>("spells");
  const { pocketedSpells, togglePocket, isInPocket } = usePocket();
  const { customSpells, addCustomSpell, updateCustomSpell, deleteCustomSpell } =
    useCustomSpells();

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      const idx = TABS.indexOf(activeTab);
      if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1]);
    },
    onSwipedRight: () => {
      const idx = TABS.indexOf(activeTab);
      if (idx > 0) setActiveTab(TABS[idx - 1]);
    },
    preventScrollOnSwipe: false,
    trackMouse: false,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SplashScreen onDone={handleSplashDone} />

      <div
        className={`flex h-[100dvh] flex-col ${splashDone ? "app-fade-in" : "opacity-0"}`}
      >
        {/* Header */}
        <div className="flex h-12 shrink-0 flex-row items-center gap-4 bg-white p-2">
          <div className="h-8 w-8 rounded-full bg-linear-to-br from-rose-400 to-pink-600"></div>
          <h1 className="text-xl font-semibold">Pocket Spells</h1>
        </div>

        {/* Screen content — each screen scrolls independently */}
        <div className="min-h-0 flex-1 overflow-hidden" {...swipeHandlers}>
          <div
            className={`flex h-full transition-transform duration-200 ease-in-out ${
              activeTab === "spells" ? "translate-x-0" : "-translate-x-1/2"
            }`}
            style={{ width: "200%" }}
          >
            <div className="w-1/2 min-w-0 overflow-y-auto">
              <SpellsList
                isInPocket={isInPocket}
                onTogglePocket={togglePocket}
              />
            </div>
            <div className="w-1/2 min-w-0 overflow-y-auto">
              <PocketScreen
                pocketedSpells={pocketedSpells}
                isInPocket={isInPocket}
                onTogglePocket={togglePocket}
                customSpells={customSpells}
                onAddCustomSpell={addCustomSpell}
                onUpdateCustomSpell={updateCustomSpell}
                onDeleteCustomSpell={deleteCustomSpell}
              />
            </div>
          </div>
        </div>

        {/* Bottom navigation */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
