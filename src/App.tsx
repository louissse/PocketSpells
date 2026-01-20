import "./App.css";

function App() {
  return (
    <>
      <div>
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
      </div>
    </>
  );
}

export default App;
