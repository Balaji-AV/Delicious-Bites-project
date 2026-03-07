import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import MenuPage from './pages/MenuPage';
import CheckoutPage from './pages/CheckoutPage';
import UserOrdersPage from './pages/UserOrdersPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminAddProductPage from './pages/AdminAddProductPage';
import AdminEditProductPage from './pages/AdminEditProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AccountPage from './pages/AccountPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { UIProvider } from './contexts/UIContext';
import CartDrawer from './components/CartDrawer';
import AdminLayout, { AdminDashboard } from './components/AdminLayout';
import Footer from './components/Footer';
import { connectRealtimeSocket, disconnectRealtimeSocket } from './lib/liveEvents';
import { initializeAnime } from './lib/animeInit';

const AppRoutes = () => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  const hideLayout = ['/', '/login', '/register', '/admin/login'].includes(location.pathname);

  useEffect(() => {
    const cleanup = connectRealtimeSocket(token);
    return () => {
      cleanup();
      disconnectRealtimeSocket();
    };
  }, [token]);

  useEffect(() => {
    initializeAnime();
  }, [location.pathname]);

  if (loading) return null;

  const isAdmin = user?.role === 'admin';

  return (
    <>
      {!hideLayout && <Navbar />}
      {!hideLayout && <CartDrawer />}
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/checkout" element={<UserGuard element={<CheckoutPage />} />} />
        <Route path="/orders" element={<UserGuard element={<UserOrdersPage />} />} />
        <Route
          path="/admin/*"
          element={isAdmin ? <AdminLayout /> : <Navigate to="/admin/login" replace />}
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/add" element={<AdminAddProductPage />} />
          <Route path="products/edit/:id" element={<AdminEditProductPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
};

const UserGuard = ({ element }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'user') return <Navigate to="/home" replace />;
  return element;
};

const App = () => (
  <AuthProvider>
    <CartProvider>
      <UIProvider>
        <AppRoutes />
      </UIProvider>
    </CartProvider>
  </AuthProvider>
);

export default App;

