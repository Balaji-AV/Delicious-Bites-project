import React from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-[80vh] max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-[220px,1fr] gap-4">
      <aside className="card p-4 space-y-3">
        <div className="mb-2">
          <p className="text-xs uppercase tracking-wide text-bakeryBrown/60">
            Admin Panel
          </p>
          <p className="text-sm font-semibold text-bakeryBrown">Delicious Bites</p>
        </div>
        <nav className="space-y-1 text-sm">
          <AdminLink to="/admin/dashboard" active={location.pathname === '/admin/dashboard'}>
            Dashboard
          </AdminLink>
          <AdminLink
            to="/admin/products"
            active={location.pathname.startsWith('/admin/products')}
          >
            Products
          </AdminLink>
          <AdminLink
            to="/admin/orders"
            active={location.pathname.startsWith('/admin/orders')}
          >
            Orders
          </AdminLink>
        </nav>
        <Link
          to="/"
          className="inline-flex text-[11px] text-bakeryBrown/70 hover:text-bakeryBrown"
        >
          ← Back to site
        </Link>
      </aside>
      <section className="space-y-4">
        <Outlet />
      </section>
    </div>
  );
};

const AdminLink = ({ to, active, children }) => (
  <NavLink
    to={to}
    className={`flex items-center justify-between px-3 py-2 rounded-full ${
      active
        ? 'bg-bakeryPrimary/10 text-bakeryBrown font-medium'
        : 'text-bakeryBrown/80 hover:bg-bakeryPink'
    } transition-colors duration-200`}
  >
    <span>{children}</span>
  </NavLink>
);

export const AdminDashboard = () => (
  <div className="card p-5 space-y-3">
    <h1 className="text-xl font-serif text-bakeryBrown">Welcome, Admin</h1>
    <p className="text-sm text-bakeryBrown/70">
      Manage products, track orders, and keep Delicious Bites running smoothly.
    </p>
  </div>
);

export default AdminLayout;

