import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SuratTugas from "./components/SuratTugas";
import NotaDinas from "./components/NotaDinas";
import Archive from "./pages/Archive";
import Portal from "./pages/Portal";
import { Toaster } from "./components/ui/toaster";
import SuratKeputusan from "./components/SuratKeputusan";
import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const savedToken = localStorage.getItem('token');
    setToken(savedToken);
    setLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    const newToken = localStorage.getItem('token');
    setToken(newToken);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-500">Memuat...</div>
      </div>
    );
  }

  if (!token) {
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
