import React from "react";
import type { Piece, PieceType, PlayerColor } from "../types";

type Props = {
  piece: Pick<Piece, "type" | "color">;
  className?: string;
};

const WIKI_BASE = "https://upload.wikimedia.org/wikipedia/commons";

// Cburnett SVG set (widely used). These are transparent-background 45x45 assets.
// Note: URLs are hard-coded to stable upload.wikimedia paths.
const SRC: Record<PlayerColor, Record<PieceType, string>> = {
  white: {
    k: `${WIKI_BASE}/4/42/Chess_klt45.svg`,
    q: `${WIKI_BASE}/1/15/Chess_qlt45.svg`,
    r: `${WIKI_BASE}/7/72/Chess_rlt45.svg`,
    b: `${WIKI_BASE}/b/b1/Chess_blt45.svg`,
    n: `${WIKI_BASE}/7/70/Chess_nlt45.svg`,
    p: `${WIKI_BASE}/4/45/Chess_plt45.svg`
  },
  black: {
    k: `${WIKI_BASE}/f/f0/Chess_kdt45.svg`,
    q: `${WIKI_BASE}/4/47/Chess_qdt45.svg`,
    r: `${WIKI_BASE}/f/ff/Chess_rdt45.svg`,
    b: `${WIKI_BASE}/9/98/Chess_bdt45.svg`,
    n: `${WIKI_BASE}/e/ef/Chess_ndt45.svg`,
    p: `${WIKI_BASE}/c/c7/Chess_pdt45.svg`
  }
};

export const PieceIcon: React.FC<Props> = ({ piece, className }) => {
  const src = SRC[piece.color][piece.type];

  return (
    <img
      className={["board__pieceImg", className].filter(Boolean).join(" ")}
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      loading="lazy"
    />
  );
};

