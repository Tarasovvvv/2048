import s from "./Mode.module.css";
import { useContext, useEffect } from "react";
import { playgroundSizeContext } from "@/providers/PlaygroundSizeProvider";
function Mode() {
  const { playgroundSize, setPlaygroundSize } = useContext(playgroundSizeContext);
  useEffect(() => {
    localStorage.setItem("playgroundSize", playgroundSize.toString());
    localStorage.setItem("historyIsUpdated", "false");
  }, [playgroundSize]);
  return (
    <section className={s.mode} title="Выбрать размер игрового поля">
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignContent: "space-between", width: "170px" }}>
        <h2>Размер поля</h2>
        <div className={s.lineContainer}>
          <label>
            <div className={s.inputContainer}>
              <input
                type="radio"
                name="size4"
                className={s.radio}
                checked={playgroundSize === 4}
                onChange={() => {
                  setPlaygroundSize(4);
                }}
              />
              16
            </div>
          </label>
          <label>
            <div className={s.inputContainer}>
              <input
                type="radio"
                name="size5"
                className={s.radio}
                checked={playgroundSize === 5}
                onChange={() => {
                  setPlaygroundSize(5);
                }}
              />
              25
            </div>
          </label>
          <label>
            <div className={s.inputContainer}>
              <input
                type="radio"
                name="size6"
                className={s.radio}
                checked={playgroundSize === 6}
                onChange={() => {
                  setPlaygroundSize(6);
                }}
              />
              36
            </div>
          </label>
          <label>
            <div className={s.inputContainer}>
              <input
                type="radio"
                name="size7"
                className={s.radio}
                checked={playgroundSize === 7}
                onChange={() => {
                  setPlaygroundSize(7);
                }}
              />
              49
            </div>
          </label>
        </div>
      </div>
      <p className={s.warning}>При изменении текущий прогресс будет потерян!</p>
    </section>
  );
}

export default Mode;
