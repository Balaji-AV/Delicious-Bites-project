import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

const CheckoutPage = () => {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'user') {
      setError('Only user accounts can place orders.');
      return;
    }
    if (items.length === 0) return;
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity
        }))
      };
      await api.post('/orders', payload);
      clearCart();
      navigate('/orders');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-bakeryBrown mb-4">Checkout</h1>
      <section className="card p-4 mb-4 text-xs text-bakeryBrown/80 space-y-1">
        <p className="font-semibold text-sm">Delivery & Order Policy</p>
        <p>Kindly order 1 day before your required date.</p>
        <p>Free delivery within 3 kms inside the city.</p>
        <p>Outside city deliveries via Speed Post / DTDC.</p>
        <p>No maida, no preservatives, no sugar, no gluten. Bulk orders are welcome.</p>
      </section>

      {items.length === 0 ? (
        <p className="text-sm text-bakeryBrown/70">Your cart is empty.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 card p-4 space-y-3">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between gap-3 border-b border-bakeryPink/50 pb-2 last:border-none"
              >
                <div>
                  <p className="text-sm font-medium text-bakeryBrown">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-bakeryBrown/60">
                    ₹{item.product.price.toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="btn-outline px-2 py-1 text-xs"
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span className="text-sm">{item.quantity}</span>
                  <button
                    className="btn-outline px-2 py-1 text-xs"
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                  <button
                    className="text-xs text-red-600 ml-2"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="card p-4 space-y-3">
            <p className="text-sm font-semibold text-bakeryBrown">Summary</p>
            <div className="flex items-center justify-between text-sm">
              <span>Items</span>
              <span>{items.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Total</span>
              <span className="font-semibold">₹{total.toFixed(2)}</span>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              className="btn-primary w-full"
              disabled={submitting || items.length === 0}
              onClick={handleCheckout}
            >
              {submitting ? 'Placing order...' : 'Place order'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default CheckoutPage;

