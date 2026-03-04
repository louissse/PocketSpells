import "./App.css";
import { useState, useCallback } from "react";
import SpellsList from "./components/SpellsList";
import SplashScreen from "./components/SplashScreen";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);

  return (
    <QueryClientProvider client={queryClient}>
      <SplashScreen onDone={handleSplashDone} />

      <div className={splashDone ? "app-fade-in" : "opacity-0"}>
        <div className="flex h-12 flex-row items-center gap-4 bg-white p-2">
          <div className="h-8 w-8 rounded-full bg-linear-to-br from-rose-400 to-pink-600"></div>
          <h1 className="text-xl font-semibold">Pocket Spells</h1>
        </div>
        <div className="my-8">
          <SpellsList />
        </div>
      </div>

      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
