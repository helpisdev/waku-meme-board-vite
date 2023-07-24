import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HeliaProvider } from "./provider/HeliaProvider";
import { ThemeProvider } from "./provider/ThemeProvider";
import { WakuProvider } from "./provider/WakuProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <HeliaProvider>
        <WakuProvider>
          <App />
        </WakuProvider>
      </HeliaProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
