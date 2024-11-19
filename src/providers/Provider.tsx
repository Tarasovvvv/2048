import { ReactNode } from "react";
import ThemeProvider from "./ThemeProvider";

function Provider({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

export default Provider;
