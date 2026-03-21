import React from "react";
import "../styles/board.css";
import type { Board, PlayerColor, Square } from "../types";
import { PieceIcon } from "./PieceIcon";

export interface ChessBoardProps {
  board: Board;
  selected: Square | null;
  legalTargets: Square[];
  onSquareClick: (sq: Square) => void;
  turn: PlayerColor;
  canInteractWithBoard: boolean;
  onMove: (from: Square, to: Square) => void;
  onPieceDragStart: (sq: Square) => void;
}

const sameSquare = (a: Square, b: Square) => a.x === b.x && a.y === b.y;

const hasSquare = (list: Square[], sq: Square) =>
  list.some((s) => sameSquare(s, sq));

const parseSquareFromDataTransfer = (e: React.DragEvent): Square | null => {
  try {
    const raw = e.dataTransfer.getData("text/plain");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Square;
    if (typeof parsed?.x === "number" && typeof parsed?.y === "number") {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
};

export const ChessBoard: React.FC<ChessBoardProps> = ({
  board,
  selected,
  legalTargets,
  onSquareClick,
  turn,
  canInteractWithBoard,
  onMove,
  onPieceDragStart
}) => {
  return (
    <div className="board__scene">
      <div className="board" role="grid" aria-label="Chess board">
        {board.map((row, y) =>
          row.map((cell, x) => {
            const sq: Square = { x, y };
            const isDark = (x + y) % 2 === 1;
            const isSelected = selected ? sameSquare(selected, sq) : false;
            const isLegal = hasSquare(legalTargets, sq);
            const canDragPiece =
              Boolean(cell) &&
              canInteractWithBoard &&
              cell!.color === turn;

            return (
              <button
                key={`${x}-${y}`}
                type="button"
                className={[
                  "board__square",
                  isDark ? "board__square--dark" : "board__square--light",
                  isSelected ? "board__square--selected" : "",
                  isLegal ? "board__square--legal" : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => onSquareClick(sq)}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const from = parseSquareFromDataTransfer(e);
                  if (!from) return;
                  onMove(from, sq);
                }}
                aria-label={`Square ${String.fromCharCode(97 + x)}${8 - y}`}
              >
                {cell ? (
                  <PieceIcon
                    piece={cell}
                    draggable={canDragPiece}
                    onDragStart={(e) => {
                      if (!canDragPiece) {
                        e.preventDefault();
                        return;
                      }
                      onPieceDragStart(sq);
                      e.dataTransfer.setData("text/plain", JSON.stringify(sq));
                      e.dataTransfer.effectAllowed = "move";
                    }}
                  />
                ) : null}
                {isLegal ? <span className="board__dot" aria-hidden="true" /> : null}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
