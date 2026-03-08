import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const orderStatuses = [
  { id: 1, label: 'Order Placed', icon: '✓', description: 'Order confirmed and payment received' },
  { id: 2, label: 'Preparing Cake', icon: '🧁', description: 'Your delicious treat is being prepared' },
  { id: 3, label: 'Out for Delivery', icon: '🚚', description: 'On the way to your doorstep' },
  { id: 4, label: 'Delivered', icon: '🎉', description: 'Order successfully delivered' }
];

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const [currentStatus, setCurrentStatus] = useState(2); // Default to "Preparing Cake"
  const orderData = location.state;

  // Simulate status progression
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatus(prev => (prev < 4 ? prev + 1 : prev));
    }, 5000); // Progress every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-12 animate-fadeIn">
        <h1 className="text-3xl md:text-4xl font-bold text-[#4A2C2A] font-['Pacifico',cursive] mb-4">
          Track Your Order
        </h1>
        <div className="inline-block bg-gradient-to-r from-[#FFD6DF] to-[#FFF7F9] rounded-2xl px-6 py-3 border-2 border-[#FFD6DF]">
          <p className="text-sm text-[#4A2C2A]/60 font-['Poppins',sans-serif]">Order ID</p>
          <p className="text-xl font-bold text-[#F78CA2] font-['Poppins',sans-serif]">{orderId}</p>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-3xl border-2 border-[#FFD6DF] p-8 mb-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-[#FFD6DF]" />

          {/* Status Steps */}
          <div className="space-y-8">
            {orderStatuses.map((status, index) => {
              const isCompleted = status.id <= currentStatus;
              const isCurrent = status.id === currentStatus;

              return (
                <div key={status.id} className="relative flex items-start gap-6">
                  {/* Status Icon */}
                  <div className={`
                    relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                    transition-all duration-500 shadow-lg
                    ${isCompleted 
                      ? 'bg-gradient-to-br from-[#F78CA2] to-[#FF6B81] text-white scale-110' 
                      : 'bg-white border-2 border-[#FFD6DF] text-[#4A2C2A]/40'
                    }
                    ${isCurrent ? 'animate-pulse' : ''}
                  `}>
                    <span className="text-2xl">{status.icon}</span>
                  </div>

                  {/* Status Content */}
                  <div className={`
                    flex-1 pb-2 transition-all duration-500
                    ${isCompleted ? 'opacity-100' : 'opacity-50'}
                  `}>
                    <h3 className={`
                      font-bold text-lg font-['Poppins',sans-serif] mb-1
                      ${isCompleted ? 'text-[#4A2C2A]' : 'text-[#4A2C2A]/50'}
                      ${isCurrent ? 'text-[#F78CA2]' : ''}
                    `}>
                      {status.label}
                    </h3>
                    <p className={`
                      text-sm font-['Poppins',sans-serif]
                      ${isCompleted ? 'text-[#4A2C2A]/70' : 'text-[#4A2C2A]/40'}
                    `}>
                      {status.description}
                    </p>
                    
                    {isCurrent && (
                      <div className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-[#F78CA2]/10 to-[#FF6B81]/10 rounded-full px-4 py-2 border border-[#F78CA2]/30">
                        <div className="w-2 h-2 bg-[#F78CA2] rounded-full animate-pulse" />
                        <span className="text-xs font-semibold text-[#F78CA2] font-['Poppins',sans-serif]">
                          In Progress
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Completion Checkmark */}
                  {isCompleted && status.id < currentStatus && (
                    <div className="flex-shrink-0 text-green-500 text-xl animate-fadeIn">
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Details */}
      {orderData && (
        <div className="bg-white rounded-3xl border-2 border-[#FFD6DF] p-8 mb-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold text-[#4A2C2A] font-['Pacifico',cursive] mb-6">
            Order Details
          </h2>

          {/* Ordered Items */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-[#4A2C2A] font-['Poppins',sans-serif]">Items Ordered</h3>
            {orderData.items.map(item => (
              <div key={item.product.id} className="flex items-center gap-4 py-3 border-b border-[#FFD6DF]">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#FFD6DF] to-[#FFF7F9]">
                  <img 
                    src={item.product.imageUrl || '/images/product-placeholder.jpg'} 
                    alt="pictures" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#4A2C2A] font-['Poppins',sans-serif]">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-[#4A2C2A]/60 font-['Poppins',sans-serif]">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#4A2C2A] font-['Poppins',sans-serif]">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex justify-between text-xl font-bold text-[#4A2C2A] font-['Poppins',sans-serif] pt-4">
              <span>Total Price</span>
              <span className="text-[#F78CA2]">₹{orderData.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery Address */}
          {orderData.deliveryDetails && (
            <div className="bg-gradient-to-r from-[#FFF7F9] to-[#FFD6DF]/30 rounded-2xl p-4">
              <h3 className="font-semibold text-[#4A2C2A] font-['Poppins',sans-serif] mb-3">
                Delivery Address
              </h3>
              <div className="space-y-1 text-sm text-[#4A2C2A]/70 font-['Poppins',sans-serif]">
                <p className="font-semibold text-[#4A2C2A]">{orderData.deliveryDetails.name}</p>
                <p>{orderData.deliveryDetails.phone}</p>
                <p>{orderData.deliveryDetails.address}</p>
                <p>{orderData.deliveryDetails.city}, {orderData.deliveryDetails.pincode}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Estimated Delivery */}
      <div className="bg-gradient-to-r from-[#FFD6DF]/50 to-[#FFF7F9] rounded-3xl p-6 mb-8 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-4">
          <span className="text-4xl">⏰</span>
          <div>
            <h3 className="font-bold text-[#4A2C2A] font-['Poppins',sans-serif] mb-1">
              Estimated Delivery Time
            </h3>
            <p className="text-[#4A2C2A]/70 font-['Poppins',sans-serif]">
              {currentStatus === 4 ? (
                <span className="text-green-600 font-semibold">✓ Delivered Successfully!</span>
              ) : currentStatus === 3 ? (
                <span className="text-[#F78CA2] font-semibold">Arriving in 15-30 minutes</span>
              ) : (
                <span className="text-[#F78CA2] font-semibold">Arriving in 2-3 hours</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
        <Link
          to="/orders"
          className="
            flex-1 py-4 rounded-2xl font-semibold font-['Poppins',sans-serif] text-center
            border-2 border-[#F78CA2] text-[#F78CA2]
            hover:bg-[#F78CA2] hover:text-white
            transition-all duration-300
          "
        >
          View All Orders
        </Link>
        <Link
          to="/home"
          className="
            flex-1 py-4 rounded-2xl font-semibold font-['Poppins',sans-serif] text-center
            bg-gradient-to-r from-[#F78CA2] to-[#FF6B81]
            text-white shadow-lg shadow-[#F78CA2]/30
            hover:shadow-xl hover:shadow-[#F78CA2]/40 hover:scale-[1.02]
            transition-all duration-300
          "
        >
          Back to Home
        </Link>
      </div>

      {/* Help Section */}
      <div className="text-center mt-8 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
        <p className="text-sm text-[#4A2C2A]/60 font-['Poppins',sans-serif]">
          Need help? Contact us at <a href="tel:+911234567890" className="text-[#F78CA2] hover:underline">+91 123 456 7890</a>
        </p>
      </div>
    </main>
  );
};

export default TrackOrderPage;
