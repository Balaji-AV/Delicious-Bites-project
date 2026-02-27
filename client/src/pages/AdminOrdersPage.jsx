import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

const AdminOrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    const load = async () => {
      try {
        const res = await api.get('/admin/orders');
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, navigate]);

  const markCompleted = async (orderId) => {
    try {
      const res = await api.patch(`/admin/orders/${orderId}/status`, {
        status: 'Completed'
      });
      const updated = res.data;
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-bakeryBrown mb-4">Admin · Orders</h1>
      {loading && <p className="text-sm text-bakeryBrown/70">Loading orders...</p>}
      <section className="card p-4 overflow-x-auto text-xs">
        <table className="min-w-full text-left">
          <thead className="border-b border-bakeryPink/60">
            <tr>
              <th className="py-2 pr-2">Order ID</th>
              <th className="py-2 pr-2">Customer</th>
              <th className="py-2 pr-2">Total</th>
              <th className="py-2 pr-2">Status</th>
              <th className="py-2 pr-2">Date</th>
              <th className="py-2 pr-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-bakeryPink/40 last:border-none align-top"
              >
                <td className="py-2 pr-2 font-medium">#{order.id}</td>
                <td className="py-2 pr-2 text-bakeryBrown/80">
                  {order.user?.name || 'Customer'} <br />
                  <span className="text-[11px] text-bakeryBrown/60">
                    {order.user?.email}
                  </span>
                </td>
                <td className="py-2 pr-2 font-semibold">
                  ₹{order.totalAmount.toFixed(2)}
                </td>
                <td className="py-2 pr-2">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] ${
                      order.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-2 pr-2 text-bakeryBrown/70">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="py-2 pr-2 text-right space-x-2">
                  {order.status !== 'Completed' && (
                    <button
                      type="button"
                      className="btn-outline px-3 py-1"
                      onClick={() => markCompleted(order.id)}
                    >
                      Mark Completed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default AdminOrdersPage;

