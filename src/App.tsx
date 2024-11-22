import { Game, History, Mode, ThemeSwitcher, Layout } from "@/components/index";

function App() {
  return (
    <Layout>
      <h1 className="visually-hidden">Игра 2048</h1>
      <ThemeSwitcher />
      <Mode />
      <Game />
      <History />
    </Layout>
  );
}
export default App;
