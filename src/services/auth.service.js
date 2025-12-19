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
    },
    getProfile: () => {
        return axiosClient.get("/user/profile");
    },
    
    // --- MỚI: QUÊN MẬT KHẨU ---
    forgotPassword: (email) => {
        return axiosClient.post(`/forgot-password?email=${email}`);
    },
    verifyResetOtp: (otp) => {
        return axiosClient.post(`/verify-reset-otp?otp=${otp}`);
    },
    resetPassword: (email, newPassword) => {
        return axiosClient.post(`/reset-password`, null, {
            params: { email, newPassword }
        });
    }
};

export default AuthService;