import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import { createCancellationRequest, getCancellationRequests } from '../lib/localStore';
import { publishLiveEvent, subscribeToLiveEvents } from '../lib/liveEvents';

const UserOrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState(() => getCancellationRequests());

  const loadOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'user') {
      navigate('/home');
      return;
    }

    loadOrders();
  }, [user, navigate]);

  useEffect(() => {
    const unsubscribe = subscribeToLiveEvents((event) => {
      if (event.type === 'orders-changed') {
        loadOrders();
      }
      if (event.type === 'cancellation-changed') {
        setRequests(getCancellationRequests());
      }
    });

    return unsubscribe;
  }, []);

  const requestMap = useMemo(() => new Set(requests.map((item) => item.orderId)), [requests]);

  const handleCancelRequest = (orderId) => {
    if (!user) return;

    createCancellationRequest({
      orderId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email
    });

    setRequests(getCancellationRequests());
    publishLiveEvent('cancellation-changed', { orderId });
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:py-12 space-y-4 page-enter">
      <h1 className="font-display text-3xl text-bakeryBrown animate-slideUp">My Orders</h1>
      {loading && (
        <div className="flex items-center justify-center py-16 animate-fadeIn">
          <div className="flex flex-col items-center gap-3">
            <span className="text-4xl animate-bounce">📦</span>
            <p className="text-sm text-bakeryBrown/70">Loading orders...</p>
          </div>
        </div>
      )}

      {!loading && orders.length === 0 && (
        <p className="card p-4 text-sm text-bakeryBrown/75 animate-scaleIn">You have not placed any orders yet.</p>
      )}

      <div className="space-y-3">
        {orders.map((order, index) => {
          const isRequested = requestMap.has(order.id);
          const canRequestCancel = order.status?.toLowerCase() !== 'completed' && order.status?.toLowerCase() !== 'cancelled';

          return (
            <article key={order.id} className="card p-4 text-sm space-y-2 card-animated row-animate" style={{ animationDelay: `${index * 80}ms` }}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-bakeryBrown">Order #{order.id}</p>
                <p className="text-xs text-bakeryBrown/65">{new Date(order.createdAt).toLocaleString()}</p>
              </div>

              <p className="text-xs text-bakeryBrown/75">Status: {order.status}</p>

              <ul className="text-xs text-bakeryBrown/80 list-disc ml-4">
                {order.items?.map((item) => (
                  <li key={item.id}>
                    Product #{item.productId} · Qty {item.quantity} · ₹{item.price.toFixed(2)}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <p className="font-semibold">Total: ₹{order.totalAmount.toFixed(2)}</p>

                {canRequestCancel && (
                  <button
                    type="button"
                    className="btn-outline px-3 py-1 text-xs"
                    onClick={() => handleCancelRequest(order.id)}
                    disabled={isRequested}
                  >
                    {isRequested ? 'Cancellation Requested' : 'Request Cancellation'}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
};

export default UserOrdersPage;
