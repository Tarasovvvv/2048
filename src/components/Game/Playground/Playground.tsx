import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import s from "./Playground.module.css";

type PlaygroundProps = {
  size: number;
  theme?: string;
};

function Playground({ size, theme }: PlaygroundProps) {
  type Tile = {
    x: number;
    y: number;
    degree: number;
  };

  // localStorage.setItem(
  //   "tiles",
  //   JSON.stringify([
  //     { x: 0, y: 0, degree: 1 },
  //     { x: 0, y: 1, degree: 2 },
  //     { x: 0, y: 2, degree: 3 },
  //     { x: 0, y: 3, degree: 4 },
  //     { x: 1, y: 0, degree: 5 },
  //     { x: 1, y: 1, degree: 6 },
  //     { x: 1, y: 2, degree: 7 },
  //     { x: 1, y: 3, degree: 8 },
  //     { x: 2, y: 0, degree: 9 },
  //     { x: 2, y: 1, degree: 10 },
  //     { x: 2, y: 2, degree: 11 },
  //     { x: 2, y: 3, degree: 12 },
  //     { x: 3, y: 0, degree: 13 },
  //     { x: 3, y: 1, degree: 14 },
  //     { x: 3, y: 2, degree: 15 },
  //     { x: 3, y: 3, degree: 16 },
  //   ])
  // );
  if (!localStorage.getItem("tiles")) {
    localStorage.setItem("tiles", JSON.stringify([]));
  }

  const tileSideLength: number = 400 / size;
  const playground: Element = document.querySelector("playground")!;
  const initialTiles: Tile[] = JSON.parse(localStorage.getItem("tiles")!);
  const [tiles, setTiles] = useState<Tile[]>(initialTiles);
  const pickFreePosition = () => {
    const range: number = size ** 2 + 1;
    const engadedPositions: number[] = tiles.map((tile) => tile.x + size * tile.y);
    let position: number = Math.floor(Math.random() * range);
    while (position in engadedPositions) {
      position = Math.floor(Math.random() * range);
    }
    return position;
  };
  const getTileColor = (degree: number) => {
    const color: number = 260 - 12 * degree;
    return `rgb(${color},${color},${color})`;
  };

  useEffect(() => {
    setTiles(JSON.parse(localStorage.getItem("tiles") ?? "[]"));
  }, [localStorage.getItem("playgroundState")]);

  return (
    <section
      className={s.playground}
      style={{
        gridTemplateColumns: `repeat(${size}, ${400 / size}px)`,
        gridTemplateRows: `repeat(${size}, ${400 / size}px)`,
      }}
    >
      {Array.from({ length: size ** 2 }).map((_, i) => (
        <div id={i.toString()} key={i} className={`${s.tilebase}`}></div>
      ))}
      {tiles.map((tile, i) => (
        <div
          key={i}
          className={`${s.tile}`}
          style={{
            width: `${tileSideLength}px`,
            height: `${tileSideLength}px`,
            top: `${10 + tile.y * (tileSideLength + 10)}px`,
            left: `${10 + tile.x * (tileSideLength + 10)}px`,
            backgroundColor: `${getTileColor(tile.degree)}`,
            animation: `${tile.degree > 15 ? s.rainbow + " 3s infinite linear" : "none"}`,
          }}
        >
          {tile.degree > 13 ? (
            <div className={s.tileNumber}>
              {(2 ** tile.degree).toString().slice(0, tile.degree === 17 ? 3 : 2)}
              <br />
              <span className={s.secondHalf}>
                {(2 ** tile.degree).toString().slice(tile.degree === 17 ? 3 : 2)}
              </span>
            </div>
          ) : (
            <div className={s.tileNumber}>{2 ** tile.degree}</div>
          )}
        </div>
      ))}
    </section>
  );
}

export default Playground;
