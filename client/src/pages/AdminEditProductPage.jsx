import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import { MENU_CATEGORIES } from '../lib/menuCategories';
import { publishLiveEvent } from '../lib/liveEvents';

const AdminEditProductPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: '',
    category: MENU_CATEGORIES[0],
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
        const response = await api.get(`/products/${id}`);
        const product = response.data;
        setForm({
          name: product.name,
          category: product.category,
          description: product.description || '',
          price: String(product.price),
          availability: product.availability,
          imageUrl: product.imageUrl || ''
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

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      publishLiveEvent('products-changed', { action: 'update', productId: Number(id) });
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-bakeryBrown/70">Loading product...</p>;
  }

  return (
    <main className="card p-5 md:p-6" data-anim>
      <div className="flex items-center justify-between mb-3">
        <h1 className="font-display text-3xl text-bakeryBrown">Edit Product</h1>
        <button type="button" className="btn-outline text-xs" onClick={() => navigate('/admin/products')}>
          Cancel
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Product Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
          <label className="block text-xs text-bakeryBrown/80">
            Category
            <select className="input-field mt-1" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {MENU_CATEGORIES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Price" type="number" value={form.price} onChange={(value) => setForm({ ...form, price: value })} />
          <Field label="Image URL (optional)" value={form.imageUrl} onChange={(value) => setForm({ ...form, imageUrl: value })} required={false} />
        </div>

        <label className="block text-xs text-bakeryBrown/80">
          Description
          <textarea className="input-field mt-1 rounded-2xl min-h-[100px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>

        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.checked })} />
          <span>Available for ordering</span>
        </label>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </main>
  );
};

const Field = ({ label, type = 'text', value, onChange, required = true }) => (
  <label className="block text-xs text-bakeryBrown/80">
    {label}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input-field mt-1"
      required={required}
    />
  </label>
);

export default AdminEditProductPage;
