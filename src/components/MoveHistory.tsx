import React, { useMemo } from "react";
import type { MoveRecord, PieceType } from "../types";

export interface MoveHistoryProps {
  history: MoveRecord[];
}

const pieceName = (t: PieceType) => {
  switch (t) {
    case "k":
      return "King";
    case "q":
      return "Queen";
    case "r":
      return "Rook";
    case "b":
      return "Bishop";
    case "n":
      return "Knight";
    case "p":
      return "Pawn";
  }
};

const pieceValue = (t: PieceType): number => {
  switch (t) {
    case "p":
      return 1;
    case "n":
    case "b":
      return 3;
    case "r":
      return 5;
    case "q":
      return 9;
    case "k":
      return 0; // king is invaluable, don't count
  }
};

const moveText = (m: MoveRecord) => {
  const attacker = pieceName(m.piece);

  // If no capture, just show the moving piece name
  if (!m.capture || !m.capturedPiece) {
    const promo = m.promotion ? ` -> ${pieceName(m.promotion)}` : "";
    return `${attacker}${promo}`;
  }

  // Capture: "Attacker -> Victim"
  const victim = pieceName(m.capturedPiece);
  const promo = m.promotion ? ` -> ${pieceName(m.promotion)}` : "";
  return `${attacker} -> ${victim}${promo}`;
};

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history }) => {
  const whiteMoves = useMemo(() => history.filter((m) => m.by === "white"), [history]);
  const blackMoves = useMemo(() => history.filter((m) => m.by === "black"), [history]);

  const whitePoints = useMemo(
    () =>
      history
        .filter((m) => m.by === "white" && m.capture && m.capturedPiece)
        .reduce((sum, m) => sum + pieceValue(m.capturedPiece!), 0),
    [history]
  );

  const blackPoints = useMemo(
    () =>
      history
        .filter((m) => m.by === "black" && m.capture && m.capturedPiece)
        .reduce((sum, m) => sum + pieceValue(m.capturedPiece!), 0),
    [history]
  );

  return (
    <aside className="history" aria-label="Move history">
      <div className="history__header">
        <h2 className="history__title">History</h2>
        <div className="history__count">{history.length} moves</div>
      </div>

      {history.length === 0 ? (
        <div className="history__empty">No moves yet.</div>
      ) : (
        <div className="history__columns">
          <section className="history__col" aria-label="White moves">
            <div className="history__col-title">
              White <span className="history__score">({whitePoints} pts)</span>
            </div>
            <ol className="history__moves">
              {whiteMoves.map((m, idx) => (
                <li key={`${m.by}-${idx}`} className="history__move">
                  <span className="history__move-text history__cell history__cell--white">
                    {moveText(m)}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="history__col" aria-label="Black moves">
            <div className="history__col-title">
              Black <span className="history__score">({blackPoints} pts)</span>
            </div>
            <ol className="history__moves">
              {blackMoves.map((m, idx) => (
                <li key={`${m.by}-${idx}`} className="history__move">
                  <span className="history__move-text history__cell history__cell--black">
                    {moveText(m)}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      )}
    </aside>
  );
};

