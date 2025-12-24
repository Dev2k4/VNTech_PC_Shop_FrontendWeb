import axiosClient from '../config/axiosClient';

const PaymentService = {
    /**
     * Tạo yêu cầu thanh toán (VNPay hoặc COD)
     * @param {Object} data - { orderId, amount, paymentMethod, bankCode, language }
     */
    createPayment: async (data) => {
        const response = await axiosClient.post('/user/payment/create', data);
        return response.data; // Trả về nội dung của APIResponse
    },

    /**
     * Xác nhận đơn hàng COD
     * @param {number} orderId 
     */
    confirmCodOrder: async (orderId) => {
        const response = await axiosClient.post(`/user/payment/cod/${orderId}/confirm`);
        return response.data;
    }
};

export default PaymentService;