import { useEffect, useMemo, useState } from "react";
import type { Board, GameConfig, Move, Piece, PieceType, PlayerColor, Square } from "../types";

type GameStatus = "playing" | "checkmate" | "stalemate";

const opposite = (c: PlayerColor): PlayerColor => (c === "white" ? "black" : "white");

const inBounds = (sq: Square) => sq.x >= 0 && sq.x < 8 && sq.y >= 0 && sq.y < 8;

const sameSquare = (a: Square, b: Square) => a.x === b.x && a.y === b.y;

const cloneBoard = (board: Board): Board => board.map((r) => r.slice());

const makeEmptyBoard = (): Board =>
  Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => null));

const mkPiece = (color: PlayerColor, type: PieceType, idx: number): Piece => ({
  id: `${color}-${type}-${idx}`,
  color,
  type,
  hasMoved: false
});

const initialBoard = (): Board => {
  const b = makeEmptyBoard();

  const back: PieceType[] = ["r", "n", "b", "q", "k", "b", "n", "r"];
  // black at top (y=0), white at bottom (y=7)
  for (let x = 0; x < 8; x++) {
    b[0][x] = mkPiece("black", back[x], x);
    b[1][x] = mkPiece("black", "p", x);
    b[6][x] = mkPiece("white", "p", x);
    b[7][x] = mkPiece("white", back[x], x);
  }
  return b;
};

const getPiece = (board: Board, sq: Square) => (inBounds(sq) ? board[sq.y][sq.x] : null);

const setPiece = (board: Board, sq: Square, piece: Piece | null) => {
  board[sq.y][sq.x] = piece;
};

const rayMoves = (
  board: Board,
  from: Square,
  color: PlayerColor,
  dirs: Array<{ dx: number; dy: number }>
): Square[] => {
  const out: Square[] = [];
  for (const { dx, dy } of dirs) {
    let x = from.x + dx;
    let y = from.y + dy;
    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const target: Square = { x, y };
      const p = getPiece(board, target);
      if (!p) {
        out.push(target);
      } else {
        if (p.color !== color) out.push(target);
        break;
      }
      x += dx;
      y += dy;
    }
  }
  return out;
};

const legalTargetsFor = (board: Board, from: Square): Square[] => {
  const piece = getPiece(board, from);
  if (!piece) return [];

  const { color, type } = piece;
  const out: Square[] = [];

  if (type === "p") {
    const dir = color === "white" ? -1 : 1;
    const startRank = color === "white" ? 6 : 1;
    const one: Square = { x: from.x, y: from.y + dir };
    if (inBounds(one) && !getPiece(board, one)) {
      out.push(one);
      const two: Square = { x: from.x, y: from.y + 2 * dir };
      if (from.y === startRank && !getPiece(board, two)) out.push(two);
    }

    for (const dx of [-1, 1]) {
      const cap: Square = { x: from.x + dx, y: from.y + dir };
      const target = inBounds(cap) ? getPiece(board, cap) : null;
      if (target && target.color !== color) out.push(cap);
    }
    return out;
  }

  if (type === "n") {
    const jumps = [
      { dx: 1, dy: 2 },
      { dx: 2, dy: 1 },
      { dx: -1, dy: 2 },
      { dx: -2, dy: 1 },
      { dx: 1, dy: -2 },
      { dx: 2, dy: -1 },
      { dx: -1, dy: -2 },
      { dx: -2, dy: -1 }
    ];
    for (const { dx, dy } of jumps) {
      const to: Square = { x: from.x + dx, y: from.y + dy };
      if (!inBounds(to)) continue;
      const t = getPiece(board, to);
      if (!t || t.color !== color) out.push(to);
    }
    return out;
  }

  if (type === "b") {
    return rayMoves(board, from, color, [
      { dx: 1, dy: 1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: -1, dy: -1 }
    ]);
  }

  if (type === "r") {
    return rayMoves(board, from, color, [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 }
    ]);
  }

  if (type === "q") {
    return rayMoves(board, from, color, [
      { dx: 1, dy: 1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: -1, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 }
    ]);
  }

  // king
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const to: Square = { x: from.x + dx, y: from.y + dy };
      if (!inBounds(to)) continue;
      const t = getPiece(board, to);
      if (!t || t.color !== color) out.push(to);
    }
  }
  return out;
};

