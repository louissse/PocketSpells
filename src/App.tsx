import "./App.css";
import SpellsList from "./components/SpellsList";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <div>
        <div className="flex justify-center mt-16">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-rose-400 to-pink-600 "></div>
        </div>
        <h1 className="text-8xl mt-16">Pocket Spells</h1>
        <h2 className="text-stone-600 mt-8 text-2xl font-medium">
          Every spell, right in your pocket
        </h2>
        <p className="text-stone-600 mt-2 text-base">
          A DnD 5e spell tracker (coming soon)
        </p>
      </div> */}
      <div className="flex h-12 flex-row items-center gap-4 bg-white p-2">
        <div className="h-8 w-8 rounded-full bg-linear-to-br from-rose-400 to-pink-600"></div>
        <h1 className="text-xl font-semibold">Pocket Spells</h1>
      </div>
      <div className="my-8">
        <SpellsList /> test
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
