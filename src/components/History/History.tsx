import { useEffect, useState } from "react";
import s from "./History.module.css";

function History() {
  const [historyData, setHistoryData] = useState();
  useEffect(() => {}, []);

  return <section className={s.history}></section>;
}

export default History;