const applyMove = (board: Board, move: Move): Board => {
  const next = cloneBoard(board);
  const piece = getPiece(next, move.from);
  if (!piece) return next;

  setPiece(next, move.from, null);
  const moved: Piece = { ...piece, hasMoved: true };

  // simple pawn promotion -> queen (or provided)
  if (moved.type === "p") {
    const lastRank = moved.color === "white" ? 0 : 7;
    if (move.to.y === lastRank) {
      const promotion: Exclude<PieceType, "k"> = move.promotion ?? "q";
      moved.type = promotion;
    }
  }

  setPiece(next, move.to, moved);
  return next;
};

const allMovesForColor = (board: Board, color: PlayerColor): Move[] => {
  const moves: Move[] = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const p = board[y][x];
      if (!p || p.color !== color) continue;
      const from: Square = { x, y };
      const targets = legalTargetsFor(board, from);
      for (const to of targets) moves.push({ from, to });
    }
  }
  return moves;
};

const detectWinnerByKingCapture = (board: Board): PlayerColor | null => {
  let whiteKing = false;
  let blackKing = false;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const p = board[y][x];
      if (!p) continue;
      if (p.type === "k" && p.color === "white") whiteKing = true;
      if (p.type === "k" && p.color === "black") blackKing = true;
    }
  }
  if (!whiteKing) return "black";
  if (!blackKing) return "white";
  return null;
};

export const useChessGame = (config: GameConfig) => {
  const [board, setBoard] = useState<Board>(() => initialBoard());
  const [turn, setTurn] = useState<PlayerColor>(config.startingColor);
  const [selected, setSelected] = useState<Square | null>(null);
  const [status, setStatus] = useState<GameStatus>("playing");
  const [winner, setWinner] = useState<PlayerColor | null>(null);
  const [capturedBy, setCapturedBy] = useState<Record<PlayerColor, number>>({
    white: 0,
    black: 0
  });

  const humanColor = useMemo(() => {
    if (config.mode !== "vs-robot") return null;
    return config.startingColor; // human starts by chosen color
  }, [config.mode, config.startingColor]);

  const robotColor = useMemo(() => {
    if (config.mode !== "vs-robot") return null;
    return opposite(config.startingColor);
  }, [config.mode, config.startingColor]);

  const legalTargets = useMemo(() => {
    if (!selected) return [];
    const piece = getPiece(board, selected);
    if (!piece) return [];
    if (piece.color !== turn) return [];
    return legalTargetsFor(board, selected);
  }, [board, selected, turn]);

  const reset = () => {
    setBoard(initialBoard());
    setTurn(config.startingColor);
    setSelected(null);
    setStatus("playing");
    setWinner(null);
    setCapturedBy({ white: 0, black: 0 });
  };

  const doMove = (move: Move) => {
    const target = getPiece(board, move.to);
    if (target) {
      setCapturedBy((prev) => ({ ...prev, [turn]: prev[turn] + 1 }));
    }
    setBoard((prev) => applyMove(prev, move));
    setSelected(null);
    setTurn((t) => opposite(t));
  };

  const clickSquare = (sq: Square) => {
    if (status !== "playing") return;

    if (config.mode === "vs-robot" && robotColor && turn === robotColor) {
      return; // ignore input during robot turn
    }

    const piece = getPiece(board, sq);

    if (!selected) {
      if (!piece) return;
      if (piece.color !== turn) return;
      setSelected(sq);
      return;
    }

    // reselect own piece
    if (piece && piece.color === turn) {
      setSelected(sq);
      return;
    }

    // attempt move to square
    const isLegal = legalTargets.some((t) => sameSquare(t, sq));
    if (!isLegal) {
      setSelected(null);
      return;
    }

    doMove({ from: selected, to: sq });
  };

  // winner detection (by king capture, minimal for now)
  useEffect(() => {
    const w = detectWinnerByKingCapture(board);
    if (w) {
      setWinner(w);
      setStatus("checkmate");
    }
  }, [board]);

  // robot: random legal move
  useEffect(() => {
    if (status !== "playing") return;
    if (config.mode !== "vs-robot") return;
    if (!robotColor) return;
    if (turn !== robotColor) return;

    const moves = allMovesForColor(board, robotColor);
    if (moves.length === 0) {
      setStatus("stalemate");
      return;
    }

    const t = window.setTimeout(() => {
      const pick = moves[Math.floor(Math.random() * moves.length)];
      doMove(pick);
    }, 250);

    return () => window.clearTimeout(t);
  }, [board, config.mode, robotColor, status, turn]);

  return {
    board,
    turn,
    selected,
    legalTargets,
    status,
    winner,
    capturedBy,
    clickSquare,
    reset
  };
};

