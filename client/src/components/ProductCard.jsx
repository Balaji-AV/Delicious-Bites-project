import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { items, addToCart, updateQuantity } = useCart();
  const [bump, setBump] = useState(false);

  const disabled = !product.availability;
  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  useEffect(() => {
    if (quantity > 0) {
      setBump(true);
      const timer = setTimeout(() => setBump(false), 200);
      return () => clearTimeout(timer);
    }
  }, [quantity]);

  const handleAdd = () => {
    if (disabled) return;
    addToCart(product);
  };

  const handleChangeQuantity = (next) => {
    updateQuantity(product.id, next);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="card p-4 flex flex-col gap-3 bg-gradient-to-br from-[#fde2e4] via-white to-[#fff0f3] hover:shadow-md cursor-pointer transition-transform hover:scale-[1.02]">
      {/* Product Image */}
      <div 
        onClick={handleCardClick}
        className="w-full h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFD6DF] to-[#FFF7F9] flex items-center justify-center"
      >
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt="pictures" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center space-y-2">
            <div className="text-5xl">🧁</div>
            <p className="text-xs text-[#4A2C2A]/40 font-['Poppins',sans-serif]">Image coming soon</p>
          </div>
        )}
      </div>
      
      <div onClick={handleCardClick} className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-bakeryBrown">{product.name}</h3>
          <p className="text-xs text-bakeryBrown/70 mt-1">
            {product.description || 'Freshly baked with love.'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-sm font-semibold text-bakeryBrown">
            ₹{product.price.toFixed(2)}
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full ${
              product.availability
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {product.availability ? 'In Stock' : 'Out of Stock'}
          </span>
          {quantity > 0 && (
            <span
              className={`mt-1 inline-flex items-center justify-center rounded-full bg-bakeryBrown text-white text-[10px] px-1.5 py-0.5 ${
                bump ? 'scale-110' : ''
              } transition-transform duration-200`}
            >
              {quantity} in cart
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end mt-1" onClick={(e) => e.stopPropagation()}>
        {disabled ? (
          <button
            className="btn-outline text-xs opacity-60 cursor-not-allowed"
            disabled
          >
            Unavailable
          </button>
        ) : quantity === 0 ? (
          <button
            className="btn-primary text-xs"
            onClick={handleAdd}
          >
            Add to cart
          </button>
        ) : (
          <div
            className={`inline-flex items-center rounded-full bg-white border border-bakeryPink shadow-sm overflow-hidden ${
              bump ? 'scale-105' : ''
            } transition-transform duration-200`}
          >
            <button
              className="px-3 py-1 text-xs text-bakeryBrown hover:bg-bakeryPink/40 transition-colors"
              onClick={() => handleChangeQuantity(quantity - 1)}
            >
              −
            </button>
            <span className="px-3 py-1 text-xs font-medium text-bakeryBrown">
              {quantity}
            </span>
            <button
              className="px-3 py-1 text-xs text-bakeryBrown hover:bg-bakeryPink/40 transition-colors"
              onClick={() => handleChangeQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;


