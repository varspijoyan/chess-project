import React from "react";
import { useGameSetup } from "../hooks/useGameSetup";
import "../styles/game-setup.css";
import type { GameConfig } from "../types";

export interface GameSetupProps {
  onStart: (config: GameConfig) => void;
}

export const GameSetup: React.FC<GameSetupProps> = ({ onStart }) => {
  const {
    mode,
    startingColor,
    handleModeChange,
    handleColorChange
  } = useGameSetup();

  return (
    <section className="game-setup">
      <header className="game-setup__header">
        <h1 className="game-setup__title">Chess Game</h1>
        <p className="game-setup__subtitle">
          Choose how you want to play and who moves first.
        </p>
      </header>

      <div className="game-setup__options">
        <div className="game-setup__group">
          <h2 className="game-setup__group-title">Game mode</h2>
          <div className="game-setup__buttons">
            <button
              type="button"
              className={`game-setup__button ${
                mode === "two-players" ? "game-setup__button--active" : ""
              }`}
              onClick={() => handleModeChange("two-players")}
            >
              2 Players
            </button>
            <button
              type="button"
              className={`game-setup__button ${
                mode === "vs-robot" ? "game-setup__button--active" : ""
              }`}
              onClick={() => handleModeChange("vs-robot")}
            >
              vs Robot
            </button>
          </div>
        </div>

        <div className="game-setup__group">
          <h2 className="game-setup__group-title">Who starts?</h2>
          <div className="game-setup__buttons">
            <button
              type="button"
              className={`game-setup__button ${
                startingColor === "white" ? "game-setup__button--active" : ""
              }`}
              onClick={() => handleColorChange("white")}
            >
              White
            </button>
            <button
              type="button"
              className={`game-setup__button ${
                startingColor === "black" ? "game-setup__button--active" : ""
              }`}
              onClick={() => handleColorChange("black")}
            >
              Black
            </button>
          </div>
        </div>
      </div>

      <footer className="game-setup__summary">
        <p>
          <span className="game-setup__summary-label">Mode:</span>{" "}
          {mode === "two-players" ? "2 Players" : "vs Robot"}
        </p>
        <p>
          <span className="game-setup__summary-label">First move:</span>{" "}
          {startingColor === "white" ? "White" : "Black"}
        </p>
      </footer>

      <div className="game-setup__actions">
        <button
          type="button"
          className="game-setup__start"
          onClick={() => onStart({ mode, startingColor })}
        >
          Start game
        </button>
      </div>
    </section>
  );
};

