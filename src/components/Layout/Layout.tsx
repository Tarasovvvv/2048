import { useContext, ReactNode } from "react";
import { themeContext } from "@/providers/ThemeProvider";
import s from "./Layout.module.css";
import "@/vars.css";

function Layout({ children }: { children: ReactNode }) {
  return <div className={`${s.layout} ${useContext(themeContext).theme}`}>{children}</div>;
}

export default Layout;
