import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import HomePage from '../features/product/pages/HomePage'; // Import mới

const AppRoutes = () => {
  return (
    <Routes>
     <Route element={<MainLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
</Route>
      {/* Placeholder cho Admin */}
      <Route path="/admin" element={<div>Trang Admin (Sẽ cập nhật sau)</div>} />
      
      {/* 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;