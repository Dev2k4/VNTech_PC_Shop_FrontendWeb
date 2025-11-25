import React, { createContext, useContext, useState, useEffect } from 'react';
const CartContext = createContext();
export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0); 
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