import axios from 'axios';

const axiosClient = axios.create({
    // SỬA DÒNG NÀY: Xóa http://localhost:8080, chỉ để lại đường dẫn tương đối
    baseURL: '/api/v1', 
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use((response) => {
    return response.data; 
}, (error) => {
    return Promise.reject(error);
});

export default axiosClient;