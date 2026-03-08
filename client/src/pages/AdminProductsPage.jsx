import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import { publishLiveEvent, subscribeToLiveEvents } from '../lib/liveEvents';

const AdminProductsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    loadProducts();
  }, [user, navigate]);

  useEffect(() => {
    const unsubscribe = subscribeToLiveEvents((event) => {
      if (event.type === 'products-changed') {
        loadProducts();
      }
    });

    return unsubscribe;
  }, []);

  const toggleAvailability = async (product) => {
    try {
      await api.patch(`/products/${product.id}/availability`, {
        availability: !product.availability
      });
      publishLiveEvent('products-changed', { productId: product.id });
      await loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;

    try {
      await api.delete(`/products/${product.id}`);
      publishLiveEvent('products-changed', { productId: product.id });
      await loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="font-display text-3xl text-bakeryBrown">Products</h1>
        <button type="button" className="btn-primary text-xs" onClick={() => navigate('/admin/add-product')}>
          Add New Product
        </button>
      </div>

      <section className="card p-4 overflow-x-auto" data-anim>
        <table className="min-w-full text-left text-xs">
          <thead className="border-b border-bakeryPink/70">
            <tr>
              <th className="py-2 pr-2">Name</th>
              <th className="py-2 pr-2">Category</th>
              <th className="py-2 pr-2">Price</th>
              <th className="py-2 pr-2">Availability</th>
              <th className="py-2 pr-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-bakeryPink/40 last:border-none">
                <td className="py-2 pr-2 text-bakeryBrown font-medium">{product.name}</td>
                <td className="py-2 pr-2">{product.category}</td>
                <td className="py-2 pr-2">₹{product.price.toFixed(2)}</td>
                <td className="py-2 pr-2">
                  <button
                    type="button"
                    className={`px-2 py-1 rounded-full text-[10px] ${product.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    onClick={() => toggleAvailability(product)}
                  >
                    {product.availability ? 'In Stock' : 'Out of Stock'}
                  </button>
                </td>
                <td className="py-2 pr-2 text-right space-x-2">
                  <button type="button" className="text-bakeryBrown underline" onClick={() => navigate(`/admin/edit-product/${product.id}`)}>
                    Edit
                  </button>
                  <button type="button" className="text-red-600 underline" onClick={() => remove(product)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default AdminProductsPage;
