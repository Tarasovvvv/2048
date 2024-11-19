import { ReactElement, useContext, useEffect, useState } from "react";
import { themeContext } from "@/providers/ThemeProvider";
import "@/App.css";
import s from "./Game.module.css";

function Game() {
  const { theme } = useContext(themeContext);
  type GameState = {
    score: number;
    bestScore: number;
    moves: number;
    tiles: Tile[];
    isEnded: boolean;
  };
  type Tile = {
    id: number;
    x0: number;
    y0: number;
    x: number;
    y: number;
    degree: number;
    status: string;
  };
  const size: number = localStorage.getItem("size") ? parseInt(localStorage.getItem("size")!) : 4;
  const tileSideLength: number = 400 / size;
  const [gameState, setGameState] = useState<GameState>({
    score: Number(localStorage.getItem("score")!) ?? 0,
    bestScore: Number(localStorage.getItem("bestScore")!) ?? 0,
    moves: Number(localStorage.getItem("moves")!) ?? 0,
    tiles: JSON.parse(localStorage.getItem("tiles")!) ?? [],
    isEnded: Boolean(localStorage.getItem("isEnded") === "true"),
  });
  const getTileColor = (degree: number) => {
    if (theme === "monochrome") return "white";
    return `hsl(${(degree * 360) / size ** 2}, ${theme === "dark" ? 50 : 100}%, ${theme === "dark" ? 20 : 50}%)`;
  };
  const spawn = (tilesMap: Tile[]): void => {
    const range: number = size ** 2;
    if (tilesMap.filter((t) => t.status !== "deleted").length === range) return;
    const engadedPositions: number[] = tilesMap.map((tile: Tile) => tile.x + size * tile.y);
    let position: number = Math.floor(Math.random() * range);
    while (engadedPositions.includes(position)) {
      position = Math.floor(Math.random() * range);
    }
    tilesMap.push({
      id: Date.now() + Math.random(),
      x0: position % size,
      y0: (position - (position % size)) / size,
      x: position % size,
      y: (position - (position % size)) / size,
      degree: 1,
      status: "just-spawned",
    });
    tilesMap.sort((a, b) => {
      return a.x - b.x || a.y - b.y;
    });
  };
  const restart = (): void => {
    const newTilesMap: Tile[] = [];
    spawn(newTilesMap);
    spawn(newTilesMap);
    setGameState({
      score: 0,
      bestScore: Number(localStorage.getItem("bestScore") ?? 0),
      moves: 0,
      tiles: newTilesMap,
      isEnded: false,
    });
  };
  const checkMovable = (tilesMap: Tile[]): boolean => {
    let isMovable: boolean = tilesMap.length < size ** 2;
    if (isMovable) {
      return isMovable;
    }
    console.log(tilesMap.length);
    stop: for (let i = 0; i < size; i++) {
      let currentLine: Tile[] = tilesMap.filter((t) => t.x === i);
      for (let j = 1; j < size; j++) {
        if (currentLine[j].degree === currentLine[j - 1].degree) {
          isMovable = true;
          break stop;
        }
      }
      for (let j = size - 2; j >= 0; j--) {
        if (currentLine[j].degree === currentLine[j + 1].degree) {
          isMovable = true;
          break stop;
        }
      }
      currentLine = tilesMap.filter((t) => t.y === i);
      for (let j = 1; j < size; j++) {
        if (currentLine[j].degree === currentLine[j - 1].degree) {
          isMovable = true;
          break stop;
        }
      }
      for (let j = size - 2; j >= 0; j--) {
        if (currentLine[j].degree === currentLine[j + 1].degree) {
          isMovable = true;
          break stop;
        }
      }
    }
    return isMovable;
  };
  const moveTiles = (direction: string): void => {
    setGameState((prevGameState) => {
      if (prevGameState.isEnded) return prevGameState;
      let newCoordsSum: number = 0;
      let prevCoordsSum: number = 0;
      const horizontal: boolean = direction === "left" || direction === "right";
      const coordsAscending: boolean = direction === "down" || direction === "right";
      const newGameState: GameState = structuredClone(prevGameState);
      const newTiles: Tile[] = newGameState.tiles.filter((t) => t.status !== "deleted");
      for (let i = 0; i < size; i++) {
        // Summarize values and mark tiles for deletion
        const currentLine: Tile[] = newTiles.filter((t) => t[horizontal ? "y" : "x"] === i);
        if (coordsAscending) currentLine.reverse();
        let currentTile: Tile = currentLine[0];
        prevCoordsSum += currentTile ? currentLine[0].x + currentLine[0].y + 1 : 0;
        for (let j = 1; j < currentLine.length; j++) {
          prevCoordsSum += currentLine[j].x + currentLine[j].y + 1;
          if (currentLine[j].degree === currentTile.degree) {
            currentTile.degree++;
            currentLine[j].status = "deleted";
            newGameState.score += 2 ** currentTile.degree;
            if (newGameState.score > newGameState.bestScore) {
              newGameState.bestScore = newGameState.score;
              localStorage.setItem("bestScore", newGameState.score.toString());
            }
            j++;
          }
          currentTile = currentLine[j];
        }

        // Move tiles
        let deletedTilesCount: number = 0;
        currentLine.forEach((t, i) => {
          t.x0 = t.x;
          t.y0 = t.y;
          t[horizontal ? "x" : "y"] = coordsAscending ? size - 1 - i + deletedTilesCount : i - deletedTilesCount;
          if (t.status === "deleted") {
            t[horizontal ? "x" : "y"] += deletedTilesCount + (coordsAscending ? 1 : -1);
            deletedTilesCount++;
          } else {
            t.status = "moved";
            newCoordsSum += t.x + t.y + 1;
          }
        });
      }

      // Spawn new tile if movement occurred
      if (newCoordsSum !== prevCoordsSum) {
        spawn(newTiles);
        newGameState.moves++;
      } else {
        if (!checkMovable(newTiles)) {
          newGameState.isEnded = true;
        }
        newTiles.sort((a, b) => {
          return a.x - b.x || a.y - b.y;
        });
      }

      newGameState.tiles = newTiles;
      localStorage.setItem("isDrawed", "false");
      return newGameState;
    });
  };
  const drawTiles = () => {
    const isDrawed: boolean = localStorage.getItem("isDrawed") ? (localStorage.getItem("isDrawed") === "true" ? true : false) : false;
    if (!isDrawed) {
      setTimeout(() => {
        gameState.tiles.forEach((tile) => {
          const tileElement: HTMLElement | null = document.getElementById(`tile-${tile.id}`);
          if (tileElement) {
            tileElement.style.top = `${10 + tile.y * (tileSideLength + 10)}px`;
            tileElement.style.left = `${10 + tile.x * (tileSideLength + 10)}px`;
          }
        });
        localStorage.setItem("isDrawed", "true");
      }, 2);
    }
    return gameState.tiles.map((tile) => (
      <div
        id={`tile-${tile.id}`}
        key={tile.id}
        className={`${s.tile}`}
        style={{
          width: `${tileSideLength}px`,
          height: `${tileSideLength}px`,
          top: `${10 + tile[isDrawed ? "y" : "y0"] * (tileSideLength + 10)}px`,
          left: `${10 + tile[isDrawed ? "x" : "x0"] * (tileSideLength + 10)}px`,
          backgroundColor: `${getTileColor(tile.degree)}`,
          animation: `${tile.status === "just-spawned" ? s.spawn + " 300ms linear" : "none"}, ${tile.degree > 15 ? s.rainbow + " 3s infinite linear" : "none"}`,
          zIndex: `${tile.status === "moved" ? 2 : 1}`,
        }}
      >
        <div key={`tileNumber-${tile.id}`} className={s.tileNumber}>
          {tile.degree > 13 ? (
            <span>
              2<sup>{tile.degree}</sup>
            </span>
          ) : (
            2 ** tile.degree
          )}
        </div>
      </div>
    ));
  };
  useEffect(() => {
    if (localStorage.getItem("tiles") === "[]") {
      restart();
    }

    const handleKeydown = (event: KeyboardEvent): void => {
      switch (event.key) {
        case "ArrowUp":
          moveTiles("up");
          break;
        case "ArrowDown":
          moveTiles("down");
          break;
        case "ArrowLeft":
          moveTiles("left");
          break;
        case "ArrowRight":
          moveTiles("right");
          break;
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);
  useEffect(() => {
    Object.entries(gameState).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }, [gameState]);
  return (
    <section className={s.game}>
      <h2 className="visually-hidden">Игровое поле</h2>
      <section className={s.scoreboard}>
        <section className={s.score} style={{ gridColumn: 1 }}>
          <h3>Счет</h3>
          <p>{gameState.score}</p>
        </section>
        <section className={s.score} style={{ gridColumn: 2 }}>
          <h3>Рекорд</h3>
          <p>{gameState.bestScore}</p>
        </section>
        <section className={s.moves} style={{ gridColumn: 4 }}>
          <h3>Ходы</h3>
          <p>{gameState.moves}</p>
        </section>
      </section>
      <div className={s.playgroundContainer}>
        <section
          className={s.playground}
          style={{
            filter: gameState.isEnded ? "blur(5px)" : "none",
            gridTemplateColumns: `repeat(${size}, ${tileSideLength}px)`,
            gridTemplateRows: `repeat(${size}, ${tileSideLength}px)`,
          }}
        >
          {Array.from({ length: size ** 2 }).map((_, i) => (
            <div id={i.toString()} key={i} className={`${s.tilebase}`}></div>
          ))}
          {drawTiles()}
        </section>
        {gameState.isEnded && <div className={s.gameOver}>Игра окончена</div>}
      </div>
      <div className={s.buttonContainer}>
        <button
          className={s.buttonRestart}
          onClick={() => {
            console.log(theme);
            restart();
          }}
        >
          Новая игра
        </button>
      </div>
    </section>
  );
}

export default Game;
