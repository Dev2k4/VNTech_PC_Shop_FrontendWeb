// src/App.jsx
import React from 'react';
// Không cần import BrowserRouter, ChakraProvider, CartProvider, theme nữa
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <>
       {/* Chỉ hiển thị Routes và Toast, các Provider đã được main.jsx xử lý */}
       <AppRoutes />
       <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}

export default App;