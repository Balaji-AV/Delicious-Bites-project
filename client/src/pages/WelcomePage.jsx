import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <main className="relative overflow-hidden min-h-screen">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 -z-10">
        <img src="/images/background-placeholder.jpg" alt="pictures" className="w-full h-full object-cover opacity-5" />
      </div>
      
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-20 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-5" data-anim>
          <p className="text-xs uppercase tracking-[0.3em] text-bakeryBrown/65">Home Bakery</p>
          <h1 className="font-display text-4xl md:text-6xl text-bakeryBrown leading-tight">
            DELICIOUS BITES
          </h1>
          <p className="text-lg md:text-xl font-script text-bakeryPrimary">
            baking memories with love
          </p>
          <p className="text-sm md:text-base text-bakeryBrown/80 max-w-lg">
            Freshly baked, crafted in small batches, and delivered with care. Your next
            celebration deserves flavors that feel personal.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/login" className="btn-primary">
              Sign In to Start Orders
            </Link>
            <Link to="/register" className="btn-outline">
              Create Account
            </Link>
            <Link to="/home" className="btn-outline">
              Continue as Guest (Temporary)
            </Link>
          </div>
        </div>

        <div className="relative min-h-[320px] md:min-h-[420px]" data-anim>
          <div className="absolute top-4 left-4 h-40 w-40 rounded-full bg-bakeryPink/90 blur-2xl" />
          <div className="absolute bottom-8 right-4 h-48 w-48 rounded-full bg-bakeryPistachio/70 blur-2xl" />
          <div className="relative z-10 rounded-[2rem] border border-white/70 bg-white/75 backdrop-blur-lg p-6 md:p-8 shadow-xl">
            <div className="grid grid-cols-2 gap-3">
              {['Cupcakes', 'Brownies', 'Cookies', 'Fruit Cakes'].map((item) => (
                <div key={item} className="rounded-2xl bg-gradient-to-br from-white to-bakerySoftPink border border-bakeryPink/50 p-3 text-center text-sm font-medium text-bakeryBrown">
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-bakeryBrown/75">
              No maida. No preservatives. No sugar. No gluten.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WelcomePage;
