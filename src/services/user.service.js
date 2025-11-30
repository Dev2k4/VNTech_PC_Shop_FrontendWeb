import axiosClient from '../config/axiosClient';

const UserService = {
    // Lấy thông tin profile (đã có trong auth nhưng gọi lại ở đây cho các thao tác reload trang profile)
    getProfile: () => {
        return axiosClient.get('/user/profile');
    },

    // Cập nhật thông tin cá nhân
    updateProfile: (data) => {
        return axiosClient.put('/user/profile', data);
    },

    // Đổi mật khẩu
    changePassword: (data) => {
        // data: { oldPassword, newPassword, confirmNewPassword }
        return axiosClient.post('/user/change-password', data);
    },

    // Upload Avatar
    uploadAvatar: (userId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return axiosClient.post(`/user/profile/${userId}/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    
    // Xóa Avatar (nếu có API)
    // deleteAvatar: (userId) => ...
};

export default UserService;