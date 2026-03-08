import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToLiveEvents } from '../lib/liveEvents';

const AdminCustomersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadCustomers = useCallback(async () => {
    try {
      const res = await api.get('/admin/dashboard/customers');
      setCustomers(res.data || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    loadCustomers();
  }, [user, navigate, loadCustomers]);

  useEffect(() => {
    const unsubscribe = subscribeToLiveEvents((event) => {
      if (event.type === 'orders-changed') {
        loadCustomers();
      }
    });
    return unsubscribe;
  }, [loadCustomers]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="space-y-4 page-enter">
      <div className="flex items-center justify-between flex-wrap gap-2 animate-slideUp">
        <h1 className="font-display text-3xl text-bakeryBrown">Customers</h1>
        <span className="text-xs text-bakeryBrown/60">{customers.length} registered users</span>
      </div>

      <div className="animate-slideUp delay-100">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field w-full md:w-72"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 animate-fadeIn">
          <div className="flex flex-col items-center gap-3">
            <span className="text-4xl animate-bounce">👥</span>
            <p className="text-sm text-bakeryBrown/70">Loading customers...</p>
          </div>
        </div>
      ) : (
        <section className="card p-4 overflow-x-auto animate-slideUp delay-150">
          <table className="min-w-full text-left text-xs">
            <thead className="border-b border-bakeryPink/70">
              <tr>
                <th className="py-2 pr-2">ID</th>
                <th className="py-2 pr-2">Name</th>
                <th className="py-2 pr-2">Email</th>
                <th className="py-2 pr-2">Orders</th>
                <th className="py-2 pr-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-bakeryBrown/60">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filtered.map((customer, i) => (
                  <tr
                    key={customer.id}
                    className="border-b border-bakeryPink/40 last:border-none row-animate"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <td className="py-2 pr-2 text-bakeryBrown/60">#{customer.id}</td>
                    <td className="py-2 pr-2 font-medium text-bakeryBrown">{customer.name}</td>
                    <td className="py-2 pr-2">{customer.email}</td>
                    <td className="py-2 pr-2">
                      <span className="px-2 py-0.5 rounded-full bg-bakeryPink text-bakeryBrown text-[10px] font-medium">
                        {customer._count?.orders ?? 0}
                      </span>
                    </td>
                    <td className="py-2 pr-2 text-bakeryBrown/60">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
};

export default AdminCustomersPage;
