import React from 'react';

const Footer = () => (
  <footer className="mt-10 border-t border-bakeryPink/50 bg-white/85 backdrop-blur">
    <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-5 text-[12px] text-bakeryBrown/75">
      <div>
        <p className="font-display text-bakeryBrown text-xl">DELICIOUS BITES</p>
        <p className="font-script text-lg text-bakeryPrimary">Baking memories with love</p>
      </div>
      <div>
        <p>
          Address: Delicious Bites, KTR Colony, Nizampet, Hyderabad - 500090
        </p>
        <p>Phone: +91-7330909762</p>
        <p>Email: deliciousbites.bakery@gmail.com</p>
        <p>Order at least 1 day in advance.</p>
      </div>
      <div className="md:text-right space-y-1">
        <p>No maida · No preservatives · No sugar · No gluten</p>
        <p>Free delivery within 3km · Outside via Speed Post / DTDC</p>
        <p>
          Social: <a className="underline" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a> ·{' '}
          <a className="underline" href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a> ·{' '}
          <a className="underline" href="https://wa.me/917330909762" target="_blank" rel="noreferrer">WhatsApp</a>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

