// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import theme from './theme'; // <--- Chuyển import theme ra đây

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 1. Chakra Provider bọc ngoài cùng để Style hoạt động */}
    <ChakraProvider theme={theme}>
      {/* 2. Router bọc tiếp theo để cho phép điều hướng */}
      <BrowserRouter> 
        {/* 3. CartProvider nằm trong cùng để dùng được Router và Chakra */}
        <CartProvider> 
          <App />
        </CartProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
)