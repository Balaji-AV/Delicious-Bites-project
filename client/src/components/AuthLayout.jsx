import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle, image }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7F9] via-[#FFD6DF]/30 to-[#FFF7F9] flex items-center justify-center p-4">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#F78CA2]/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FFD6DF]/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative w-full max-w-5xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm border border-[#FFD6DF]/50 grid md:grid-cols-2 animate-fadeIn">
          {/* Left Side - Illustration */}
          <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-[#F78CA2]/10 via-[#FFD6DF]/20 to-[#FF6B81]/10 p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-10 w-32 h-32 bg-[#F78CA2]/30 rounded-full blur-2xl" />
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#FF6B81]/20 rounded-full blur-2xl" />
            </div>
            
            <div className="relative z-10 text-center space-y-6">
              <Link to="/" className="inline-block">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#F78CA2] to-[#FF6B81] rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-3xl">🧁</span>
                </div>
              </Link>
              
              <div className="space-y-3">
                <h1 className="font-['Pacifico',cursive] text-4xl text-[#4A2C2A]">
                  Delicious Bites
                </h1>
                <p className="text-[#4A2C2A]/70 text-lg font-['Poppins',sans-serif]">
                  Baking memories with love
                </p>
              </div>
              
              {image && (
                <div className="mt-8">
                  <div className="text-8xl animate-bounce">
                    {image}
                  </div>
                </div>
              )}
              
              <div className="space-y-2 pt-6">
                <div className="flex items-center gap-2 text-sm text-[#4A2C2A]/60">
                  <span className="w-2 h-2 bg-[#F78CA2] rounded-full" />
                  <span>Premium Quality</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#4A2C2A]/60">
                  <span className="w-2 h-2 bg-[#F78CA2] rounded-full" />
                  <span>Fresh Daily</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#4A2C2A]/60">
                  <span className="w-2 h-2 bg-[#F78CA2] rounded-full" />
                  <span>Made with Love</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Form */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            {/* Mobile Logo */}
            <div className="md:hidden text-center mb-8">
              <Link to="/" className="inline-block">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#F78CA2] to-[#FF6B81] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">🧁</span>
                </div>
              </Link>
              <h1 className="font-['Pacifico',cursive] text-3xl text-[#4A2C2A] mt-4">
                Delicious Bites
              </h1>
            </div>
            
            <div className="space-y-2 mb-8">
              <h2 className="text-3xl font-bold text-[#4A2C2A] font-['Poppins',sans-serif]">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[#4A2C2A]/60 font-['Poppins',sans-serif]">
                  {subtitle}
                </p>
              )}
            </div>
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
