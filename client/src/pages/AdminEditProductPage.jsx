import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

const AdminEditProductPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    availability: true,
    imageUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    const load = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const p = res.data;
        setForm({
          name: p.name,
          category: p.category,
          description: p.description || '',
          price: String(p.price),
          availability: p.availability,
          imageUrl: p.imageUrl || ''
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, navigate, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.put(`/products/${id}`, {
        name: form.name,
        category: form.category,
        description: form.description,
        price: Number(form.price),
        availability: form.availability,
        imageUrl: form.imageUrl || null
      });
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-sm text-bakeryBrown/70">Loading product...</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-bakeryBrown">Edit Product</h1>
        <button
          type="button"
          className="btn-outline text-xs"
          onClick={() => navigate('/admin/products')}
        >
          Cancel
        </button>
      </div>
      <section className="card p-6 space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
            />
            <Input
              label="Category"
              value={form.category}
              onChange={(v) => setForm({ ...form, category: v })}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              value={form.price}
              onChange={(v) => setForm({ ...form, price: v })}
            />
            <Input
              label="Image URL (optional)"
              value={form.imageUrl}
              onChange={(v) => setForm({ ...form, imageUrl: v })}
            />
          </div>
          <div>
            <label className="block text-xs text-bakeryBrown/80 space-y-1">
              <span>Description (optional)</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-2xl border border-bakeryPink px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bakeryPeach bg-white min-h-[80px]"
              />
            </label>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-bakeryBrown/80">
              <input
                type="checkbox"
                checked={form.availability}
                onChange={(e) =>
                  setForm({ ...form, availability: e.target.checked })
                }
              />
              <span>Available for ordering</span>
            </label>
            <button type="submit" className="btn-primary px-6" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </form>
      </section>
    </main>
  );
};

const Input = ({ label, type = 'text', value, onChange }) => (
  <label className="block text-xs text-bakeryBrown/80 space-y-1">
    <span>{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-full border border-bakeryPink px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bakeryPeach bg-white"
    />
  </label>
);

export default AdminEditProductPage;

