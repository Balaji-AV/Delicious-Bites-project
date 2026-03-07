import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AccountPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:py-12 space-y-6">
      <section className="card p-6 md:p-8" data-anim>
        <p className="text-xs uppercase tracking-[0.25em] text-bakeryBrown/60">Account</p>
        <h1 className="font-display text-3xl text-bakeryBrown mt-2">Welcome, {user.name}</h1>
        <p className="text-sm text-bakeryBrown/75 mt-3">Email: {user.email}</p>
        <p className="text-sm text-bakeryBrown/75">Role: {user.role}</p>
      </section>

      <section className="grid sm:grid-cols-2 gap-4" data-anim>
        <Link to="/orders" className="card p-5 hover:-translate-y-1 transition-transform">
          <h2 className="text-lg font-semibold text-bakeryBrown">My Orders</h2>
          <p className="text-sm text-bakeryBrown/70 mt-1">Track order status and request cancellation.</p>
        </Link>
        <Link to="/checkout" className="card p-5 hover:-translate-y-1 transition-transform">
          <h2 className="text-lg font-semibold text-bakeryBrown">My Cart</h2>
          <p className="text-sm text-bakeryBrown/70 mt-1">Review selected items and proceed to payment.</p>
        </Link>
      </section>
    </main>
  );
};

export default AccountPage;
