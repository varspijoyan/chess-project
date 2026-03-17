import { useState } from "react";
import type { GameMode, PlayerColor } from "../types";

export const useGameSetup = () => {
  const [mode, setMode] = useState<GameMode>("two-players");
  const [startingColor, setStartingColor] = useState<PlayerColor>("white");

  const handleModeChange = (nextMode: GameMode) => {
    setMode(nextMode);
  };

  return {
    mode,
    startingColor,
    handleModeChange
  };
};

