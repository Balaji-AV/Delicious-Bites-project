import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import { subscribeToLiveEvents } from '../lib/liveEvents';
import { MENU_CATEGORIES } from '../lib/menuCategories';

const categories = ['All', ...MENU_CATEGORIES];

const normalize = (value) => (value || '').toLowerCase().replace(/\s+/g, ' ').trim();

const MenuPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');

  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load menu. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToLiveEvents((event) => {
      if (event.type === 'products-changed') {
        loadProducts();
      }
    });

    return unsubscribe;
  }, []);

  const filteredProducts = useMemo(() => {
    if (category === 'All') return products;
    return products.filter((product) => normalize(product.category) === normalize(category));
  }, [products, category]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-12 space-y-7 page-enter">
      <section className="card p-6 md:p-8 animate-slideUp">
        <p className="text-xs uppercase tracking-[0.25em] text-bakeryBrown/60">Menu</p>
        <h1 className="font-display text-4xl text-bakeryBrown mt-2">Browse All Bakery Items</h1>
        <p className="text-sm text-bakeryBrown/75 mt-2">
          Select a category to view available items. Cart updates instantly without page reload.
        </p>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-2 animate-slideUp delay-150">
        {categories.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => setCategory(item)}
            className={`px-3 py-2 rounded-full text-xs whitespace-nowrap border transition-all duration-300 btn-press ${
              category === item
                ? 'bg-bakeryBrown text-white border-bakeryBrown shadow-md pill-active'
                : 'bg-white border-bakeryPink text-bakeryBrown hover:bg-bakerySoftPink hover:shadow-sm'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 animate-fadeIn">
          <div className="flex flex-col items-center gap-3">
            <span className="text-4xl animate-bounce">🧁</span>
            <p className="text-sm text-bakeryBrown/70">Loading menu items...</p>
          </div>
        </div>
      )}
      {error && <p className="text-sm text-red-600 animate-shake">{error}</p>}

      {!loading && !error && (
        <section className="space-y-3 animate-slideUp delay-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-bakeryBrown">{category} Items</h2>
            <span className="text-xs text-bakeryBrown/60">{filteredProducts.length} products</span>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="card p-8 text-center animate-scaleIn">
              <span className="text-4xl block mb-3">🔍</span>
              <p className="text-sm text-bakeryBrown/70">No items found in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product, index) => (
                <div key={product.id} className="animate-scaleIn" style={{ animationDelay: `${Math.min(index * 80, 600)}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default MenuPage;
