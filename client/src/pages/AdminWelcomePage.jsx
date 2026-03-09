import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const FEATURES = [
  { icon: '📊', title: 'Live Dashboard', desc: 'Real-time overview of orders, revenue, menu items, and customer activity.' },
  { icon: '🧁', title: 'Menu Management', desc: 'Add, edit, or remove products with image uploads and category control.' },
  { icon: '📦', title: 'Order Tracking', desc: 'Monitor incoming orders, update statuses, and manage cancellations live.' },
  { icon: '👥', title: 'Customer Records', desc: 'View registered users, order history, and engagement at a glance.' },
];

const STATS = [
  { label: 'Real-time Updates', icon: '⚡' },
  { label: 'Image Upload', icon: '📸' },
  { label: 'Secure Access', icon: '🔒' },
  { label: 'WebSocket Live', icon: '🌐' },
];

const AdminWelcomePage = () => {
  const { user } = useAuth();
  const isLoggedAdmin = user?.role === 'admin';

  const heroRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    // Simple staggered entrance
    const cards = document.querySelectorAll('.admin-feature-card');
    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 300 + i * 120);
    });

    const badges = document.querySelectorAll('.admin-stat-badge');
    badges.forEach((badge, i) => {
      badge.style.opacity = '0';
      badge.style.transform = 'scale(0.8)';
      setTimeout(() => {
        badge.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        badge.style.opacity = '1';
        badge.style.transform = 'scale(1)';
      }, 800 + i * 100);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#F78CA2]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-15%] left-[-8%] w-[600px] h-[600px] bg-[#e94560]/10 rounded-full blur-[140px]" />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-[#533483]/15 rounded-full blur-[100px]" />

      {/* Nav */}
      <nav className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/images/logo.jpeg" alt="Delicious Bites" className="h-10 w-auto object-contain logo-smooth rounded-lg" />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-lg tracking-wide text-white/90">DELICIOUS BITES</span>
            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Admin Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedAdmin ? (
            <Link to="/admin/dashboard" className="px-5 py-2 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all border border-white/10">
              Go to Dashboard →
            </Link>
          ) : (
            <Link to="/admin/login" className="px-5 py-2 rounded-full bg-gradient-to-r from-[#e94560] to-[#F78CA2] text-white text-sm font-medium hover:shadow-lg hover:shadow-[#e94560]/30 transition-all">
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="text-center max-w-2xl mx-auto">
          {/* Admin badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 mb-6 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Admin Control Center
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white leading-[1.1] mb-4 animate-slideUp">
            Manage Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F78CA2] to-[#e94560] mt-1">
              Bakery Empire
            </span>
          </h1>

          <p className="text-white/50 text-base md:text-lg max-w-lg mx-auto mb-8 animate-slideUp" style={{ animationDelay: '0.15s' }}>
            Complete control over your menu, orders, customers, and real-time business insights — all in one place.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap items-center justify-center gap-3 animate-slideUp" style={{ animationDelay: '0.3s' }}>
            {isLoggedAdmin ? (
              <Link
                to="/admin/dashboard"
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#e94560] to-[#F78CA2] text-white font-semibold hover:shadow-xl hover:shadow-[#e94560]/30 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Open Dashboard
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            ) : (
              <>
                <Link
                  to="/admin/login"
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-[#e94560] to-[#F78CA2] text-white font-semibold hover:shadow-xl hover:shadow-[#e94560]/30 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  Admin Login
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to="/admin/setup"
                  className="px-6 py-3 rounded-full bg-white/5 text-white/70 font-medium border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                  First Time Setup
                </Link>
              </>
            )}
          </div>

          {/* Stat badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
            {STATS.map((s) => (
              <div key={s.label} className="admin-stat-badge flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/50">
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section ref={cardsRef} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="admin-feature-card group rounded-2xl bg-white/[0.04] border border-white/10 p-5 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e94560]/20 to-[#F78CA2]/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <h3 className="text-white/90 font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-6 text-center">
        <p className="text-white/25 text-xs">
          Delicious Bites Admin Portal · Secure Access Only
        </p>
      </footer>
    </div>
  );
};

export default AdminWelcomePage;
