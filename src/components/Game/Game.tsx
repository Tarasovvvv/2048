import { useEffect, useState } from "react";
import "@/App.css";
import s from "./Game.module.css";

type GameProps = {
  size: number;
};

function Game({ size }: GameProps) {
  type GameState = {
    score: number;
    bestScore: number;
    moves: number;
    tiles: Tile[];
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
  const tileSideLength: number = 400 / size;
  const [gameState, setGameState] = useState<GameState>({
    score: Number(localStorage.getItem("score")!) ?? 0,
    bestScore: Number(localStorage.getItem("bestScore")!) ?? 0,
    moves: Number(localStorage.getItem("moves")!) ?? 0,
    tiles: JSON.parse(localStorage.getItem("tiles")!) ?? [],
  });
  const getTileColor = (degree: number) => {
    const color: number = 260 - 12 * degree;
    return `rgb(${color},${color},${color})`;
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
    setGameState({ score: 0, bestScore: Number(localStorage.getItem("bestScore") ?? 0), moves: 0, tiles: newTilesMap });
  };
  const moveTiles = (direction: string): void => {
    setGameState((prevGameState) => {
      const horizontal: boolean = direction === "left" || direction === "right";
      const coordsAscending: boolean = direction === "down" || direction === "right";
      const newGameState: GameState = structuredClone(prevGameState);
      const newTiles: Tile[] = newGameState.tiles.filter((t) => t.status !== "deleted");
      for (let i = 0; i < size; i++) {
        // Summarize values and mark tiles for deletion
        const currentLine: Tile[] = newTiles.filter((t) => t[horizontal ? "y" : "x"] === i);
        if (coordsAscending) currentLine.reverse();
        let currentTile: Tile = currentLine[0];
        for (let j = 1; j < currentLine.length; j++) {
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
          }
        });
      }

      // Spawn new tile if movement occurred
      if (
        prevGameState.tiles.filter((t) => t.status !== "deleted").reduce((sumOfCoords, tile) => sumOfCoords + tile.x + tile.y + 1, 0) !==
        newTiles.filter((t) => t.status !== "deleted").reduce((sumOfCoords, tile) => sumOfCoords + tile.x + tile.y + 1, 0)
      ) {
        spawn(newTiles);
        newGameState.moves++;
      } else {
        newTiles.sort((a, b) => {
          return a.x - b.x || a.y - b.y;
        });
      }

      newGameState.tiles = newTiles;
      return newGameState;
    });
  };
  useEffect(() => {
    if (localStorage.getItem("tiles") === "[]") restart();

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
    localStorage.setItem("score", gameState.score.toString());
    localStorage.setItem("bestScore", gameState.bestScore.toString());
    localStorage.setItem("moves", gameState.moves.toString());
    localStorage.setItem("tiles", JSON.stringify(gameState.tiles));
  }, [gameState]);

  const drawTiles = () => {
    setTimeout(() => {
      gameState.tiles.forEach((tile) => {
        const tileElement = document.getElementById(`tile-${tile.id}`)!;
        tileElement.style.top = `${10 + tile.y * (tileSideLength + 10)}px`;
        tileElement.style.left = `${10 + tile.x * (tileSideLength + 10)}px`;
      });
    }, 1);
    return gameState.tiles.map((tile) => (
      <div
        id={`tile-${tile.id}`}
        key={tile.id}
        className={`${s.tile}`}
        style={{
          width: `${tileSideLength}px`,
          height: `${tileSideLength}px`,
          top: `${10 + tile.y0 * (tileSideLength + 10)}px`,
          left: `${10 + tile.x0 * (tileSideLength + 10)}px`,
          backgroundColor: `${getTileColor(tile.degree)}`,
          animation: `${tile.status === "just-spawned" ? s.spawn + " 300ms linear" : "none"}, ${tile.degree > 15 ? s.rainbow + " 3s infinite linear" : "none"}`,
          zIndex: `${tile.status === "moved" ? 2 : 1}`,
        }}
      >
        <div key={`tileNumber-${tile.id}`} className={s.tileNumber}>
          {tile.degree > 13 ? (
            <span>
              {(2 ** tile.degree).toString().slice(0, tile.degree === 17 ? 3 : 2)}
              <br />
              <span className={s.secondHalf}>{(2 ** tile.degree).toString().slice(tile.degree === 17 ? 3 : 2)}</span>
            </span>
          ) : (
            2 ** tile.degree
          )}
        </div>
      </div>
    ));
  };
  return (
    <section className={s.game}>
      <h2 className="visually-hidden">Игровое поле</h2>
      <section className={s.scoreboard}>
        <section className={s.score}>
          <h3>Счет</h3>
          <p>{gameState.score}</p>
        </section>
        <section className={s.score}>
          <h3>Рекорд</h3>
          <p>{gameState.bestScore}</p>
        </section>
      </section>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
        <section
          className={s.playground}
          style={{
            gridTemplateColumns: `repeat(${size}, ${tileSideLength}px)`,
            gridTemplateRows: `repeat(${size}, ${tileSideLength}px)`,
          }}
        >
          {Array.from({ length: size ** 2 }).map((_, i) => (
            <div id={i.toString()} key={i} className={`${s.tilebase}`}></div>
          ))}
          {drawTiles()}
        </section>
        <div className={s.buttonContainer}>
          <button
            className={s.buttonRestart}
            onClick={() => {
              restart();
            }}
          >
            Новая игра
          </button>
        </div>
      </div>
    </section>
  );
}

export default Game;
