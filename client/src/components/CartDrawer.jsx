import React from 'react';
import { useUI } from '../contexts/UIContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { isCartOpen, closeCart } = useUI();
  const { items, total, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    closeCart();
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div
      className={`fixed inset-0 z-30 pointer-events-none ${
        isCartOpen ? 'pointer-events-auto' : ''
      }`}
    >
      {/* backdrop */}
      <div
        className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeCart}
      />
      {/* drawer */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-bakerySoftPink shadow-xl transform transition-transform duration-300 ease-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="px-4 py-3 border-b border-bakeryPink flex items-center justify-between">
          <h2 className="text-sm font-semibold text-bakeryBrown">Your Cart</h2>
          <button
            type="button"
            onClick={closeCart}
            className="text-xs text-bakeryBrown/70 hover:text-bakeryBrown"
          >
            Close
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {items.length === 0 && (
            <p className="text-xs text-bakeryBrown/70">Your cart is empty.</p>
          )}
          {items.map((item) => (
            <div
              key={item.product.id}
              className="rounded-2xl bg-white border border-bakeryPink/60 px-3 py-2 text-xs flex items-center justify-between gap-3"
            >
              <div>
                <p className="font-medium text-bakeryBrown">{item.product.name}</p>
                <p className="text-[11px] text-bakeryBrown/60">
                  ₹{item.product.price.toFixed(2)} each
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn-outline px-2 py-1 text-[11px]"
                  onClick={() =>
                    updateQuantity(item.product.id, item.quantity - 1)
                  }
                >
                  −
                </button>
                <span className="text-xs">{item.quantity}</span>
                <button
                  type="button"
                  className="btn-outline px-2 py-1 text-[11px]"
                  onClick={() =>
                    updateQuantity(item.product.id, item.quantity + 1)
                  }
                >
                  +
                </button>
                <button
                  type="button"
                  className="text-[11px] text-red-600 ml-1"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <footer className="px-4 py-3 border-t border-bakeryPink bg-white">
          <div className="flex items-center justify-between text-xs mb-2">
            <span>Total</span>
            <span className="font-semibold text-bakeryBrown">
              ₹{total.toFixed(2)}
            </span>
          </div>
          <button
            type="button"
            className="btn-primary w-full"
            disabled={items.length === 0}
            onClick={handleCheckoutClick}
          >
            Go to checkout
          </button>
        </footer>
      </aside>
    </div>
  );
};

export default CartDrawer;

