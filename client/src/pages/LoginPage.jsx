import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Login to Delicious Bites">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input label="Email" type="email" value={email} onChange={setEmail} />
        <Input label="Password" type="password" value={password} onChange={setPassword} />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </AuthLayout>
  );
};

const AuthLayout = ({ title, subtitle, children }) => (
  <main className="min-h-[70vh] flex items-center justify-center px-4">
    <div className="card max-w-md w-full p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-bakeryBrown mb-1">{title}</h1>
        {subtitle && <p className="text-xs text-bakeryBrown/70">{subtitle}</p>}
      </div>
      {children}
    </div>
  </main>
);

const Input = ({ label, type = 'text', value, onChange }) => (
  <label className="block text-xs text-bakeryBrown/80 space-y-1">
    <span>{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-full border border-bakeryPink px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bakeryPeach bg-white"
    />
  </label>
);

export default LoginPage;

