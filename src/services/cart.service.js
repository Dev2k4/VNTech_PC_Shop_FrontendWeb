import axiosClient from '../config/axiosClient';

// Hàm này phải lấy userId MỚI NHẤT từ localStorage mỗi khi được gọi
const getConfig = () => {
    const userId = localStorage.getItem('userId'); 
    return {
        headers: {
            "X-User-Id": userId 
        }
    };
};

const CartService = {
    // Lấy giỏ hàng
    getCart: () => {
        return axiosClient.get('/cart', getConfig());
    },

    // Thêm sản phẩm
    addToCart: (data) => {
        return axiosClient.post('/cart/items', data, getConfig());
    },

    // Cập nhật số lượng
    updateItem: (itemId, quantity) => {
        return axiosClient.put(`/cart/items/${itemId}`, { quantity }, getConfig());
    },

    // Xóa sản phẩm
    removeItem: (itemId) => {
        return axiosClient.delete(`/cart/items/${itemId}`, getConfig());
    },

    // Đếm số lượng
    getCount: () => {
        return axiosClient.get('/cart/count', getConfig());
    }
};

export default CartService;