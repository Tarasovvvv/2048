import { ReactNode } from "react";
import ThemeProvider from "./ThemeProvider";
import PlaygroundSizeProvider from "./PlaygroundSizeProvider";
import HistoryProvider from "./HistoryProvider";

function Provider({ children }: { children: ReactNode }) {
  return (
    <HistoryProvider>
      <PlaygroundSizeProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </PlaygroundSizeProvider>
    </HistoryProvider>
  );
}

export default Provider;
