import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

const CheckoutPage = () => {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const placeOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity
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

  const handlePayNow = async () => {
    if (paymentMethod === 'razorpay') {
      setError('Razorpay UI selected. Connect payment order API and checkout script next.');
      return;
    }

    await placeOrder();
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:py-12 space-y-5">
      <section className="card p-6" data-anim>
        <h1 className="font-display text-3xl text-bakeryBrown">Cart & Payment</h1>
        <p className="text-sm text-bakeryBrown/75 mt-2">
          Verify your items, update quantities, and choose your payment mode.
        </p>
      </section>

      {items.length === 0 ? (
        <section className="card p-6 text-sm text-bakeryBrown/75">No items in your cart.</section>
      ) : (
        <div className="grid lg:grid-cols-[1.4fr,1fr] gap-4">
          <section className="card p-4 md:p-5 space-y-3" data-anim>
            <h2 className="text-lg font-semibold text-bakeryBrown">Selected Items</h2>
            {items.map((item) => (
              <article
                key={item.product.id}
                className="rounded-2xl border border-bakeryPink/60 p-3 flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <p className="font-medium text-bakeryBrown">{item.product.name}</p>
                  <p className="text-xs text-bakeryBrown/65">₹{item.product.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="btn-outline px-2 py-1" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                    -
                  </button>
                  <span className="text-sm w-6 text-center">{item.quantity}</span>
                  <button type="button" className="btn-outline px-2 py-1" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                    +
                  </button>
                  <button type="button" className="text-xs text-red-600" onClick={() => removeFromCart(item.product.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </section>

          <aside className="card p-4 md:p-5 space-y-4" data-anim>
            <h2 className="text-lg font-semibold text-bakeryBrown">Payment</h2>

            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Razorpay</span>
              </label>
            </div>

            <div className="rounded-2xl border border-bakeryPink/60 p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{items.length}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button type="button" className="btn-primary w-full" onClick={handlePayNow} disabled={submitting}>
              {submitting ? 'Processing...' : 'Pay Now'}
            </button>
          </aside>
        </div>
      )}
    </main>
  );
};

export default CheckoutPage;
