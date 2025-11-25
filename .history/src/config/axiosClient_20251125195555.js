// src/config/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // URL server Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho Request: Tự động gắn Token nếu có
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Hoặc lấy từ Cookie tùy cách bạn lưu
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho Response: Xử lý dữ liệu trả về từ Spring Boot
axiosClient.interceptors.response.use(
  (response) => {
    // Backend trả về: { success: true, message: "...", data: {...} }
    // Chúng ta chỉ cần lấy phần data để code trong component gọn hơn
    // Tuy nhiên, tùy logic bạn có thể return cả response.data nếu muốn check biến 'success'
    if (response && response.data) {
      return response.data; 
    }
    return response;
  },
  (error) => {
    // Xử lý lỗi chung (VD: Token hết hạn 401, Server lỗi 500)
    if (error.response && error.response.status === 401) {
      // Logic logout hoặc refresh token có thể đặt ở đây
      // localStorage.removeItem('accessToken');
      // window.location.href = '/login';
    }
    throw error;
  }
);

export default axiosClient;