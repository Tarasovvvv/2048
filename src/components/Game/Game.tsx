import { useState } from "react";
import "/src/App.css";
import s from "./Game.module.css";
import Playground from "./Playground/Playground.tsx";

const initialScore: number = 2 ** 10;

function Game() {
  const [currentScore, setCurrentScore] = useState<number>(initialScore);
  const [bestScore, setBestScore] = useState<number>(initialScore);
  return (
    <section className="game">
      <h2 className="visually-hidden">Игровое поле</h2>
      <section className={s.scoreboard}>
        <section className={s.score}>
          <h3>Счет</h3>
          <p>{currentScore}</p>
        </section>
        <section className={s.score}>
          <h3>Рекорд</h3>
          <p>{bestScore}</p>
        </section>
      </section>
      <Playground size={4} theme={s.light}></Playground>
    </section>
  );
}

export default Game;
