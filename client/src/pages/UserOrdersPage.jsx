import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserOrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'user') {
      navigate('/');
      return;
    }
    const load = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, navigate]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-bakeryBrown mb-4">My Orders</h1>
      {loading && <p className="text-sm text-bakeryBrown/70">Loading orders...</p>}
      {!loading && orders.length === 0 && (
        <p className="text-sm text-bakeryBrown/70">You have not placed any orders yet.</p>
      )}
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="card p-4 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="font-medium">Order #{order.id}</span>
              <span className="text-xs text-bakeryBrown/70">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-bakeryBrown/70">Status: {order.status}</p>
            <ul className="text-xs list-disc ml-4 mt-1">
              {order.items?.map((item) => (
                <li key={item.id}>
                  Product #{item.productId} · Qty {item.quantity} · ₹
                  {item.price.toFixed(2)}
                </li>
              ))}
            </ul>
            <p className="text-sm font-semibold mt-1">
              Total: ₹{order.totalAmount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default UserOrdersPage;

