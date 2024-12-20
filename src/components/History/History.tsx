import { useEffect, useState, useContext } from "react";
import { historyContext } from "@/providers/HistoryProvider";
import s from "./History.module.css";

function History() {
  const { historyIsUpdated } = useContext(historyContext);

  type History = {
    [dates: string]: {
      mode: string;
      moves: string;
      score: string;
      isBestScore: string;
    }[];
  };

  const [history, setHistory] = useState<History>(JSON.parse(localStorage.getItem("history")!) ?? {});

  useEffect(() => {
    if (!localStorage.getItem("history")) {
      localStorage.setItem("history", JSON.stringify(history) ?? {});
    }
  });

  useEffect(() => {
    if (historyIsUpdated) {
      setHistory(JSON.parse(localStorage.getItem("history")!) ?? {});
    }
  }, [historyIsUpdated]);

  return (
    <section className={s.history}>
      <h2 className="visually-hidden">История</h2>
      <div className={s.lineContainer} style={{ width: "293px" }}>
        <h3>История игр</h3>
      </div>
      <div className={s.historyContainer}>
        {history &&
          Object.keys(history).map((date) => (
            <div key={`day-${date}`} className={s.dayContainer} style={{}}>
              <span className={s.date}>
                {new Date(parseInt(date) * 864e5).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }).slice(0, -3)}
              </span>
              {history[date].map((day, i) => (
                <div key={`game-${i}`} className={s.lineContainer}>
                  <p className={s.dayData} style={{ width: "97px" }}>
                    {day.mode}
                  </p>
                  <p className={s.dayData} style={{ width: "98px", textDecoration: day.isBestScore === "true" ? "underline" : "none" }}>
                    {day.score}
                  </p>
                  <p className={s.dayData} style={{ width: "98px" }}>
                    {day.moves}
                  </p>
                </div>
              ))}
            </div>
          ))}
        {(localStorage.getItem("history") === "{}" || !localStorage.getItem("history")) && (
          <div style={{ display: "flex", fontWeight: "500", fontSize: "1.2rem", alignSelf: "center" }}>Нет законченных игр</div>
        )}
      </div>
    </section>
  );
}

export default History;
