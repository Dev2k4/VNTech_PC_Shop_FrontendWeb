import React, { createContext, useContext, useState, useEffect } from 'react';
import CartService from '../services/cart.service';
import { useToast } from '@chakra-ui/react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const toast = useToast();

    // Hàm lấy số lượng item
    const fetchCartCount = async () => {
        const token = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('userId');

        // Nếu chưa đăng nhập thì reset về 0 và thoát luôn
        if (!token || !userId) {
            setCartCount(0);
            return;
        }

        try {
            const res = await CartService.getCount();
            if (res && res.success) { // Kiểm tra kỹ response
                setCartCount(res.data);
            }
        } catch (error) {
            console.error("Lỗi lấy giỏ hàng:", error);
        }
    };

    // Gọi lần đầu khi load trang
    useEffect(() => {
        fetchCartCount();
    }, []);

    // Hàm thêm vào giỏ
    const addToCart = async (productId, quantity = 1) => {
        const token = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            toast({ 
                title: "Chưa đăng nhập", 
                description: "Vui lòng đăng nhập để mua hàng", 
                status: "warning",
                duration: 3000,
                isClosable: true
            });
            return false;
        }

        try {
            await CartService.addToCart({ productId, quantity });
            
            // Cập nhật lại số lượng ngay lập tức
            await fetchCartCount(); 
            
            toast({ 
                title: "Thêm thành công", 
                description: "Sản phẩm đã được thêm vào giỏ hàng", 
                status: "success",
                duration: 2000,
                isClosable: true
            });
            return true;
        } catch (error) {
            console.error(error);
            toast({ 
                title: "Thêm thất bại", 
                description: error.response?.data?.message || "Lỗi kết nối server", 
                status: "error",
                duration: 3000,
                isClosable: true
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