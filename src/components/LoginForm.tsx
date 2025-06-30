import React, { useState } from 'react';
import { login } from '@/services/employee-service';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      await login(username, password);
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Login gagal');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xs mx-auto mt-8 p-4 border rounded">
      <h2 className="text-lg font-bold mb-2">Login Admin</h2>
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-600 mt-2">Login berhasil!</div>}
    </form>
  );
}; 