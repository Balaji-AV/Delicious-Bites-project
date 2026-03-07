import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import {
  getCancellationRequests,
  getFeedbackItems,
  removeCancellationRequest,
  setFeedbackApproval
} from '../lib/localStore';
import { publishLiveEvent, subscribeToLiveEvents } from '../lib/liveEvents';

const AdminOrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelRequests, setCancelRequests] = useState(() => getCancellationRequests());
  const [feedbackItems, setFeedbackItems] = useState(() => getFeedbackItems());

  const loadOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
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
        setCancelRequests(getCancellationRequests());
      }
      if (event.type === 'feedback-changed') {
        setFeedbackItems(getFeedbackItems());
      }
    });

    return unsubscribe;
  }, []);

  const requestMap = useMemo(() => {
    const map = new Map();
    cancelRequests.forEach((item) => {
      map.set(item.orderId, item);
    });
    return map;
  }, [cancelRequests]);

  const updateStatus = async (orderId, status) => {
    try {
      const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
      const updated = response.data;
      setOrders((prev) => prev.map((order) => (order.id === updated.id ? updated : order)));
      publishLiveEvent('orders-changed', { orderId, status });
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveCancellation = async (orderId) => {
    await updateStatus(orderId, 'Cancelled');
    removeCancellationRequest(orderId);
    setCancelRequests(getCancellationRequests());
    publishLiveEvent('cancellation-changed', { orderId, action: 'approved' });
  };

  const handleRejectCancellation = (orderId) => {
    removeCancellationRequest(orderId);
    setCancelRequests(getCancellationRequests());
    publishLiveEvent('cancellation-changed', { orderId, action: 'rejected' });
  };

  const handleFeedbackApproval = (feedbackId, approved) => {
    setFeedbackApproval(feedbackId, approved);
    setFeedbackItems(getFeedbackItems());
    publishLiveEvent('feedback-changed', { feedbackId, approved });
  };

  return (
    <main className="space-y-4">
      <h1 className="font-display text-3xl text-bakeryBrown">Orders & Moderation</h1>
      {loading && <p className="text-sm text-bakeryBrown/70">Loading orders...</p>}

      <section className="card p-4 overflow-x-auto" data-anim>
        <h2 className="text-lg font-semibold text-bakeryBrown mb-3">Customer Orders</h2>
        <table className="min-w-full text-left text-xs">
          <thead className="border-b border-bakeryPink/70">
            <tr>
              <th className="py-2 pr-2">Order</th>
              <th className="py-2 pr-2">Customer</th>
              <th className="py-2 pr-2">Total</th>
              <th className="py-2 pr-2">Status</th>
              <th className="py-2 pr-2">Cancellation</th>
              <th className="py-2 pr-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const request = requestMap.get(order.id);

              return (
                <tr key={order.id} className="border-b border-bakeryPink/40 last:border-none align-top">
                  <td className="py-2 pr-2 font-medium">#{order.id}</td>
                  <td className="py-2 pr-2">
                    {order.user?.name || 'Customer'}
                    <br />
                    <span className="text-[11px] text-bakeryBrown/60">{order.user?.email}</span>
                  </td>
                  <td className="py-2 pr-2">₹{order.totalAmount.toFixed(2)}</td>
                  <td className="py-2 pr-2">{order.status}</td>
                  <td className="py-2 pr-2">
                    {request ? (
                      <div className="space-y-1">
                        <p className="text-[11px] text-orange-700">Requested by customer</p>
                        <p className="text-[11px] text-bakeryBrown/65">{new Date(request.createdAt).toLocaleString()}</p>
                      </div>
                    ) : (
                      <span className="text-[11px] text-bakeryBrown/60">No request</span>
                    )}
                  </td>
                  <td className="py-2 pr-2 text-right space-x-2">
                    {order.status !== 'Completed' && (
                      <button type="button" className="btn-outline px-3 py-1" onClick={() => updateStatus(order.id, 'Completed')}>
                        Complete
                      </button>
                    )}
                    {request && (
                      <>
                        <button type="button" className="btn-primary px-3 py-1" onClick={() => handleApproveCancellation(order.id)}>
                          Approve Cancel
                        </button>
                        <button type="button" className="text-red-600 underline" onClick={() => handleRejectCancellation(order.id)}>
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="card p-4" data-anim>
        <h2 className="text-lg font-semibold text-bakeryBrown">Customer Feedback Moderation</h2>
        <div className="mt-3 space-y-2">
          {feedbackItems.length === 0 && <p className="text-sm text-bakeryBrown/70">No feedback yet.</p>}
          {feedbackItems.map((item) => (
            <article key={item.id} className="rounded-2xl border border-bakeryPink/60 p-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-bakeryBrown">{item.name} · {item.rating}/5</p>
                <p className="text-bakeryBrown/60">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
              <p className="mt-2 text-bakeryBrown/80">{item.message}</p>
              <div className="mt-3 flex items-center gap-2">
                <button type="button" className="btn-primary px-3 py-1 text-xs" onClick={() => handleFeedbackApproval(item.id, true)}>
                  Approve
                </button>
                <button type="button" className="btn-outline px-3 py-1 text-xs" onClick={() => handleFeedbackApproval(item.id, false)}>
                  Hide
                </button>
                <span className="text-[11px] text-bakeryBrown/65">Current: {item.approved ? 'Visible' : 'Hidden'}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AdminOrdersPage;
