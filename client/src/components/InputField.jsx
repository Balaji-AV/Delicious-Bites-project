import React, { useState } from 'react';

const InputField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  icon,
  required = false,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className="w-full">
      <div className={`relative transition-all duration-300 ${
        error ? 'animate-shake' : ''
      }`}>
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A2C2A]/40 z-10 pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          className={`
            w-full px-4 ${icon ? 'pl-11' : 'pl-4'} py-3.5 pt-6
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
          absolute ${icon ? 'left-11' : 'left-4'} transition-all duration-300 pointer-events-none
          font-['Poppins',sans-serif]
          ${isFocused || hasValue
            ? 'top-2 text-xs text-[#F78CA2] font-medium'
            : 'top-1/2 -translate-y-1/2 text-sm text-[#4A2C2A]/50'
          }
        `}>
          {label} {required && <span className="text-[#FF6B81]">*</span>}
        </label>
      </div>
      
      {error && (
        <p className="mt-1.5 ml-1 text-xs text-red-500 font-['Poppins',sans-serif] flex items-center gap-1 animate-fadeIn">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;

