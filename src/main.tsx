import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./globals.css";
import PrintSuratTugas from "./pages/PrintSuratTugas";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/print/:id" element={<PrintSuratTugas />} />
        </Routes>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
