import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useUI } from '../contexts/UIContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { openCart } = useUI();
  const location = useLocation();
  const navigate = useNavigate();

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = [
    { label: 'Home', to: '/home' },
    { label: 'Menu', to: '/menu' },
    { label: 'About', to: '/about' },
    { label: 'Account', to: '/account', requiresAuth: true }
  ];

  return (
    <header className="bg-white/80 backdrop-blur border-b border-bakeryPink/60 sticky top-0 z-20 navbar-animated">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link to="/home" className="flex items-center gap-3">
          <img src="/images/logo.jpeg" alt="Delicious Bites" className="h-10 w-auto object-contain logo-smooth" />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-lg text-bakeryBrown tracking-wide">
              DELICIOUS BITES
            </span>
            <span className="text-[11px] text-bakeryBrown/70 font-script text-sm">
              Baking memories with love
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-4 text-sm flex-wrap justify-end">
          {links
            .filter((link) => (link.requiresAuth ? !!user && !isAdmin : true))
            .map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${
                  location.pathname.startsWith(link.to)
                    ? 'nav-link--active text-bakeryBrown'
                    : ''
                }`}
              >
                {link.label}
              </Link>
            ))}

          {user && !isAdmin && (
            <Link
              to="/orders"
              className={`nav-link ${
                location.pathname.startsWith('/orders')
                  ? 'nav-link--active text-bakeryBrown'
                  : ''
              }`}
            >
              My Orders
            </Link>
          )}

          {!isAdmin && user && (
            <Link
              to="/cart"
              className="relative nav-link"
            >
              Cart
              {cartCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center rounded-full bg-bakeryBrown text-white text-[10px] px-1.5 py-0.5">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          {!user && (
            <>
              <Link to="/login" className="btn-outline px-3 py-1 text-xs">
                Login
              </Link>
              <Link to="/register" className="btn-primary px-3 py-1 text-xs">
                Sign Up
              </Link>
            </>
          )}
          {user && (
            <button onClick={handleLogout} className="btn-outline px-3 py-1 text-xs">
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

