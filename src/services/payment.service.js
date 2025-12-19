import axiosClient from '../config/axiosClient';

const PaymentService = {
    // Gọi API tạo URL thanh toán VNPay
    createPayment: (data) => {
        // data: { orderId, amount, paymentMethod: "VNPAY", bankCode: "NCB"... }
        // Lưu ý: bankCode có thể để null để user chọn tại cổng VNPAY, hoặc fix cứng "NCB" để test
        return axiosClient.post('/user/payment/create', data);
    }
};

export default PaymentService;