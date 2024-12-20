import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { themeContext } from "@/providers/ThemeProvider";
import { historyContext } from "@/providers/HistoryProvider";
import { playgroundSizeContext } from "@/providers/PlaygroundSizeProvider";
import s from "./Game.module.css";
import "@/App.css";

function Game() {
  const { theme } = useContext(themeContext);
  const { historyIsUpdated, setHistoryIsUpdated } = useContext(historyContext);
  const { playgroundSize } = useContext(playgroundSizeContext);

  type GameState = {
    score: number;
    bestScore: number[];
    moves: number;
    tiles: Tile[];
    isEnded: boolean;
    playgroundSize: number;
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

  const tileSideLength: number = useMemo((): number => (410 - (playgroundSize - 1) * 10) / playgroundSize, [playgroundSize]);

  const [gameState, setGameState] = useState<GameState>({
    score: Number(localStorage.getItem("score")!) ?? 0,
    bestScore: JSON.parse(localStorage.getItem("bestScore")!) ?? [0, 0, 0, 0],
    moves: Number(localStorage.getItem("moves")!) ?? 0,
    tiles: JSON.parse(localStorage.getItem("tiles")!) ?? [],
    isEnded: Boolean(localStorage.getItem("isEnded") === "true"),
    playgroundSize: playgroundSize,
  });

  const getTileColor = useCallback(
    (degree: number): string => {
      if (theme === "monochrome") return "white";
      return `hsl(${(degree * 360) / playgroundSize ** 2}, ${theme === "dark" ? 50 : 100}%, ${theme === "dark" ? 20 : 50}%)`;
    },
    [theme, playgroundSize]
  );

  const spawn = (tilesMap: Tile[]): void => {
    const range: number = playgroundSize ** 2;
    if (tilesMap.filter((t) => t.status !== "deleted").length === range) return;
    const engadedPositions: number[] = tilesMap.map((tile: Tile) => tile.x + playgroundSize * tile.y);
    let position: number = Math.floor(Math.random() * range);
    while (engadedPositions.includes(position)) {
      position = Math.floor(Math.random() * range);
    }
    tilesMap.push({
      id: Date.now() + Math.random(),
      x0: position % playgroundSize,
      y0: (position - (position % playgroundSize)) / playgroundSize,
      x: position % playgroundSize,
      y: (position - (position % playgroundSize)) / playgroundSize,
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
    setHistoryIsUpdated(false);
    setGameState({
      score: 0,
      bestScore: JSON.parse(localStorage.getItem("bestScore")!) ?? [0, 0, 0, 0],
      moves: 0,
      tiles: newTilesMap,
      isEnded: false,
      playgroundSize: playgroundSize,
    });
  };

  const updateHistory = (): void => {
    if (localStorage.getItem("historyIsUpdated") === "false" || historyIsUpdated) {
      const date: number = Math.trunc(Date.now() / 864e5);
      const history: {
        [dates: string]: {
          mode: string;
          moves: string;
          score: string;
          isBestScore: string;
        }[];
      } = JSON.parse(localStorage.getItem("history")!) ?? {};
      if (!history[date]) {
        history[date] = [];
      }
      history[date].unshift({
        mode: `${playgroundSize}x${playgroundSize}`,
        moves: gameState.moves.toString(),
        score: gameState.score.toString(),
        isBestScore: (gameState.bestScore[playgroundSize - 4] < gameState.score).toString(),
      });
      localStorage.setItem("history", JSON.stringify(history));
      localStorage.setItem("historyIsUpdated", "true");

      setTimeout(() => {
        setHistoryIsUpdated(true);
      }, 10);
    }
  };

  const checkMovable = (tilesMap: Tile[]): boolean => {
    const checkedTilesMap: Tile[] = tilesMap.filter((t) => t.status !== "deleted");
    let isMovable: boolean = checkedTilesMap.length < playgroundSize ** 2;
    if (isMovable) {
      return isMovable;
    }
    stop: for (let i = 0; i < playgroundSize; i++) {
      let currentLine: Tile[] = checkedTilesMap.filter((t) => t.x === i);
      for (let j = 1; j < playgroundSize; j++) {
        if (currentLine[j].degree === currentLine[j - 1].degree) {
          isMovable = true;
          break stop;
        }
      }
      for (let j = playgroundSize - 2; j >= 0; j--) {
        if (currentLine[j].degree === currentLine[j + 1].degree) {
          isMovable = true;
          break stop;
        }
      }
      currentLine = checkedTilesMap.filter((t) => t.y === i);
      for (let j = 1; j < playgroundSize; j++) {
        if (currentLine[j].degree === currentLine[j - 1].degree) {
          isMovable = true;
          break stop;
        }
      }
      for (let j = playgroundSize - 2; j >= 0; j--) {
        if (currentLine[j].degree === currentLine[j + 1].degree) {
          isMovable = true;
          break stop;
        }
      }
    }
    return isMovable;
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
      }, 10);
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
          {(playgroundSize > 5 && tile.degree > 6) || (playgroundSize < 6 && tile.degree > 13) ? (
            <span style={{ fontSize: `${(2.3 * 4) / playgroundSize}rem` }}>
              2<sup>{tile.degree}</sup>
            </span>
          ) : (
            <span style={{ fontSize: `${(2.3 * 4) / playgroundSize}rem` }}>{2 ** tile.degree}</span>
          )}
        </div>
      </div>
    ));
  };

  if (gameState.tiles.length === 0) {
    restart();
  }

  useEffect(() => {
    if (localStorage.getItem("tiles") === "[]") {
      restart();
    }

    const handleKeydown = (event: KeyboardEvent): void => {
      if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"].includes(event.key)) {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
          event.preventDefault();
        }
        setGameState((prevGameState) => {
          if (prevGameState.isEnded) return prevGameState;
          let newCoordsSum: number = 0;
          let prevCoordsSum: number = 0;
          const horizontal: boolean = event.key === "ArrowLeft" || event.key === "ArrowRight";
          const coordsAscending: boolean = event.key === "ArrowDown" || event.key === "ArrowRight";
          const newGameState: GameState = structuredClone(prevGameState);
          const newTiles: Tile[] = newGameState.tiles.filter((t) => t.status !== "deleted");
          for (let i = 0; i < playgroundSize; i++) {
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
                if (newGameState.score > newGameState.bestScore[playgroundSize - 4]) {
                  newGameState.bestScore[playgroundSize - 4] = newGameState.score;
                  localStorage.setItem("bestScore", JSON.stringify(newGameState.bestScore));
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
              t[horizontal ? "x" : "y"] = coordsAscending ? playgroundSize - 1 - i + deletedTilesCount : i - deletedTilesCount;
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
              updateHistory();
            }
            newTiles.sort((a, b) => {
              return a.x - b.x || a.y - b.y;
            });
          }

          newGameState.tiles = newTiles;
          localStorage.setItem("isDrawed", "false");

          return newGameState;
        });
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });

  useEffect(() => {
    if (gameState.playgroundSize !== playgroundSize) restart();
  }, [playgroundSize]);

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
          <h3 className={s.h3}>Счет</h3>
          <p className={s.p}>{gameState.score}</p>
        </section>
        <section className={s.score} style={{ gridColumn: 2 }}>
          <h3 className={s.h3}>Рекорд</h3>
          <p className={s.p}>{gameState.bestScore[playgroundSize - 4]}</p>
        </section>
        <section className={s.moves} style={{ gridColumn: 4 }}>
          <h3 className={s.h3}>Ходы</h3>
          <p className={s.p}>{gameState.moves}</p>
        </section>
      </section>
      <div className={s.playgroundContainer}>
        <section
          className={s.playground}
          style={{
            filter: gameState.isEnded ? "blur(5px)" : "none",
            gridTemplateColumns: `repeat(${playgroundSize}, ${tileSideLength}px)`,
            gridTemplateRows: `repeat(${playgroundSize}, ${tileSideLength}px)`,
          }}
        >
          {Array.from({ length: playgroundSize ** 2 }).map((_, i) => (
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
