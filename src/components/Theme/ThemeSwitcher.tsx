import { useContext, useEffect } from "react";
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
  useEffect(() => {
    localStorage.setItem("theme", theme.toString());
  }, [theme]);

  return (
    <section className={s.themeboard}>
      <h2 className="visually-hidden">Сменить тему</h2>
      <button
        onClick={() => {
          setTheme(Theme.light);
        }}
      >
        &lt; light &gt;
      </button>
      <button
        className={s.button}
        onClick={() => {
          setTheme(Theme.dark);
        }}
      >
        &lt; dark &gt;
      </button>
      <button
        onClick={() => {
          setTheme(Theme.monochrome);
        }}
      >
        &lt; mono &gt;
      </button>
    </section>
  );
}

export default ThemeSwitcher;
