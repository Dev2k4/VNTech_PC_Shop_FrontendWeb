import React, { createContext, useContext, useState, useEffect } from 'react';
import CartService from '../services/cart.service';
import { useToast } from '@chakra-ui/react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState([]); // Thêm state lưu chi tiết giỏ hàng
    const toast = useToast();

    // Hàm lấy dữ liệu giỏ hàng đầy đủ
    const fetchCart = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setCartCount(0);
            setCartItems([]);
            return;
        }

        try {
            // Gọi API lấy toàn bộ giỏ hàng thay vì chỉ lấy count
            const res = await CartService.getCart();
            if (res && res.success) {
                setCartCount(res.data.totalItems);
                setCartItems(res.data.cartItems); // Lưu danh sách item để check tồn kho
            }
        } catch (error) {
            console.error("Lỗi lấy giỏ hàng:", error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Hàm thêm vào giỏ (Đã nâng cấp logic check tồn kho)
    const addToCart = async (product, quantity = 1) => {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
            toast({ 
                title: "Chưa đăng nhập", 
                description: "Vui lòng đăng nhập để mua hàng", 
                status: "warning",
                duration: 3000,
                isClosable: true
            });
            return false;
        }

        // 1. Tìm xem sản phẩm này đã có trong giỏ chưa
        const existingItem = cartItems.find(item => item.product.id === product.id);
        const currentQtyInCart = existingItem ? existingItem.quantity : 0;

        // 2. Kiểm tra tồn kho (Quan trọng)
        // Nếu (số lượng đang có + số lượng muốn thêm) > tồn kho thực tế -> Chặn
        if (currentQtyInCart + quantity > product.stock) {
            toast({ 
                title: "Không đủ hàng", 
                description: `Bạn đã có ${currentQtyInCart} sản phẩm trong giỏ. Kho chỉ còn ${product.stock}.`, 
                status: "error",
                duration: 3000,
                isClosable: true
            });
            return false;
        }

        try {
            // Gửi request nếu hợp lệ
            await CartService.addToCart({ productId: product.id, quantity });
            
            // Cập nhật lại giỏ hàng
            await fetchCart(); 
            
            toast({ 
                title: "Thêm thành công", 
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
        // Export thêm cartItems nếu các component con cần dùng
        <CartContext.Provider value={{ cartCount, cartItems, fetchCartCount: fetchCart, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart error");
    return context;
};