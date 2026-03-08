import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import api from '../api';
import ProductGallery from '../components/ProductGallery';
import Toast from '../components/Toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBuyNow = () => {
    if (!product.availability) {
      setToast({ message: 'This product is currently unavailable', type: 'error' });
      return;
    }

    addToCart(product);
    setToast({ message: '✅ Added to cart!', type: 'success' });
    
    setTimeout(() => {
      navigate('/cart');
    }, 800);
  };

  const cartItem = items.find(i => i.product.id === product?.id);
  const inCart = cartItem ? cartItem.quantity : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#F78CA2] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[#4A2C2A]/70 font-['Poppins',sans-serif]">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-[#4A2C2A]/70 font-['Poppins',sans-serif]">{error || 'Product not found'}</p>
          <Link to="/menu" className="btn-primary inline-block">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#4A2C2A]/60 mb-6 font-['Poppins',sans-serif]">
          <Link to="/menu" className="hover:text-[#F78CA2] transition-colors">Menu</Link>
          <span>/</span>
          <span className="text-[#4A2C2A]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT SIDE - Image Gallery */}
          <div className="animate-fadeIn">
            <ProductGallery product={product} />
          </div>

          {/* RIGHT SIDE - Product Details */}
          <div className="space-y-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            {/* Product Name & Category */}
            <div>
              <div className="inline-block px-3 py-1 bg-[#FFD6DF] rounded-full text-xs text-[#4A2C2A] font-['Poppins',sans-serif] mb-3">
                {product.category || 'Bakery Item'}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#4A2C2A] font-['Pacifico',cursive]">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#F78CA2] font-['Poppins',sans-serif]">
                ₹{product.price.toFixed(2)}
              </span>
              {product.availability ? (
                <span className="text-sm text-green-600 font-['Poppins',sans-serif]">✓ In Stock</span>
              ) : (
                <span className="text-sm text-red-600 font-['Poppins',sans-serif]">✗ Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold text-[#4A2C2A] font-['Poppins',sans-serif]">Description</h3>
              <p className="text-[#4A2C2A]/70 leading-relaxed font-['Poppins',sans-serif]">
                {product.description || 'Freshly baked with premium ingredients. Each bite delivers a perfect blend of flavors that will make your taste buds dance with joy.'}
              </p>
            </div>

            {/* Delivery Info */}
            <div className="bg-gradient-to-r from-[#FFF7F9] to-[#FFD6DF]/30 rounded-2xl p-4 border border-[#FFD6DF]">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚚</span>
                <div>
                  <p className="font-semibold text-[#4A2C2A] font-['Poppins',sans-serif]">
                    Earliest Delivery: 2-3 Hours
                  </p>
                  <p className="text-sm text-[#4A2C2A]/60 mt-1 font-['Poppins',sans-serif]">
                    Fresh and delivered to your doorstep
                  </p>
                </div>
              </div>
            </div>

            {/* Cart Status */}
            {inCart > 0 && (
              <div className="bg-[#F78CA2]/10 rounded-2xl p-4 border border-[#F78CA2]/30 animate-fadeIn">
                <p className="text-sm text-[#4A2C2A] font-['Poppins',sans-serif]">
                  🛒 <span className="font-semibold">{inCart} {inCart === 1 ? 'item' : 'items'}</span> already in your cart
                </p>
              </div>
            )}

            {/* Buy Now Button */}
            <div className="flex gap-3">
              <button
                onClick={handleBuyNow}
                disabled={!product.availability}
                className="
                  flex-1 py-4 rounded-2xl font-bold text-lg font-['Poppins',sans-serif]
                  bg-gradient-to-r from-[#F78CA2] to-[#FF6B81]
                  text-white shadow-lg shadow-[#F78CA2]/30
                  hover:shadow-xl hover:shadow-[#F78CA2]/40 hover:scale-[1.02]
                  active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  transition-all duration-300
                  flex items-center justify-center gap-2
                "
              >
                {product.availability ? (
                  <>
                    <span>🛒</span>
                    <span>BUY NOW</span>
                  </>
                ) : (
                  <span>Currently Unavailable</span>
                )}
              </button>

              <Link
                to="/menu"
                className="
                  px-6 py-4 rounded-2xl font-semibold font-['Poppins',sans-serif]
                  border-2 border-[#F78CA2] text-[#F78CA2]
                  hover:bg-[#F78CA2] hover:text-white
                  transition-all duration-300
                  flex items-center justify-center
                "
              >
                Browse More
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white rounded-3xl border-2 border-[#FFD6DF] p-8">
            <h2 className="text-2xl font-bold text-[#4A2C2A] font-['Pacifico',cursive] mb-6">
              Ratings & Reviews
            </h2>

            {/* Star Rating Placeholder */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1 text-3xl">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className="text-gray-300">⭐</span>
                ))}
              </div>
              <span className="text-[#4A2C2A]/60 font-['Poppins',sans-serif]">No ratings yet</span>
            </div>

            {/* Empty Reviews State */}
            <div className="text-center py-12 bg-gradient-to-br from-[#FFF7F9] to-[#FFD6DF]/20 rounded-2xl">
              <span className="text-6xl mb-4 block">📝</span>
              <h3 className="text-xl font-semibold text-[#4A2C2A] mb-2 font-['Poppins',sans-serif]">
                No reviews yet
              </h3>
              <p className="text-[#4A2C2A]/60 font-['Poppins',sans-serif]">
                Reviews will appear after deployment. Be the first to try this delicious treat!
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductDetailPage;
