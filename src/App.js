import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const DIRECTIONS = { LEFT: "left", RIGHT: "right", UP: "up", DOWN: "down" };

  const [snakePositionArray, setSnakePositionArray] = useState([]);
  const [applePosition, setApplePosition] = useState();
  const [tailPosition, setTailPosition] = useState();
  const [isGameStart, setIsGameStart] = useState(false);
  const [isDead, setIsDead] = useState(false);
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);

  const blocksMatrix = Array(100)
    .fill(null)
    .map((_, i) => i);

  const spawnApple = () => {
    let newPosition = Math.floor(Math.random() * 99);
    while (snakePositionArray.includes(newPosition))
      newPosition = Math.floor(Math.random() * 99);
    setApplePosition(newPosition);
  };

  const initGame = () => {
    if (isGameStart) return;
    setIsDead(false);
    setSnakePositionArray([12, 13]);
    setDirection(DIRECTIONS.RIGHT);
    spawnApple();
    setIsGameStart(true);
  };

  const handleGameStart = () => {
    initGame();
  };

  const hasSnakeInBlock = (position) => snakePositionArray.includes(position);

  const movePosition = (position) => {
    switch (direction) {
      case DIRECTIONS.RIGHT:
        position = position + 1;
        break;
      case DIRECTIONS.LEFT:
        position = position - 1;
        break;
      case DIRECTIONS.UP:
        position = position - 10;
        break;
      case DIRECTIONS.DOWN:
        position = position + 10;
        break;
      default:
    }
    return position;
  };

  const moveSnake = () => {
    setTailPosition(snakePositionArray.at(-1));
    const newSnakeHeadPosition = movePosition(snakePositionArray[0]);
    const newSnakePositionArray = [
      newSnakeHeadPosition,
      ...snakePositionArray.slice(0, -1),
    ];
    setSnakePositionArray(() => newSnakePositionArray);
  };

  const handleEatApple = () => {
    if (snakePositionArray[0] !== applePosition) return;

    setSnakePositionArray(() => [...snakePositionArray, tailPosition]);
    console.log(applePosition, "eat apple", snakePositionArray);
    spawnApple();
  };

  const isAppleBlock = (position) => {
    return applePosition === position && !hasSnakeInBlock(position);
  };

  const handleKeyDown = (event) => {
    switch (event.keyCode) {
      case 37:
      case 65:
        console.log("move left");
        setDirection(DIRECTIONS.LEFT);
        break;
      case 38:
      case 87:
        console.log("move up");
        setDirection(DIRECTIONS.UP);
        break;
      case 39:
      case 68:
        console.log("move right");
        setDirection(DIRECTIONS.RIGHT);
        break;
      case 40:
      case 83:
        console.log("move down");
        setDirection(DIRECTIONS.DOWN);
        break;
      default:
    }
  };

  const handleIsDead = () => {
    const isHitWalls =
      (snakePositionArray[0] % 10 === 9) & (direction === "right") ||
      (snakePositionArray[0] % 10 === 0) & (direction === "left") ||
      (snakePositionArray[0] < 10) & (direction === "up") ||
      (snakePositionArray[0] > 90) & (direction === "down");
    if (isHitWalls) {
      setIsDead(true);
      setSnakePositionArray([]);
      setApplePosition();
      setIsGameStart(false);
    }
  };

  useEffect(() => {
    if (!isGameStart) return;

    initGame();
    let gameInterval;
    window.addEventListener("keydown", handleKeyDown);
    gameInterval = setInterval(() => {
      moveSnake();
      handleEatApple();
      handleIsDead();
    }, 300);

    if (isDead) clearInterval(gameInterval);

    return () => {
      clearInterval(gameInterval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <main className="container">
      {/* Game title screen */}
      {!isGameStart && !isDead && (
        <div className="message-board">
          <h1 className="title">SNAKE</h1>
          <button className="start-button" onClick={handleGameStart}>
            GAME START
          </button>
        </div>
      )}

      {/* Game over screen */}
      {isDead && (
        <div className="message-board">
          <h1 className="title">GAME OVER</h1>
          <button className="start-button" onClick={handleGameStart}>
            GAME START
          </button>
        </div>
      )}

      {/* Game play screen */}
      <section className="snake-board">
        {blocksMatrix.map((position) => {
          return (
            <div
              key={position}
              className={`block ${isAppleBlock(position) && "apple-block"} ${
                hasSnakeInBlock(position) && "snake-block"
              } `}
            >
              &nbsp;
            </div>
          );
        })}
      </section>
    </main>
  );
}
export default App;
