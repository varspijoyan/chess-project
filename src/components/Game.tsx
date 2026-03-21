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

const formatClock = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

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
    turnSecondsRemaining,
    turnTimeLimitSeconds,
    clickSquare,
    attemptMove,
    beginPieceDrag,
    canInteractWithBoard,
    reset,
    undoLastMove,
    helperMove
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
              onClick={helperMove}
              disabled={status !== "playing"}
            >
              AI helper move
            </button>
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
            <span className="game__meta-label">Clock:</span>{" "}
            <span
              className={
                status === "playing" && turnSecondsRemaining <= 60
                  ? "game__timer game__timer--low"
                  : "game__timer"
              }
            >
              {formatClock(turnSecondsRemaining)} / {formatClock(turnTimeLimitSeconds)}
            </span>
            <span className="game__timer-hint"> (per move)</span>
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
          turn={turn}
          canInteractWithBoard={canInteractWithBoard}
          onMove={attemptMove}
          onPieceDragStart={beginPieceDrag}
        />

        <MoveHistory history={history} />
      </div>

      {(status === "checkmate" || status === "stalemate" || status === "timeout") && (
        <div className="game__overlay" role="dialog" aria-modal="true">
          <div className="game__dialog">
            <h2 className="game__dialog-title">
              {status === "checkmate"
                ? "Checkmate"
                : status === "stalemate"
                  ? "Stalemate"
                  : "Time out"}
            </h2>
            <p className="game__dialog-text">
              {status === "checkmate" && winner
                ? `${winner === "white" ? "White" : "Black"} wins by checkmate.`
                : status === "timeout" && winner
                  ? `${winner === "white" ? "White" : "Black"} wins on time.`
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

