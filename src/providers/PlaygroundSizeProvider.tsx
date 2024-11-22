import { createContext, ReactNode, Dispatch, SetStateAction, useState, useEffect } from "react";

interface IPlaygroundSize {
  playgroundSize: number;
  setPlaygroundSize: Dispatch<SetStateAction<number>>;
}

export const playgroundSizeContext: React.Context<IPlaygroundSize> = createContext<IPlaygroundSize>({ playgroundSize: 4, setPlaygroundSize: () => {} });

function PlaygroundSizeProvider({ children }: { children: ReactNode }) {
  const savedPlaygroundSize: number = Number(localStorage.getItem("playgroundSize"));
  const [playgroundSize, setPlaygroundSize] = useState<number>(savedPlaygroundSize ? savedPlaygroundSize : 4);

  useEffect(() => {
    localStorage.setItem("playgroundSize", playgroundSize.toString());
  }, [playgroundSize]);

  return <playgroundSizeContext.Provider value={{ playgroundSize, setPlaygroundSize }}>{children}</playgroundSizeContext.Provider>;
}

export default PlaygroundSizeProvider;
