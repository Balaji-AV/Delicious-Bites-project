import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

const AdminProductsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    load();
  }, [user, navigate]);

  const load = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAvailability = async (product) => {
    try {
      await api.patch(`/products/${product.id}/availability`, {
        availability: !product.availability
      });
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    try {
      await api.delete(`/products/${product.id}`);
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-bakeryBrown">Admin · Products</h1>
        <button
          type="button"
          className="btn-primary text-xs"
          onClick={() => navigate('/admin/products/add')}
        >
          + Add Product
        </button>
      </div>

      <section className="card p-4">
        <h2 className="text-sm font-semibold text-bakeryBrown mb-2">All products</h2>
        <div className="overflow-x-auto text-xs">
          <table className="min-w-full text-left">
            <thead className="border-b border-bakeryPink/60">
              <tr>
                <th className="py-2 pr-2">Name</th>
                <th className="py-2 pr-2">Category</th>
                <th className="py-2 pr-2">Price</th>
                <th className="py-2 pr-2">Availability</th>
                <th className="py-2 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-bakeryPink/40 last:border-none">
                  <td className="py-2 pr-2">{p.name}</td>
                  <td className="py-2 pr-2">{p.category}</td>
                  <td className="py-2 pr-2">₹{p.price.toFixed(2)}</td>
                  <td className="py-2 pr-2">
                    <button
                      type="button"
                      onClick={() => toggleAvailability(p)}
                      className={`px-2 py-1 rounded-full ${
                        p.availability
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {p.availability ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>
                  <td className="py-2 pr-2 text-right space-x-2">
                    <button
                      type="button"
                      className="text-bakeryBrown hover:underline"
                      onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-red-600 hover:underline"
                      onClick={() => remove(p)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default AdminProductsPage;

