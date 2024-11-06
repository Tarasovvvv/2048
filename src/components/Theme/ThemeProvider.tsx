import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

enum Theme {
  light,
  dark,
  monochrome,
}

interface IThemeProvider {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
}

const initialValue: IThemeProvider = {
  theme: Theme.light,
  setTheme: () => {},
};
const ThemeContext = createContext<IThemeProvider>(initialValue);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(Theme.light);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export { ThemeProvider, ThemeContext };
