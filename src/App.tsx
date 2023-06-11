import { useState } from "react";
import viteLogo from "/vite.svg";
// Routes
import { Main } from "./components/Main";
import "./App.css";

function App() {
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <Main />
      </div>
    </>
  );
}

export default App;
