import axiosClient from '../config/axiosClient';

const CouponService = {
    // --- ADMIN APIs ---
    getAllCoupons: () => {
        return axiosClient.get('/admin/coupons');
    },

    createCoupon: (data) => {
        return axiosClient.post('/admin/coupons', data);
    },

    updateCoupon: (id, data) => {
        return axiosClient.put(`/admin/coupons/${id}`, data);
    },

    deactivateCoupon: (id) => {
        return axiosClient.delete(`/admin/coupons/${id}`);
    },

    getCouponByCode: (code) => {
        return axiosClient.get(`/admin/coupons/${code}`);
    },

    // --- USER APIs (Optional/Future) ---
    validateCoupon: (data) => {
        // data: { couponCode, userId, orderValue, shippingFee }
        return axiosClient.post('/coupons/validate', data);
    },

    getActiveCoupons: () => {
        return axiosClient.get('/coupons/active');
    }
};

export default CouponService;
