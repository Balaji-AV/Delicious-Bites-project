import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  useEffect(() => {
    // If no order data, redirect to home
    if (!orderData) {
      navigate('/home');
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFF7F9] via-[#FFD6DF]/30 to-[#FFF7F9] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 shadow-2xl animate-bounce">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#4A2C2A] font-['Pacifico',cursive] mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-[#4A2C2A]/70 font-['Poppins',sans-serif]">
            Thanks for your order! 🎉
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-3xl border-2 border-[#FFD6DF] p-8 shadow-xl mb-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className="text-center mb-6 pb-6 border-b-2 border-[#FFD6DF]">
            <p className="text-sm text-[#4A2C2A]/60 font-['Poppins',sans-serif] mb-2">Order ID</p>
            <p className="text-2xl font-bold text-[#F78CA2] font-['Poppins',sans-serif]">
              {orderData.orderId}
            </p>
          </div>

          {/* Order Summary */}
          <div className="space-y-4 mb-6">
            <h3 className="font-bold text-[#4A2C2A] font-['Poppins',sans-serif]">Order Summary</h3>
            {orderData.items.map(item => (
              <div key={item.product.id} className="flex justify-between text-[#4A2C2A]/70 font-['Poppins',sans-serif]">
                <span>{item.product.name} × {item.quantity}</span>
                <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t-2 border-[#FFD6DF] pt-4 flex justify-between text-xl font-bold text-[#4A2C2A] font-['Poppins',sans-serif]">
              <span>Total Paid</span>
              <span className="text-[#F78CA2]">₹{orderData.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery Info */}
          {orderData.deliveryDetails?.name && (
            <div className="bg-gradient-to-r from-[#FFF7F9] to-[#FFD6DF]/30 rounded-2xl p-4">
              <h3 className="font-bold text-[#4A2C2A] font-['Poppins',sans-serif] mb-3">Delivery Address</h3>
              <div className="space-y-1 text-sm text-[#4A2C2A]/70 font-['Poppins',sans-serif]">
                <p>{orderData.deliveryDetails.name}</p>
                <p>{orderData.deliveryDetails.phone}</p>
                <p>{orderData.deliveryDetails.address}</p>
                <p>{orderData.deliveryDetails.city}, {orderData.deliveryDetails.pincode}</p>
              </div>
            </div>
          )}
        </div>

        {/* Delivery Status */}
        <div className="bg-gradient-to-r from-[#FFD6DF]/50 to-[#FFF7F9] rounded-3xl p-6 mb-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-start gap-4">
            <span className="text-4xl">🚚</span>
            <div>
              <h3 className="font-bold text-[#4A2C2A] font-['Poppins',sans-serif] mb-2">
                Estimated Delivery
              </h3>
              <p className="text-[#4A2C2A]/70 font-['Poppins',sans-serif]">
                Your order will be delivered within <span className="font-semibold text-[#F78CA2]">2-3 hours</span>
              </p>
              <p className="text-sm text-[#4A2C2A]/60 mt-1 font-['Poppins',sans-serif]">
                We'll notify you once your order is on the way!
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-2 gap-4 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <Link
            to={`/track-order/${orderData.orderId}`}
            className="
              py-4 rounded-2xl font-bold font-['Poppins',sans-serif] text-center
              bg-gradient-to-r from-[#F78CA2] to-[#FF6B81]
              text-white shadow-lg shadow-[#F78CA2]/30
              hover:shadow-xl hover:shadow-[#F78CA2]/40 hover:scale-[1.02]
              transition-all duration-300
              flex items-center justify-center gap-2
            "
          >
            <span>📦</span>
            <span>Track Order</span>
          </Link>

          <Link
            to="/home"
            className="
              py-4 rounded-2xl font-bold font-['Poppins',sans-serif] text-center
              border-2 border-[#F78CA2] text-[#F78CA2]
              hover:bg-[#F78CA2] hover:text-white
              transition-all duration-300
              flex items-center justify-center gap-2
            "
          >
            <span>🏠</span>
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Thank You Message */}
        <div className="text-center mt-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <p className="text-[#4A2C2A]/60 font-['Poppins',sans-serif]">
            Thank you for choosing <span className="font-['Pacifico',cursive] text-[#F78CA2]">Delicious Bites</span>
          </p>
          <p className="text-sm text-[#4A2C2A]/50 mt-2 font-['Poppins',sans-serif]">
            We hope you enjoy your treats! 🧁✨
          </p>
        </div>
      </div>
    </main>
  );
};

export default PaymentSuccessPage;
