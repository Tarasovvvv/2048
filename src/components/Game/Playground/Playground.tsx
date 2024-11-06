import { useState } from "react";
import s from "./Playground.module.css";

const initialScore: number = 0;

interface IPlaygroundProps {
  size: number;
  theme?: string;
}

function Playground({ size, theme }: IPlaygroundProps) {
  const [currentScore, setCurrentScore] = useState<number>(initialScore);
  return (
    <section
      className={s.playground}
      style={{
        gridTemplateColumns: `repeat(${size}, 100px)`,
        gridTemplateRows: `repeat(${size}, 100px)`,
      }}
    >
      {Array.from({ length: size ** 2 }).map((_, i) => (
        <div key={i} className={`${s.tile} ${theme}`}>
          {}
        </div>
      ))}
    </section>
  );
}

export default Playground;
