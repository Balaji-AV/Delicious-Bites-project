import React, { useEffect, useState, useCallback } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { subscribeToLiveEvents } from '../lib/liveEvents';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-[80vh] max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-[250px,1fr] gap-4">
      <aside className="card p-4 space-y-3 h-fit sticky top-24 animate-slideInLeft">
        <div className="mb-1">
          <p className="text-xs uppercase tracking-wide text-bakeryBrown/60">Admin Dashboard</p>
          <p className="font-display text-xl text-bakeryBrown">DELICIOUS BITES</p>
        </div>

        <nav className="space-y-1 text-sm">
          <AdminLink to="/admin/dashboard" active={location.pathname === '/admin/dashboard'}>
            📊 Dashboard
          </AdminLink>
          <AdminLink to="/admin/products" active={location.pathname.startsWith('/admin/products') || location.pathname === '/admin/add-product'}>
            🧁 Products
          </AdminLink>
          <AdminLink to="/admin/orders" active={location.pathname.startsWith('/admin/orders')}>
            📦 Orders
          </AdminLink>
          <AdminLink to="/admin/customers" active={location.pathname.startsWith('/admin/customers')}>
            👥 Customers
          </AdminLink>
        </nav>

        <div className="border-t border-bakeryPink pt-3 space-y-1 text-sm">
          <Link to="/home" className="inline-flex text-[11px] text-bakeryBrown/70 hover:text-bakeryBrown">
            ← Back to website
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-full text-bakeryBrown/80 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center gap-2"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
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
      active ? 'bg-bakeryPrimary/10 text-bakeryBrown font-medium' : 'text-bakeryBrown/80 hover:bg-bakeryPink'
    } transition-colors duration-200`}
  >
    <span>{children}</span>
  </NavLink>
);

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    const unsubscribe = subscribeToLiveEvents((event) => {
      if (event.type === 'orders-changed' || event.type === 'products-changed') {
        loadStats();
      }
    });
    return unsubscribe;
  }, [loadStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 animate-fadeIn">
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl animate-bounce">📊</span>
          <p className="text-sm text-bakeryBrown/70">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card p-5 space-y-1 animate-slideUp">
        <h1 className="font-display text-3xl text-bakeryBrown">Welcome, Admin</h1>
        <p className="text-sm text-bakeryBrown/70">
          Real-time overview of orders, revenue, menu items, and customers.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-slideUp delay-150">
        <MetricCard icon="📦" label="Total Orders" value={stats?.totalOrders ?? 0} />
        <MetricCard icon="💰" label="Revenue" value={`₹${(stats?.revenue ?? 0).toFixed(0)}`} />
        <MetricCard icon="🧁" label="Active Items" value={`${stats?.activeItems ?? 0}/${stats?.totalItems ?? 0}`} />
        <MetricCard icon="👥" label="Customers" value={stats?.customers ?? 0} />
      </div>

      {/* Quick Actions */}
      <div className="card p-4 animate-slideUp delay-300">
        <h2 className="text-lg font-semibold text-bakeryBrown mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary text-xs btn-press" onClick={() => navigate('/admin/add-product')}>
            ➕ Add New Product
          </button>
          <button className="btn-outline text-xs btn-press" onClick={() => navigate('/admin/orders')}>
            📦 View All Orders
          </button>
          <button className="btn-outline text-xs btn-press" onClick={() => navigate('/admin/products')}>
            🧁 Manage Menu
          </button>
          <button className="btn-outline text-xs btn-press" onClick={() => navigate('/admin/customers')}>
            👥 View Customers
          </button>
        </div>
      </div>

      {/* Pending Orders Badge */}
      {(stats?.pendingOrders ?? 0) > 0 && (
        <div className="card p-4 border-l-4 border-yellow-400 animate-slideUp delay-350">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="font-semibold text-bakeryBrown">{stats.pendingOrders} Pending Order{stats.pendingOrders > 1 ? 's' : ''}</p>
              <p className="text-xs text-bakeryBrown/65">Waiting to be processed</p>
            </div>
            <button className="ml-auto btn-primary text-xs btn-press" onClick={() => navigate('/admin/orders')}>
              Review Now
            </button>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="card p-4 overflow-x-auto animate-slideUp delay-400">
        <h2 className="text-lg font-semibold text-bakeryBrown mb-3">Recent Orders</h2>
        {!stats?.recentOrders?.length ? (
          <p className="text-sm text-bakeryBrown/70">No orders yet.</p>
        ) : (
          <table className="min-w-full text-left text-xs">
            <thead className="border-b border-bakeryPink/70">
              <tr>
                <th className="py-2 pr-2">Order #</th>
                <th className="py-2 pr-2">Customer</th>
                <th className="py-2 pr-2">Items</th>
                <th className="py-2 pr-2">Total</th>
                <th className="py-2 pr-2">Status</th>
                <th className="py-2 pr-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order, i) => (
                <tr key={order.id} className="border-b border-bakeryPink/40 last:border-none row-animate" style={{ animationDelay: `${i * 50}ms` }}>
                  <td className="py-2 pr-2 font-medium text-bakeryBrown">#{order.id}</td>
                  <td className="py-2 pr-2">{order.user?.name || 'Customer'}</td>
                  <td className="py-2 pr-2">{order.items?.length || 0}</td>
                  <td className="py-2 pr-2">₹{order.totalAmount.toFixed(2)}</td>
                  <td className="py-2 pr-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 pr-2 text-bakeryBrown/60">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value }) => (
  <article className="card card-animated p-4 text-center">
    <span className="text-2xl block mb-1">{icon}</span>
    <p className="text-xs uppercase tracking-wide text-bakeryBrown/60">{label}</p>
    <p className="font-display text-2xl text-bakeryBrown mt-1 animate-counterPop">{value}</p>
  </article>
);

export default AdminLayout;
