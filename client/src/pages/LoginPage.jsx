import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import PasswordInput from '../components/PasswordInput';
import Toast from '../components/Toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setToast({ message: 'Please fix the errors in the form', type: 'error' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      // Save token
      localStorage.setItem('token', response.data.token);
      
      // Save user data
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Update auth context
      login(response.data.token, response.data.user);

      // Show success toast
      setToast({ message: '🎉 Welcome back! Redirecting...', type: 'success' });

      // Redirect based on user role
      setTimeout(() => {
        if (response.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/home');
        }
      }, 1000);

    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setErrors({ submit: errorMessage });
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <AuthLayout
        title="Welcome Back!"
        subtitle="Sign in to your account to continue"
        image="🍰"
      >
        <div className="w-full max-w-[420px] mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          <InputField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            error={errors.email}
            icon="📧"
            required
          />

          <PasswordInput
            label="Password"
            value={formData.password}
            onChange={handleChange('password')}
            error={errors.password}
            required
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-2 border-[#FFD6DF] text-[#F78CA2] focus:ring-[#F78CA2] focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-sm text-[#4A2C2A]/70 group-hover:text-[#F78CA2] transition-colors font-['Poppins',sans-serif]">
                Remember me
              </span>
            </label>

            <Link
              to="/forgot-password"
              className="text-sm text-[#F78CA2] hover:text-[#FF6B81] transition-colors font-['Poppins',sans-serif] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-['Poppins',sans-serif] animate-fadeIn">
              {errors.submit}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-4 rounded-2xl font-semibold font-['Poppins',sans-serif]
              bg-gradient-to-r from-[#F78CA2] to-[#FF6B81]
              text-white shadow-lg shadow-[#F78CA2]/30
              hover:shadow-xl hover:shadow-[#F78CA2]/40 hover:scale-[1.02]
              active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              transition-all duration-300
              flex items-center justify-center gap-2
            "
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <span>→</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#FFD6DF]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#4A2C2A]/50 font-['Poppins',sans-serif]">
                New to Delicious Bites?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <Link
              to="/register"
              className="text-[#F78CA2] hover:text-[#FF6B81] font-semibold font-['Poppins',sans-serif] transition-colors inline-flex items-center gap-1 group"
            >
              <span>Create an account</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </form>
        </div>
      </AuthLayout>
    </>
  );
};

export default LoginPage;
