import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./globals.css";
import PrintSuratTugas from "./pages/PrintSuratTugas";
import { Routes, Route, BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/print/:id" element={<PrintSuratTugas />} />
      </Routes>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
