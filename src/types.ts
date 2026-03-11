export type GameMode = "two-players" | "vs-robot";

export type PlayerColor = "white" | "black";

export interface GameConfig {
  mode: GameMode;
  startingColor: PlayerColor;
}

export type PieceType = "p" | "r" | "n" | "b" | "q" | "k";

export interface Piece {
  id: string;
  type: PieceType;
  color: PlayerColor;
  hasMoved: boolean;
}

export interface Square {
  x: number; // 0..7 (file a..h)
  y: number; // 0..7 (rank 8..1 if rendered with y=0 top)
}

export interface Move {
  from: Square;
  to: Square;
  promotion?: Exclude<PieceType, "k">;
}

export interface MoveRecord {
  by: PlayerColor;
  piece: PieceType;
  from: Square;
  to: Square;
  capture: boolean;
  promotion?: Exclude<PieceType, "k">;
}

export type Board = Array<Array<Piece | null>>;

export type GameStatus = "playing" | "checkmate" | "stalemate";
