import type React from "react";
import { Footer } from "./components/Body/Footer/Footer";
import { Header } from "./components/Body/Header/Header";
import { Main } from "./components/Body/Main/Main";
import { WakuApp } from "./components/WakuApp/WakuApp";

function App(): React.ReactNode {
  return (
    <div className="bg-app dark:bg-app-dark">
      <Header title="Waku Meme Board" />

      <Main>
        <WakuApp />
      </Main>

      <Footer />
    </div>
  );
}

export default App;
