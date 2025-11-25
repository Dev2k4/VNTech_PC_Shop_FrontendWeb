import axiosClient from '../config/axiosClient';

// Hàm lấy Header chứa User ID (Vì Backend yêu cầu)
const getConfig = () => {
    const userId = localStorage.getItem('userId'); // Lát nữa sửa Login để lưu cái này
    return {
        headers: {
            "X-User-Id": userId 
        }
    };
};

const CartService = {
    // Lấy giỏ hàng của User
    getCart: () => {
        return axiosClient.get('/cart', getConfig());
    },

    // Thêm sản phẩm vào giỏ
    addToCart: (data) => {
        // data: { productId, quantity }
        // Backend path: POST /cart/items
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

    // Đếm số lượng (để hiện lên Header)
    getCount: () => {
        return axiosClient.get('/cart/count', getConfig());
    }
};

export default CartService;