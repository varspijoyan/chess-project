import React from "react";
import "../styles/game.css";
import type { GameConfig } from "../types";
import { ChessBoard } from "./ChessBoard";
import { MoveHistory } from "./MoveHistory";
import { useChessGame } from "../hooks/useChessGame";

export interface GameProps {
  config: GameConfig;
  onBack: () => void;
}

export const Game: React.FC<GameProps> = ({ config, onBack }) => {
  const {
    board,
    turn,
    selected,
    legalTargets,
    status,
    winner,
    history,
    capturedBy,
    clickSquare,
    reset,
    undoLastMove
  } = useChessGame(config);

  return (
    <section className="game">
      <header className="game__header">
        <div className="game__title-row">
          <h1 className="game__title">Game</h1>
          <div className="game__buttons">
            <button
              type="button"
              className="game__button"
              onClick={undoLastMove}
              disabled={history.length === 0 || status !== "playing"}
            >
              Undo move
            </button>
            <button type="button" className="game__button" onClick={reset}>
              Reset
            </button>
            <button type="button" className="game__button" onClick={onBack}>
              Back
            </button>
          </div>
        </div>

        <div className="game__meta">
          <div>
            <span className="game__meta-label">Mode:</span>{" "}
            {config.mode === "two-players" ? "2 Players" : "vs Robot"}
          </div>
          <div>
            <span className="game__meta-label">Turn:</span>{" "}
            {turn === "white" ? "White" : "Black"}
          </div>
          <div>
            <span className="game__meta-label">Status:</span> {status}
            {winner ? ` (${winner} wins)` : ""}
          </div>
          <div>
            <span className="game__meta-label">Captured:</span> White{" "}
            {capturedBy.white} · Black {capturedBy.black}
          </div>
        </div>
      </header>

      <div className="game__content">
        <ChessBoard
          board={board}
          selected={selected}
          legalTargets={legalTargets}
          onSquareClick={clickSquare}
        />

        <MoveHistory history={history} />
      </div>

      {(status === "checkmate" || status === "stalemate") && (
        <div className="game__overlay" role="dialog" aria-modal="true">
          <div className="game__dialog">
            <h2 className="game__dialog-title">
              {status === "checkmate" ? "Checkmate" : "Stalemate"}
            </h2>
            <p className="game__dialog-text">
              {status === "checkmate" && winner
                ? `${winner === "white" ? "White" : "Black"} wins by checkmate.`
                : "Draw by stalemate."}
            </p>
            <div className="game__dialog-actions">
              <button
                type="button"
                className="game__button"
                onClick={reset}
              >
                Play again
              </button>
              <button
                type="button"
                className="game__button"
                onClick={onBack}
              >
                Back to setup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

