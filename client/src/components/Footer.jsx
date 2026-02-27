import React from 'react';

const Footer = () => (
  <footer className="mt-8 border-t border-bakeryPink/50 bg-white">
    <div className="max-w-6xl mx-auto px-4 py-4 grid md:grid-cols-3 gap-4 text-[11px] text-bakeryBrown/70">
      <div>
        <p className="font-semibold text-bakeryBrown text-sm">Delicious Bites</p>
        <p>Baking memories with love.</p>
      </div>
      <div>
        <p>
          Address: Delicious Bites, KTR Colony, Nizampet, Hyderabad - 500090
        </p>
        <p>Phone: +91-7330909762</p>
        <p>Order at least 1 day in advance.</p>
      </div>
      <div className="md:text-right space-y-1">
        <p>No maida · No preservatives · No sugar · No gluten</p>
        <p>Free delivery within 3km · Outside via Speed Post / DTDC</p>
      </div>
    </div>
  </footer>
);

export default Footer;

