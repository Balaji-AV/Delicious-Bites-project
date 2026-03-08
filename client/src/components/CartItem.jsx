import React from 'react';
import { useCart } from '../contexts/CartContext';

const CartItem = ({ item, compact = false }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrease = () => {
    updateQuantity(item.product.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.product.id);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 py-2">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#FFD6DF] to-[#FFF7F9] flex-shrink-0">
          <img 
            src={item.product.imageUrl || '/images/product-placeholder.jpg'} 
            alt="pictures" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[#4A2C2A] truncate">{item.product.name}</p>
          <p className="text-xs text-[#4A2C2A]/60">Qty: {item.quantity}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-[#4A2C2A]">₹{(item.product.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-[#FFD6DF] p-4 hover:border-[#F78CA2] transition-colors duration-300">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-gradient-to-br from-[#FFD6DF] to-[#FFF7F9] flex-shrink-0 shadow-md">
          <img 
            src={item.product.imageUrl || '/images/product-placeholder.jpg'} 
            alt="pictures" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-[#4A2C2A] font-['Poppins',sans-serif]">
              {item.product.name}
            </h3>
            <p className="text-sm text-[#4A2C2A]/60 mt-1 font-['Poppins',sans-serif]">
              {item.product.description || 'Freshly baked with premium ingredients.'}
            </p>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#4A2C2A]/60 font-['Poppins',sans-serif]">Quantity:</span>
              <div className="flex items-center bg-[#FFF7F9] rounded-full border-2 border-[#FFD6DF] overflow-hidden">
                <button
                  onClick={handleDecrease}
                  className="w-9 h-9 flex items-center justify-center text-[#4A2C2A] hover:bg-[#FFD6DF] transition-colors font-semibold"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold text-[#4A2C2A]">
                  {item.quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="w-9 h-9 flex items-center justify-center text-[#4A2C2A] hover:bg-[#FFD6DF] transition-colors font-semibold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-xs text-[#4A2C2A]/60 font-['Poppins',sans-serif]">
                ₹{item.product.price.toFixed(2)} each
              </p>
              <p className="text-xl font-bold text-[#F78CA2] font-['Poppins',sans-serif]">
                ₹{(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="text-sm text-red-500 hover:text-red-700 font-['Poppins',sans-serif] flex items-center gap-1 transition-colors"
          >
            <span>🗑️</span>
            <span>Remove from cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
