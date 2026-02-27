import React, { useEffect, useState } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const categories = [
  'All',
  'Cupcakes',
  'Chocolates',
  'Cookies',
  'Classic Brownies',
  'Special Brownies',
  'Classic Fruit Cakes',
  'Special Cakes',
  'Blondies',
  'Donuts'
];

const MenuPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load menu.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered =
    category === 'All'
      ? products
      : products.filter((p) => p.category.toLowerCase() === category.toLowerCase());

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <section className="grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-3">
          <p className="text-xs tracking-[0.2em] uppercase text-bakeryBrown/60">
            Home-baked with love
          </p>
          <h1 className="text-3xl md:text-4xl font-serif text-bakeryBrown leading-snug">
            Delicious Bites,
            <br />
            <span className="text-bakeryPrimary">baking memories</span> for your moments.
          </h1>
          <p className="text-sm text-bakeryBrown/70 max-w-md">
            No maida, no preservatives, no refined sugar, no gluten. Just wholesome treats
            crafted in a home kitchen for you and your loved ones.
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {!user && (
              <>
                <Link to="/login" className="btn-primary text-xs">
                  Login
                </Link>
                <Link to="/register" className="btn-outline text-xs">
                  Sign Up
                </Link>
                <Link
                  to="/admin/login"
                  className="text-xs text-bakeryBrown/70 hover:text-bakeryBrown"
                >
                  Admin Login
                </Link>
              </>
            )}
            {user && user.role === 'user' && (
              <Link to="/orders" className="btn-primary text-xs">
                View My Orders
              </Link>
            )}
            {user && user.role === 'admin' && (
              <Link to="/admin/dashboard" className="btn-primary text-xs">
                Go to Dashboard
              </Link>
            )}
          </div>
          <div className="text-[11px] text-bakeryBrown/60 space-y-1 mt-3">
            <p>
              Address: Delicious Bites, KTR Colony, Nizampet, Hyderabad - 500090 · Phone:
              +91-7330909762
            </p>
            <p>
              Delivery: Free within 3km (city). Outside city via Speed Post / DTDC. Kindly
              order 1 day in advance.
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-bakeryPink to-bakerySoftPink rounded-full blur-3xl opacity-60" />
          <div className="relative card p-6 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-bakerySoftPink to-white">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-bakeryPrimary to-[#ff8fab] shadow-lg flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
              <span className="text-white font-serif text-xl">✨</span>
            </div>
            <p className="text-sm font-semibold text-bakeryBrown text-center">
              Small-batch bakes,
              <br />
              made just for you.
            </p>
          </div>
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
              category === c
                ? 'bg-bakeryBrown text-white'
                : 'bg-white border border-bakeryPink text-bakeryBrown'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-bakeryBrown/70">Loading menu...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-bakeryBrown">Our Menu</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default MenuPage;

