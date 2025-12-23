import axiosClient from '../config/axiosClient';

const ShippingService = {
    calculateShippingFee: (data) => {
        // data: { province, orderValue }
        return axiosClient.post('/shipping/calculate', data);
    },

    getAllProvinces: () => {
        return axiosClient.get('/shipping/provinces');
    },

    getProvinceInfo: (province) => {
        return axiosClient.get(`/shipping/provinces/${province}`);
    }
};

export default ShippingService;
