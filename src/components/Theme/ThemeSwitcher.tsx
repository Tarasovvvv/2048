import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";
import s from "./ThemeSwitcher.module.css";
import lightThemeLogo from "/src/assets/light-theme.svg";

enum Theme {
  light,
  dark,
  monochrome,
}

function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <section>
      <div className={s.buttonContainer}>
        <button
          className={s.button}
          onClick={() => {
            setTheme(Theme.light);
          }}
        >
          <img src={lightThemeLogo} className="button-image" />
        </button>
        <button
          className={s.button}
          onClick={() => {
            setTheme(Theme.dark);
          }}
        >
          d
        </button>
        <button
          className={s.button}
          onClick={() => {
            setTheme(Theme.monochrome);
          }}
        >
          m
        </button>
      </div>
    </section>
  );
}

export default ThemeSwitcher;
