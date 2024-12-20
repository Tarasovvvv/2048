import { createContext, ReactNode, Dispatch, SetStateAction, useState, useEffect } from "react";

interface IHistoryProvider {
  historyIsUpdated: boolean;
  setHistoryIsUpdated: Dispatch<SetStateAction<boolean>>;
}

export const historyContext: React.Context<IHistoryProvider> = createContext<IHistoryProvider>({ historyIsUpdated: false, setHistoryIsUpdated: () => {} });

function HistoryProvider({ children }: { children: ReactNode }) {
  const [historyIsUpdated, setHistoryIsUpdated] = useState<boolean>(localStorage.getItem("historyIsUpdated") ? (localStorage.getItem("historyIsUpdated") === "true" ? true : false) : false);

  useEffect(() => {
    localStorage.setItem("historyIsUpdated", historyIsUpdated.toString());
  }, [historyIsUpdated]);

  return <historyContext.Provider value={{ historyIsUpdated, setHistoryIsUpdated }}>{children}</historyContext.Provider>;
}

export default HistoryProvider;
