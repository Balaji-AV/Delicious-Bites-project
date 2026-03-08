import React, { useState } from 'react';

const PasswordInput = ({ 
  label = 'Password', 
  value, 
  onChange, 
  error,
  showStrength = false,
  required = false,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const hasValue = value && value.length > 0;

  // Password strength calculation
  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { level: 1, text: 'Weak', color: '#FF6B81' };
    if (strength <= 3) return { level: 2, text: 'Fair', color: '#FFB347' };
    if (strength <= 4) return { level: 3, text: 'Good', color: '#77DD77' };
    return { level: 4, text: 'Strong', color: '#50C878' };
  };

  const strength = showStrength ? getPasswordStrength(value) : null;

  return (
    <div className="w-full">
      <div className={`relative transition-all duration-300 ${
        error ? 'animate-shake' : ''
      }`}>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A2C2A]/40 z-10 pointer-events-none">
          🔒
        </div>
        
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          className={`
            w-full px-4 pl-11 pr-12 py-3.5 pt-6
            bg-[#FFF7F9] border-2 rounded-2xl
            font-['Poppins',sans-serif] text-[#4A2C2A] text-sm
            transition-all duration-300
            focus:outline-none focus:bg-white
            placeholder-transparent
            ${error 
              ? 'border-red-400 focus:border-red-500' 
              : isFocused 
                ? 'border-[#F78CA2] shadow-lg shadow-[#F78CA2]/20' 
                : 'border-[#FFD6DF] hover:border-[#F78CA2]/50'
            }
          `}
          placeholder={label}
          {...props}
        />
        
        {/* Floating Label */}
        <label className={`
          absolute left-11 transition-all duration-300 pointer-events-none
          font-['Poppins',sans-serif]
          ${isFocused || hasValue
            ? 'top-2 text-xs text-[#F78CA2] font-medium'
            : 'top-1/2 -translate-y-1/2 text-sm text-[#4A2C2A]/50'
          }
        `}>
          {label} {required && <span className="text-[#FF6B81]">*</span>}
        </label>
        
        {/* Toggle Password Visibility */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A2C2A]/40 hover:text-[#F78CA2] transition-colors z-10"
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>
      
      {/* Password Strength Indicator */}
      {showStrength && hasValue && !error && (
        <div className="mt-2 space-y-1 animate-fadeIn">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="h-1.5 flex-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: level <= strength.level ? strength.color : '#FFD6DF'
                }}
              />
            ))}
          </div>
          <p className="text-xs font-['Poppins',sans-serif]" style={{ color: strength.color }}>
            Password strength: {strength.text}
          </p>
        </div>
      )}
      
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-['Poppins',sans-serif] flex items-center gap-1 animate-fadeIn">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
