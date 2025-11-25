import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- CHÚ Ý DÒNG NÀY ---
import MainLayout from '../layouts/MainLayout'; 
// ---------------------

import HomePage from '../features/product/pages/HomePage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';

const AppRoutes = () => {
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