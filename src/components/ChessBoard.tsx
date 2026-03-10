import React from "react";
import "../styles/board.css";
import type { Board, Piece, PlayerColor, Square } from "../types";

export interface ChessBoardProps {
  board: Board;
  selected: Square | null;
  legalTargets: Square[];
  onSquareClick: (sq: Square) => void;
}

const pieceToSymbol = (piece: Piece): string => {
  const map: Record<PlayerColor, Record<Piece["type"], string>> = {
    white: { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" },
    black: { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" }
  };
  return map[piece.color][piece.type];
};

const sameSquare = (a: Square, b: Square) => a.x === b.x && a.y === b.y;

const hasSquare = (list: Square[], sq: Square) =>
  list.some((s) => sameSquare(s, sq));

export const ChessBoard: React.FC<ChessBoardProps> = ({
  board,
  selected,
  legalTargets,
  onSquareClick
}) => {
  return (
    <div className="board" role="grid" aria-label="Chess board">
      {board.map((row, y) =>
        row.map((cell, x) => {
          const sq: Square = { x, y };
          const isDark = (x + y) % 2 === 1;
          const isSelected = selected ? sameSquare(selected, sq) : false;
          const isLegal = hasSquare(legalTargets, sq);

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
              aria-label={`Square ${String.fromCharCode(97 + x)}${8 - y}`}
            >
              {cell ? (
                <span className="board__piece" aria-hidden="true">
                  {pieceToSymbol(cell)}
                </span>
              ) : null}
              {isLegal ? <span className="board__dot" aria-hidden="true" /> : null}
            </button>
          );
        })
      )}
    </div>
  );
};

