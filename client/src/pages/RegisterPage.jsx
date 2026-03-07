import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
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
      const response = await api.post('/auth/register', { name, email, password });
      login(response.data.token, response.data.user);
      navigate('/home');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
    setError('Google signup UI is ready. Connect it to your OAuth backend endpoint.');
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="card w-full max-w-lg p-6 md:p-8 space-y-4" data-anim>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-bakeryBrown/60">Get Started</p>
          <h1 className="font-display text-3xl text-bakeryBrown mt-1">Create Your Account</h1>
        </div>

        <button type="button" onClick={handleGoogleSignup} className="btn-outline w-full">
          Sign Up with Google
        </button>

        <div className="text-center text-xs text-bakeryBrown/60">or register with email</div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="block text-xs text-bakeryBrown/80">
            Full Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field mt-1"
              required
            />
          </label>

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
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-xs text-center text-bakeryBrown/70">
          Already have an account? <Link to="/login" className="underline text-bakeryPrimary">Sign in</Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;
