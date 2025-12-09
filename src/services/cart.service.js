import axiosClient from '../config/axiosClient';

const CartService = {
    getCart: () => {
        return axiosClient.get('/cart');
    },

    addToCart: (data) => {
        // Ép kiểu dữ liệu sang số để tránh lỗi 400 từ Backend
        const payload = {
            productId: parseInt(data.productId),
            quantity: parseInt(data.quantity)
        };
        return axiosClient.post('/cart/items', payload);
    },

    updateItem: (itemId, quantity) => {
        const payload = { quantity: parseInt(quantity) };
        return axiosClient.put(`/cart/items/${itemId}`, payload);
    },

    removeItem: (itemId) => {
        return axiosClient.delete(`/cart/items/${itemId}`);
    },

    getCount: () => {
        return axiosClient.get('/cart/count');
    },
    
    // Thêm hàm updateSelectedItems nếu chưa có (dựa theo Swagger)
    updateSelectedItems: (itemIds, selected) => {
        // itemIds là mảng [1, 2], selected là boolean
        // Swagger: PUT /cart/items/select?itemIds=1,2&selected=true
        // Axios params serializer sẽ tự lo việc này
        return axiosClient.put('/cart/items/select', null, {
            params: {
                itemIds: itemIds.join(','),
                selected: selected
            }
        });
    }
};

export default CartService;