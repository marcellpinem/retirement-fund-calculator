import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Routes, Route, HashRouter } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import RetirementFund from "./components/RetirementFund.jsx";

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/pensiun" element={<RetirementFund />} />
      <Route path="/pendidikan" element={<App />} />
      <Route path="/darurat" element={<App />} />
    </Routes>
  </HashRouter>,
);
