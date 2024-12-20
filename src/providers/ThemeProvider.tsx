import { createContext, ReactNode, Dispatch, SetStateAction, useState, useEffect } from "react";

interface ITheme {
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
}

export const themeContext: React.Context<ITheme> = createContext<ITheme>({ theme: "light", setTheme: () => {} });

function ThemeProvider({ children }: { children: ReactNode }) {
  const savedTheme = localStorage.getItem("theme");
  const [theme, setTheme] = useState<string>(savedTheme ? savedTheme : "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return <themeContext.Provider value={{ theme, setTheme }}>{children}</themeContext.Provider>;
}

export default ThemeProvider;
