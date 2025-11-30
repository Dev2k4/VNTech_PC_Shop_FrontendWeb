import axiosClient from '../config/axiosClient';

const OrderService = {
    // Tạo đơn hàng
    createOrder: (data) => {
        // data: { addressId, paymentMethod, note, couponCode }
        return axiosClient.post('/user/orders', data);
    },

    // Lấy danh sách đơn hàng của tôi
    getMyOrders: (params) => {
        return axiosClient.get('/user/orders/my', { params });
    },

    // Lấy chi tiết đơn hàng
    getOrderById: (id) => {
        return axiosClient.get(`/user/orders/${id}`);
    }
};

export default OrderService;