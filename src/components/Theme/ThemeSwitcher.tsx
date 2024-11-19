import { useContext, useEffect } from "react";
import { themeContext } from "@/providers/ThemeProvider";
import LightThemeLogo from "@assets/LightThemeLogo";
import DarkThemeLogo from "@assets/DarkThemeLogo";
import MonochromeThemeLogo from "@assets/MonochromeThemeLogo";
import s from "./ThemeSwitcher.module.css";

function ThemeSwitcher() {
  const { theme, setTheme } = useContext(themeContext);
  useEffect(() => {
    localStorage.setItem("theme", theme.toString());
  }, [theme]);
  return (
    <section className={s.themeboard}>
      <h2 className="visually-hidden">Сменить тему</h2>
      <button
        onClick={() => {
          setTheme("light");
        }}
      >
        <LightThemeLogo className={s.lightThemeLogo} />
      </button>
      <button
        onClick={() => {
          setTheme("dark");
        }}
      >
        <DarkThemeLogo className={s.darkThemeLogo} />
      </button>
      <button
        onClick={() => {
          setTheme("monochrome");
        }}
      >
        <MonochromeThemeLogo className={s.monochromeThemeLogo} />
      </button>
    </section>
  );
}

export default ThemeSwitcher;
