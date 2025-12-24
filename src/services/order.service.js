import axiosClient from '../config/axiosClient';

const OrderService = {
    createOrder: (data) => {
        return axiosClient.post('/user/orders', data);
    },

    getMyOrders: (params) => {
        return axiosClient.get('/user/orders/my', { params });
    },

    getOrderById: (id) => {
        return axiosClient.get(`/user/orders/${id}`);
    },

    // --- CẬP NHẬT: Hủy đơn kèm lý do ---
    cancelOrder: (orderId, reason) => {
        return axiosClient.post(`/user/orders/${orderId}/cancel`, null, {
            params: { reason }
        });
    },

    buyNow: (data) => {
        return axiosClient.post('/user/orders/buy-now', data);
    }
};

export default OrderService;