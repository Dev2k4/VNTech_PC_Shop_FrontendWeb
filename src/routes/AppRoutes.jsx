import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Import các trang tính năng
import HomePage from '../features/product/pages/HomePage';
import ProductDetailPage from '../features/product/pages/ProductDetailPage';
import CartPage from '../features/cart/pages/CartPage';
import CheckoutPage from '../features/cart/pages/CheckoutPage';

// Import các trang Auth
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';

// Import các trang User & Order (Đảm bảo đường dẫn import đúng với thư mục bạn đã tạo)
import ProfilePage from '../features/user/pages/ProfilePage';
import OrderHistoryPage from '../features/order/pages/OrderHistoryPage';
import OrderDetailPage from '../features/order/pages/OrderDetailPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Group 1: Các trang CÓ Header & Footer (Nằm trong MainLayout) */}
      <Route path="/" element={<MainLayout />}>
        {/* Trang chủ (index) */}
        <Route index element={<HomePage />} />
        
        {/* Sản phẩm */}
        <Route path="products/:id" element={<ProductDetailPage />} />
        
        {/* Giỏ hàng & Thanh toán */}
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        
        {/* --- CÁC ROUTE BẠN ĐANG BỊ THIẾU HOẶC SAI --- */}
        {/* Hồ sơ cá nhân */}
        <Route path="profile" element={<ProfilePage />} />
        
        {/* Lịch sử đơn hàng */}
        <Route path="user/orders" element={<OrderHistoryPage />} />
        <Route path="user/orders/:id" element={<OrderDetailPage />} />
        {/* ------------------------------------------- */}
      </Route>

      {/* Group 2: Các trang KHÔNG CÓ Header (Đứng độc lập) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Route dự phòng: Nếu nhập link linh tinh thì về trang chủ (hoặc trang 404 nếu bạn có) */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
};

export default AppRoutes;