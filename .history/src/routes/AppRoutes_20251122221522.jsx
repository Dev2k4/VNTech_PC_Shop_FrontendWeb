import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../../';
import HomePage from '../features/product/pages/HomePage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Bọc các trang cần Header vào trong MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Các trang không cần Header (ví dụ Admin) để ra ngoài */}
      <Route path="/admin" element={<div>Trang Admin (Chưa làm)</div>} />
      
      {/* Redirect 404 về trang chủ */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;