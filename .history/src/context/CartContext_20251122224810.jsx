import React, { createContext, useContext, useState, useEffect } from 'react';
import CartService from '../services/cart.service';
import { useToast } from '@chakra-ui/react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const toast = useToast();

    // Hàm lấy số lượng item trong giỏ (Gọi API)
    const fetchCartCount = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setCartCount(0);
            return;
        }
        try {
            const res = await CartService.getCount();
            if (res.success) {
                setCartCount(res.data);
            }
        } catch (error) {
            console.error("Lỗi lấy giỏ hàng:", error);
        }
    };

    // Gọi lần đầu khi vào web
    useEffect(() => {
        fetchCartCount();
    }, []);

    // Hàm thêm vào giỏ (Dùng chung cho toàn app)
    const addToCart = async (productId, quantity = 1) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({ title: "Vui lòng đăng nhập để mua hàng", status: "warning" });
            return false;
        }

        try {
            await CartService.addToCart({ productId, quantity });
            await fetchCartCount(); // Cập nhật lại số lượng trên Header
            toast({ title: "Đã thêm vào giỏ hàng", status: "success" });
            return true;
        } catch (error) {
            toast({ 
                title: "Thêm thất bại", 
                description: error.response?.data?.message || "Lỗi server", 
                status: "error" 
            });
            return false;
        }
    };

    return (
        <CartContext.Provider value={{ cartCount, fetchCartCount, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart error");
    return context;
};