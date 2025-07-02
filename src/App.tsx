import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SuratTugas from "./components/SuratTugas";
import NotaDinas from "./components/NotaDinas";
import Archive from "./pages/Archive";
import Portal from "./pages/Portal";
import { Toaster } from "./components/ui/toaster";
import SuratKeputusan from "./components/SuratKeputusan";
import React, { useState } from 'react';
import { LoginForm } from './components/LoginForm';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // Listen to login event (success in LoginForm)
  const handleLoginSuccess = () => {
    setToken(localStorage.getItem('token'));
  };

  if (!token) {
    // LoginForm akan trigger handleLoginSuccess setelah login
    return <LoginForm onSuccess={handleLoginSuccess} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Portal />} />
      <Route path="/surat-tugas" element={<SuratTugas />} />
      <Route path="/nota-dinas" element={<NotaDinas />} />
      <Route path="/archive" element={<Archive />} />
      <Route path="/surat-keputusan" element={<SuratKeputusan />} />
    </Routes>
  );
}
