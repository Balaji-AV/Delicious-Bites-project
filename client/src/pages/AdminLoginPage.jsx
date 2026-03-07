import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('admin@deliciousbites.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password, admin: true });
      login(response.data.token, response.data.user);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Admin login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="card w-full max-w-md p-6 md:p-8 space-y-4" data-anim>
        <p className="text-xs uppercase tracking-[0.25em] text-bakeryBrown/60">Admin Panel</p>
        <h1 className="font-display text-3xl text-bakeryBrown">Admin Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-xs text-bakeryBrown/80">
            Admin Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field mt-1"
              required
            />
          </label>

          <label className="block text-xs text-bakeryBrown/80">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field mt-1"
              required
            />
          </label>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In as Admin'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminLoginPage;
