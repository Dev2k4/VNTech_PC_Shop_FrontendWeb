import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../features/product/pages/HomePage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';

const AppRoutes = () => {
  // --- LOG KIỂM TRA 1 ---
  console.log("1. AppRoutes đang chạy...");
  console.log("   - MainLayout:", MainLayout); // Kiểm tra xem import có bị undefined không
  console.log("   - HomePage:", HomePage);
  // ----------------------

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route path="/admin" element={<div>Admin Page</div>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;