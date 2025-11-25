import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes/AppRoutes';
import theme from './theme';
import { CartProvider } from './context/CartContext'; // <--- IMPORT NÀY

function App() {
  return (
    <ChakraProvider theme={theme}>
      
        <CartProvider>
            <AppRoutes />
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </CartProvider>
        {/* KẾT THÚC CART PROVIDER */}
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;