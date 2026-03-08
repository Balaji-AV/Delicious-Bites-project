import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getCancellationRequests, getFeedbackItems } from '../lib/localStore';
import { subscribeToLiveEvents } from '../lib/liveEvents';
import { useAuth } from '../contexts/AuthContext';

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
      <aside className="card p-4 space-y-3 h-fit sticky top-24">
        <div className="mb-1">
          <p className="text-xs uppercase tracking-wide text-bakeryBrown/60">Admin Dashboard</p>
          <p className="font-display text-xl text-bakeryBrown">DELICIOUS BITES</p>
        </div>

        <nav className="space-y-1 text-sm">
          <AdminLink to="/admin/dashboard" active={location.pathname === '/admin/dashboard'}>
            📊 Dashboard
          </AdminLink>
          <AdminLink to="/admin/products" active={location.pathname.startsWith('/admin/products')}>
            🧁 Products
          </AdminLink>
          <AdminLink to="/admin/orders" active={location.pathname.startsWith('/admin/orders')}>
            📦 Orders
          </AdminLink>
          <AdminLink to="/admin/add-product" active={location.pathname === '/admin/add-product'}>
            ➕ Add Product
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
  const [feedbackItems, setFeedbackItems] = useState(() => getFeedbackItems());
  const [cancelRequests, setCancelRequests] = useState(() => getCancellationRequests());

  useEffect(() => {
    const unsubscribe = subscribeToLiveEvents((event) => {
      if (event.type === 'feedback-changed') {
        setFeedbackItems(getFeedbackItems());
      }
      if (event.type === 'cancellation-changed') {
        setCancelRequests(getCancellationRequests());
      }
    });

    return unsubscribe;
  }, []);

  const pendingFeedback = feedbackItems.filter((item) => !item.approved);

  return (
    <div className="space-y-4">
      <div className="card p-5 space-y-2" data-anim>
        <h1 className="font-display text-3xl text-bakeryBrown">Welcome, Admin</h1>
        <p className="text-sm text-bakeryBrown/70">
          Monitor orders, customers, feedback approval, and cancellation requests in real time.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3" data-anim>
        <MetricCard label="Pending Feedback" value={pendingFeedback.length} />
        <MetricCard label="Approved Feedback" value={feedbackItems.length - pendingFeedback.length} />
        <MetricCard label="Cancel Requests" value={cancelRequests.length} />
      </div>

      <div className="card p-4" data-anim>
        <h2 className="text-lg font-semibold text-bakeryBrown">Recent Cancellation Requests</h2>
        {cancelRequests.length === 0 ? (
          <p className="text-sm text-bakeryBrown/70 mt-2">No cancellation requests.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {cancelRequests.slice(0, 5).map((item) => (
              <article key={item.id} className="rounded-2xl border border-bakeryPink/60 p-3 text-xs">
                <p className="font-medium text-bakeryBrown">Order #{item.orderId}</p>
                <p className="text-bakeryBrown/70">{item.userName} · {item.userEmail}</p>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="card p-4" data-anim>
        <h2 className="text-lg font-semibold text-bakeryBrown">Feedback Waiting For Approval</h2>
        {pendingFeedback.length === 0 ? (
          <p className="text-sm text-bakeryBrown/70 mt-2">No pending feedback.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {pendingFeedback.slice(0, 5).map((item) => (
              <article key={item.id} className="rounded-2xl border border-bakeryPink/60 p-3 text-xs">
                <p className="font-medium text-bakeryBrown">{item.name} · {item.rating}/5</p>
                <p className="text-bakeryBrown/75 mt-1">{item.message}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MetricCard = ({ label, value }) => (
  <article className="card p-4 text-center">
    <p className="text-xs uppercase tracking-wide text-bakeryBrown/60">{label}</p>
    <p className="font-display text-3xl text-bakeryBrown mt-1">{value}</p>
  </article>
);

export default AdminLayout;
