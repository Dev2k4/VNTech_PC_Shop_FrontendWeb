import axiosClient from '../config/axiosClient';

const AuthService = {
    login: (data) => {
        return axiosClient.post('/login', data);
    },
    register: (data) => {
        return axiosClient.post('/register', data);
    },
    verifyOtp: (otp) => {
        return axiosClient.post(`/verify-otp?otp=${otp}`);
    },
    logout: (refreshToken) => {
        return axiosClient.post('/logout', { refreshToken });
    }
};

export default AuthService;