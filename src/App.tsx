import { Game, History, Mode, ThemeSwitcher } from "@/components/index";

function App() {
  return (
    <>
      <h1 className="visually-hidden">Игра 2048</h1>
      <ThemeSwitcher></ThemeSwitcher>
      <Game size={4}></Game>
      <History></History>
      <Mode></Mode>
    </>
  );
}

export default App;
