import "./App.css";
import { useState } from "react";
import { GameSetup } from "./components/GameSetup";
import { Game } from "./components/Game";
import type { GameConfig } from "./types";

function App() {
  const [config, setConfig] = useState<GameConfig | null>(null);

  return (
    <div className="App">
      {config ? (
        <Game config={config} onBack={() => setConfig(null)} />
      ) : (
        <GameSetup onStart={setConfig} />
      )}
    </div>
  );
}

export default App;
