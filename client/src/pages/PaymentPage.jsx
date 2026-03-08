import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CartItem from '../components/CartItem';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const deliveryDetails = location.state?.deliveryDetails || {};
  const deliveryFee = 50;
  const grandTotal = total + deliveryFee;

  const handlePayment = async () => {
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      // Store order details for success page
      const orderData = {
        orderId: `ORD${Date.now()}`,
        items: items,
        total: grandTotal,
        deliveryDetails: deliveryDetails,
        timestamp: new Date().toISOString()
      };

      clearCart();
      navigate('/payment-success', { state: orderData });
    }, 2000);
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 animate-fadeIn">
        <h1 className="text-3xl md:text-4xl font-bold text-[#4A2C2A] font-['Pacifico',cursive] mb-2">
          Complete Payment
        </h1>
        <p className="text-[#4A2C2A]/60 font-['Poppins',sans-serif]">
          Review your order and complete payment
        </p>
      </div>

      <div className="space-y-6">
        {/* Order Summary */}
        <div className="bg-white rounded-3xl border-2 border-[#FFD6DF] p-6 animate-fadeIn">
          <h2 className="text-xl font-bold text-[#4A2C2A] font-['Poppins',sans-serif] mb-4">
            Order Summary
          </h2>
          <div className="space-y-3">
            {items.map(item => (
              <CartItem key={item.product.id} item={item} compact={true} />
            ))}
          </div>
        </div>

        {/* Delivery Details */}
        {deliveryDetails.name && (
          <div className="bg-white rounded-3xl border-2 border-[#FFD6DF] p-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-[#4A2C2A] font-['Poppins',sans-serif] mb-4">
              Delivery Address
            </h2>
            <div className="space-y-2 text-[#4A2C2A]/70 font-['Poppins',sans-serif]">
              <p><span className="font-semibold">Name:</span> {deliveryDetails.name}</p>
              <p><span className="font-semibold">Phone:</span> {deliveryDetails.phone}</p>
              <p><span className="font-semibold">Address:</span> {deliveryDetails.address}</p>
              <p><span className="font-semibold">City:</span> {deliveryDetails.city}</p>
              <p><span className="font-semibold">Pincode:</span> {deliveryDetails.pincode}</p>
            </div>
          </div>
        )}

        {/* Payment Summary */}
        <div className="bg-gradient-to-br from-[#FFF7F9] to-[#FFD6DF]/30 rounded-3xl border-2 border-[#FFD6DF] p-6 animate-fadeIn">
          <h2 className="text-xl font-bold text-[#4A2C2A] font-['Poppins',sans-serif] mb-4">
            Payment Details
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-[#4A2C2A]/70 font-['Poppins',sans-serif]">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#4A2C2A]/70 font-['Poppins',sans-serif]">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="border-t-2 border-[#FFD6DF] pt-3 flex justify-between text-2xl font-bold text-[#4A2C2A] font-['Poppins',sans-serif]">
              <span>Total Amount</span>
              <span className="text-[#F78CA2]">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-3xl border-2 border-[#FFD6DF] p-6 animate-fadeIn">
          <h2 className="text-xl font-bold text-[#4A2C2A] font-['Poppins',sans-serif] mb-4">
            Payment Method
          </h2>
          <div className="bg-gradient-to-r from-[#FFF7F9] to-[#FFD6DF]/30 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-3xl">💳</span>
            <div>
              <p className="font-semibold text-[#4A2C2A] font-['Poppins',sans-serif]">
                Secure Online Payment
              </p>
              <p className="text-sm text-[#4A2C2A]/60 font-['Poppins',sans-serif]">
                {deliveryDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card / UPI / Net Banking'}
              </p>
            </div>
          </div>
        </div>

        {/* Pay Now Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="
            w-full py-5 rounded-2xl font-bold text-lg font-['Poppins',sans-serif]
            bg-gradient-to-r from-[#F78CA2] to-[#FF6B81]
            text-white shadow-xl shadow-[#F78CA2]/30
            hover:shadow-2xl hover:shadow-[#F78CA2]/40 hover:scale-[1.02]
            active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-300
            flex items-center justify-center gap-3
          "
        >
          {loading ? (
            <>
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <span>🔒</span>
              <span>Pay ₹{grandTotal.toFixed(2)} Now</span>
            </>
          )}
        </button>

        {/* Security Notice */}
        <div className="text-center text-xs text-[#4A2C2A]/50 font-['Poppins',sans-serif]">
          <p>🔒 Your payment information is secure and encrypted</p>
        </div>
      </div>
    </main>
  );
};

export default PaymentPage;
