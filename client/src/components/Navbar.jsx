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

  return (
    <header className="bg-white/80 backdrop-blur border-b border-bakeryPink/60 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#ffc8dd] to-bakeryPeach flex items-center justify-center shadow-sm">
            <span className="text-bakeryBrown font-bold text-lg tracking-tight">DB</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-bakeryBrown tracking-wide">
              Delicious Bites
            </span>
            <span className="text-[11px] text-bakeryBrown/70">
              Baking memories with love
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link
            to="/"
            className={`nav-link ${
              location.pathname === '/' ? 'nav-link--active text-bakeryBrown' : ''
            }`}
          >
            Menu
          </Link>
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
          {isAdmin && (
            <>
              <Link
                to="/admin/products"
                className={`nav-link ${
                  location.pathname.startsWith('/admin/products')
                    ? 'nav-link--active text-bakeryBrown'
                    : ''
                }`}
              >
                Products
              </Link>
              <Link
                to="/admin/orders"
                className={`nav-link ${
                  location.pathname.startsWith('/admin/orders')
                    ? 'nav-link--active text-bakeryBrown'
                    : ''
                }`}
              >
                Orders
              </Link>
            </>
          )}
          {!isAdmin && (
            <button
              type="button"
              onClick={openCart}
              className="relative nav-link"
            >
              Cart
              {cartCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center rounded-full bg-bakeryBrown text-white text-[10px] px-1.5 py-0.5">
                  {cartCount}
                </span>
              )}
            </button>
          )}
          {!user && (
            <>
              <Link to="/login" className="btn-outline px-3 py-1 text-xs">
                Login
              </Link>
              <Link to="/register" className="btn-primary px-3 py-1 text-xs">
                Sign Up
              </Link>
              <Link to="/admin/login" className="text-xs text-bakeryBrown/70 nav-link">
                Admin
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

