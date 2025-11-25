import React, { createContext, useContext, useState, useEffect } from 'react';

// Tạo Context
const CartContext = createContext();

// Component Provider (Bao bọc ứng dụng)
export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0); // Số lượng sản phẩm trong giỏ
    const fetchCart = () => {
        console.log("Fetching cart...");
    };

    return (
        <CartContext.Provider value={{ cartCount, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart phải được sử dụng bên trong CartProvider");
    }
    return context;
};