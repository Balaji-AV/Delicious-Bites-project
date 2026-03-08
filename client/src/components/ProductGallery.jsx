import React, { useState } from 'react';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('/uploads/')) return `${API_BASE}${url}`;
  return url;
};

const ProductGallery = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Create array of image placeholders
  const images = [
    resolveImageUrl(product.imageUrl) || '/images/product-placeholder.jpg',
    '/images/product-placeholder.jpg',
    '/images/product-placeholder.jpg',
    '/images/product-placeholder.jpg'
  ];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="w-full aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFD6DF] to-[#FFF7F9] shadow-lg">
        <img 
          src={images[selectedImage]} 
          alt="pictures" 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`
              aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300
              ${selectedImage === index 
                ? 'border-[#F78CA2] shadow-md scale-105' 
                : 'border-[#FFD6DF] hover:border-[#F78CA2] opacity-70 hover:opacity-100'
              }
            `}
          >
            <img 
              src={img} 
              alt="pictures" 
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
