import { useEffect, useState } from "react";
import s from "./History.module.css";

function History() {
  type History = {
    [dates: string]: {
      mode: string;
      moves: string;
      score: string;
      isBestScore: string;
    }[];
  };

  const [history, setHistory] = useState<History>({
    "25 апреля 2002": [
      { mode: "7x7", moves: "23", score: "1024", isBestScore: "true" },
      { mode: "7x7", moves: "23", score: "1024", isBestScore: "false" },
      { mode: "7x7", moves: "23", score: "1024", isBestScore: "false" },
    ],
    "26 апреля 2002": [
      { mode: "7x7", moves: "23", score: "1024", isBestScore: "false" },
      { mode: "7x7", moves: "23", score: "1024", isBestScore: "false" },
      { mode: "7x7", moves: "23", score: "1024", isBestScore: "false" },
    ],
    "23 апреля 2002": [
      { mode: "7x7", moves: "23", score: "1024", isBestScore: "false" },
      { mode: "7x7", moves: "23", score: "1024", isBestScore: "false" },
      { mode: "7x7", moves: "23", score: "1024", isBestScore: "false" },
    ],
    "12 апреля 2002": [
      { mode: "7x7", moves: "23", score: "1024", isBestScore: "false" },
      { mode: "7x7", moves: "23", score: "1024", isBestScore: "false" },
      { mode: "7x7", moves: "23", score: "1024", isBestScore: "false" },
    ],
    "31 апреля 2002": [
      { mode: "7x7", moves: "23", score: "1024", isBestScore: "false" },
      { mode: "7x7", moves: "23", score: "1024", isBestScore: "false" },
      { mode: "7x7", moves: "23", score: "1024", isBestScore: "false" },
    ],
    "1 апреля 2002": [
      { mode: "7x7", moves: "23", score: "1024", isBestScore: "false" },
      { mode: "7x7", moves: "23", score: "1024", isBestScore: "false" },
      { mode: "7x7", moves: "23", score: "1024", isBestScore: "false" },
    ],
  });

  useEffect(() => {
    if (!localStorage.getItem("history")) {
      localStorage.setItem("history", JSON.stringify(history));
    }
  }, []);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem("history")!) ?? {});
  }, [localStorage.getItem("history")]);

  return (
    <section className={s.history}>
      <h2 className="visually-hidden">История</h2>
      <div className={s.lineContainer} style={{ width: "293px" }}>
        <h3>История игр</h3>
      </div>
      <div className={s.historyContainer}>
        {history &&
          Object.keys(history).map((date) => (
            <div key={`day-${date}`} className={s.dayContainer}>
              <span className={s.date}>{date}</span>
              {history[date].map((day, i) => (
                <div key={`game-${i}`} className={s.lineContainer}>
                  <p className={s.dayData} style={{ width: "97px" }}>
                    {day.mode}
                  </p>
                  <p className={s.dayData} style={{ width: "98px", color: day.isBestScore === "true" ? "var(--history-bestscore)" : "var(--secondary-text-color)" }}>
                    {day.score}
                  </p>
                  <p className={s.dayData} style={{ width: "98px" }}>
                    {day.moves}
                  </p>
                </div>
              ))}
            </div>
          ))}
      </div>
    </section>
  );
}

export default History;
