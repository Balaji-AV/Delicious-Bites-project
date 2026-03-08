import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import { MENU_CATEGORIES } from '../lib/menuCategories';
import { publishLiveEvent } from '../lib/liveEvents';

const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

const AdminEditProductPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    category: MENU_CATEGORIES[0],
    description: '',
    price: '',
    availability: true,
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
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
        if (product.imageUrl) {
          setImagePreview(
            product.imageUrl.startsWith('/uploads/')
              ? `${BASE_URL}${product.imageUrl}`
              : product.imageUrl
          );
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, navigate, id]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setForm({ ...form, imageUrl: '' });
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    setForm({ ...form, imageUrl: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadImage = async () => {
    if (!imageFile) return form.imageUrl || null;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const res = await api.post('/admin/dashboard/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.imageUrl;
    } catch (err) {
      throw new Error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const imageUrl = await uploadImage();
      await api.put(`/products/${id}`, {
        name: form.name,
        category: form.category,
        description: form.description,
        price: Number(form.price),
        availability: form.availability,
        imageUrl
      });
      publishLiveEvent('products-changed', { action: 'update', productId: Number(id) });
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-bakeryBrown/70">Loading product...</p>;
  }

  return (
    <main className="card p-5 md:p-6 page-enter animate-slideUp">
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

        <Field label="Price" type="number" value={form.price} onChange={(value) => setForm({ ...form, price: value })} />

        {/* Image Upload */}
        <div className="space-y-2">
          <p className="text-xs text-bakeryBrown/80 font-medium">Product Image</p>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageSelect}
                className="block w-full text-xs text-bakeryBrown/70 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-bakeryPink file:text-bakeryBrown hover:file:bg-bakeryPrimary/20 file:transition-colors file:cursor-pointer"
              />
              <p className="text-[10px] text-bakeryBrown/50 mt-1">JPEG, PNG, WebP, GIF — Max 5MB</p>
              {!imageFile && (
                <div className="mt-2">
                  <Field label="Or enter Image URL" value={form.imageUrl} onChange={(value) => setForm({ ...form, imageUrl: value })} required={false} />
                </div>
              )}
            </div>
            {imagePreview && (
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-bakeryPink/60 flex-shrink-0">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
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

        <button type="submit" className="btn-primary" disabled={submitting || uploading}>
          {uploading ? 'Uploading image...' : submitting ? 'Saving...' : 'Save Changes'}
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
