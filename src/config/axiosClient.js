import axios from 'axios';

const axiosClient = axios.create({
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
    const { response } = error;
    if (response && response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');  
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
export default axiosClient;