import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Placeholder cho trang chủ và admin */}
      <Route path="/" element={<div>Trang chủ (Sẽ cập nhật sau)</div>} />
      <Route path="/admin" element={<div>Trang Admin (Sẽ cập nhật sau)</div>} />
      
      {/* Redirect mặc định */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;