import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes/AppRoutes';
import theme from './theme'; // <--- IMPORT THEME MỚI

function App() {
  return (
    // Truyền theme vào Provider
    <ChakraProvider theme={theme}> 
      <BrowserRouter>
          <AppRoutes />
          <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;