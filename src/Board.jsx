import { useState, useRef } from "react";

const D = 5; // Change This To change dimensions of grid

const generateBoard = (n) => {
  const board = [];
  for (let row = 0; row < n; row++) {
    const rowArray = [];
    for (let col = 0; col < n; col++) {
      rowArray.push("");
    }
    board.push(rowArray);
  }
  return board;
};

const validateBoard = (board) => {
  const length = board.length;

  // Left -> Right
  for (let row = 0; row < length; row++) {
    let count = 0;
    let prev;
    for (let col = 0; col < length; col++) {
      if (board[row][col] === "-") break;
      if (prev && board[row][col] !== prev) break;
      prev = board[row][col];
      count++;
    }
    if (count === length) return prev;
  }

  // Top -> Bottom
  for (let col = 0; col < length; col++) {
    let count = 0;
    let prev;
    for (let row = 0; row < length; row++) {
      if (board[row][col] === "-") break;
      if (prev && board[row][col] !== prev) break;
      prev = board[row][col];
      count++;
    }
    if (count === length) return prev;
  }
  // TopLeft -> BottomRight
  let row = 0;
  let col = 0;
  let count = 0;
  let prev;
  while (row < length && col < length) {
    if (board[row][col] === "-") break;
    if (prev && board[row][col] !== prev) break;
    prev = board[row][col];
    count++;
    row++;
    col++;
  }
  if (count === length) return prev;

  // BottomLeft -> TopRight
  row = length - 1;
  col = 0;
  count = 0;
  prev = null;
  while (row >= 0 && col < length) {
    if (board[row][col] === "-") break;
    if (prev && board[row][col] !== prev) break;
    prev = board[row][col];
    count++;
    row--;
    col++;
  }
  if (count === length) return prev;

  return null;
};

const initialBoard = Array.from({ length: D }, () => new Array(D).fill("-"));

const Board = () => {
  const [board, setBoard] = useState(initialBoard);
  const [winner, setWinner] = useState(null);
  const player = useRef("X");
  const turns = useRef(D * D);

  const handleClick = (row, col) => {
    if (board[row][col] !== "-" || winner || !turns.current) return;
    const copy = JSON.parse(JSON.stringify(board));
    copy[row][col] = player.current;
    player.current = player.current == "X" ? "O" : "X";
    const hasWinner = validateBoard(copy);

    if (hasWinner) {
      setWinner(hasWinner);
    }
    turns.current--;
    setBoard(() => copy);
  };

  const handleReset = () => {
    player.current = "X";
    turns.current = D * D;
    setBoard(() => initialBoard);
    setWinner(null);
  };

  return (
    <div>
      <p className="one">
        A Dynamic Tic-Tac-Toe Game with 'N x N' Dimensions. Currently having N =
        5
      </p>
      <hr />
      <div className="info">
        <div className="one">Current Player: {player.current}</div>
        <div>
          {!winner && !turns.current && <span>Tie</span>}
          {winner || turns.current ? (
            <span className="one">Winner: {winner ? winner : "None"} </span>
          ) : (
            ""
          )}
        </div>
        <div>
          {(winner || !turns.current) && (
            <button onClick={handleReset}>Reset</button>
          )}
        </div>
      </div>
      {board.map((row, rI) => {
        return (
          <div className="row">
            {row.map((block, cI) => {
              return (
                <span className="block" onClick={() => handleClick(rI, cI)}>
                  {block}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
