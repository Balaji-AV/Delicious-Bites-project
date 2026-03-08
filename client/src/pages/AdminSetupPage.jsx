import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import InputField from '../components/InputField';
import PasswordInput from '../components/PasswordInput';
import Toast from '../components/Toast';

const AdminSetupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  // Check if admin already exists
  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        const response = await api.get('/admin/check-setup');
        if (response.data.adminExists) {
          // Admin already exists, redirect to login
          navigate('/admin/login');
        }
      } catch (err) {
        console.error('Setup check failed:', err);
      } finally {
        setChecking(false);
      }
    };

    checkAdminExists();
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({ message: 'Please fix the errors', type: 'error' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await api.post('/admin/setup', {
        name: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      setToast({ 
        message: '✅ Admin account created successfully!', 
        type: 'success' 
      });

      setTimeout(() => {
        navigate('/admin/login');
      }, 1500);

    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Setup failed. Please try again.';
      setErrors({ submit: errorMessage });
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF7F9] via-[#FFD6DF]/30 to-[#FFF7F9]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#F78CA2] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[#4A2C2A]/70 font-['Poppins',sans-serif]">Checking setup...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-[#FFF7F9] via-[#FFD6DF]/30 to-[#FFF7F9] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#F78CA2]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FFD6DF]/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm border border-[#FFD6DF]/50 animate-fadeIn">
            <div className="p-8 md:p-10">
              {/* Setup Badge */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#F78CA2] to-[#FF6B81] rounded-full mb-4 shadow-lg">
                  <span className="text-3xl">⚙️</span>
                </div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#4A2C2A]/60 font-['DM Sans',sans-serif]">
                  First Time Setup
                </p>
                <h1 className="text-3xl font-bold text-[#4A2C2A] font-['Pacifico',cursive] mt-2">
                  Create Admin Account
                </h1>
                <p className="text-sm text-[#4A2C2A]/60 mt-2 font-['Poppins',sans-serif]">
                  Set up your admin credentials to manage the bakery
                </p>
              </div>

              <div className="w-full max-w-[400px] mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <InputField
                    label="Admin Username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange('username')}
                    error={errors.username}
                    icon="👤"
                    required
                  />

                  <InputField
                    label="Admin Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    error={errors.email}
                    icon="📧"
                    required
                  />

                  <PasswordInput
                    label="Admin Password"
                    value={formData.password}
                    onChange={handleChange('password')}
                    error={errors.password}
                    showStrength={true}
                    required
                  />

                  <PasswordInput
                    label="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    error={errors.confirmPassword}
                    required
                  />

                  {errors.submit && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-['Poppins',sans-serif] animate-fadeIn">
                      {errors.submit}
                    </div>
                  )}

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
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Setup</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-4 text-center space-y-2">
            <p className="text-xs text-[#4A2C2A]/50 font-['Poppins',sans-serif]">
              🔒 This is a one-time setup · Keep credentials secure
            </p>
            <p className="text-xs text-[#4A2C2A]/40 font-['Poppins',sans-serif]">
              You'll need these credentials to access the admin panel
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSetupPage;
