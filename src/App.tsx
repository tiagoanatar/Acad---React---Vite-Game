import { Routes, Route } from "react-router-dom";
// Routes
import { WaveTest } from "./components/WaveTest";
import { Main } from "./components/Main";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route index element={<Main />} />
      <Route path="wave" element={<WaveTest />} />
    </Routes>
  );
}

export default App;
