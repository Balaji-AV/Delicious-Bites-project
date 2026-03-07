import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      navigate('/home');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    setError('Google sign-in UI is ready. Connect it to your OAuth backend endpoint.');
  };

  return (
    <main className="min-h-screen grid md:grid-cols-2 bg-bakeryIvory">
      <section className="hidden md:flex items-center justify-center p-10 bg-gradient-to-br from-bakeryRose/55 to-bakeryPistachio/50">
        <div className="max-w-md space-y-3" data-anim>
          <p className="text-xs uppercase tracking-[0.25em] text-bakeryBrown/60">Welcome Back</p>
          <h1 className="font-display text-5xl text-bakeryBrown">DELICIOUS BITES</h1>
          <p className="font-script text-2xl text-bakeryPrimary">baking memories with love</p>
        </div>
      </section>

      <section className="flex items-center justify-center p-4 md:p-10">
        <div className="card w-full max-w-md p-6 md:p-8 space-y-4" data-anim>
          <h2 className="font-display text-3xl text-bakeryBrown">Sign In</h2>

          <button type="button" onClick={handleGoogleSignIn} className="btn-outline w-full">
            Continue with Google
          </button>

          <div className="text-center text-xs text-bakeryBrown/60">or</div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block text-xs text-bakeryBrown/80">
              Email
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
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-bakeryBrown/70 text-center">
            New customer? <Link to="/register" className="underline text-bakeryPrimary">Create account</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
