import { ReactNode } from "react";
import ThemeProvider from "./ThemeProvider";
import PlaygroundSizeProvider from "./PlaygroundSizeProvider";

function Provider({ children }: { children: ReactNode }) {
  return (
    <PlaygroundSizeProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </PlaygroundSizeProvider>
  );
}

export default Provider;
