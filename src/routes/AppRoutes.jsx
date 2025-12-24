// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Import các trang tính năng User
import HomePage from '../features/product/pages/HomePage';
import ProductDetailPage from '../features/product/pages/ProductDetailPage';
import CartPage from '../features/cart/pages/CartPage';
import CheckoutPage from '../features/cart/pages/CheckoutPage';
import ProductListPage from '../features/product/pages/ProductListPage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import PCBuilderPage from '../features/product/pages/PCBuilderPage';
import ProfilePage from '../features/user/pages/ProfilePage';
import OrderHistoryPage from '../features/order/pages/OrderHistoryPage';
import OrderDetailPage from '../features/order/pages/OrderDetailPage';
import PaymentResultPage from '../features/cart/pages/PaymentResultPage';
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../features/admin/pages/AdminDashboard';
import AdminCategoryPage from '../features/admin/pages/AdminCategoryPage';
import AdminProductPage from '../features/admin/pages/AdminProductPage';
import AdminOrderPage from '../features/admin/pages/AdminOrderPage';
import AdminUserPage from '../features/admin/pages/AdminUserPage';
import AdminCouponPage from '../features/admin/pages/AdminCouponPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* --- USER ROUTES --- */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="payment/result" element={<PaymentResultPage />} />
        {/* Route User */}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="user/orders" element={<OrderHistoryPage />} />
        <Route path="user/orders/:id" element={<OrderDetailPage />} />
        <Route path="build-pc" element={<PCBuilderPage />} />
        <Route path="products" element={<ProductListPage />} />
      </Route>

      {/* --- AUTH ROUTES --- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      {/* --- ADMIN ROUTES --- */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="categories" element={<AdminCategoryPage />} />
        <Route path="products" element={<AdminProductPage />} />
        <Route path="orders" element={<AdminOrderPage />} />
        <Route path="users" element={<AdminUserPage />} />
        <Route path="coupons" element={<AdminCouponPage />} />
      </Route>

    </Routes>
  );
};

export default AppRoutes;