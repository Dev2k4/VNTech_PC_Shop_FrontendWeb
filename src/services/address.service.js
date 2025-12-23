import axiosClient from '../config/axiosClient';

const AddressService = {
    // Lấy danh sách địa chỉ của user
    getMyAddresses: () => {
        return axiosClient.get('/user/addresses');
    },

    // Thêm địa chỉ mới
    addAddress: (data) => {
        // data: { recipientName, phoneNumber, province, district, ward, addressDetail, default: true/false }
        return axiosClient.post('/user/addresses', data);
    },

    // Lấy danh sách Tỉnh/Thành (cho form thêm địa chỉ)
    getProvinces: () => {
        return axiosClient.get('/address/provinces');
    },

    getDistricts: (provinceCode) => {
        return axiosClient.get(`/address/districts?provinceCode=${provinceCode}`);
    },

    getWards: (districtCode) => {
        return axiosClient.get(`/address/wards?districtCode=${districtCode}`);
    },
    deleteAddress: (id) => {
        return axiosClient.delete(`/user/addresses/${id}`);
    },

    setDefault: (id) => {
        return axiosClient.put(`/user/addresses/${id}/default`);
    }
    
};

export default AddressService;