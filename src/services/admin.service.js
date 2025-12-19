import axiosClient from '../config/axiosClient';

const AdminService = {
    // --- THỐNG KÊ ---
    getStatistics: (start, end) => {
        return axiosClient.get('/admin/orders/statistics', { params: { start, end } });
    },

    // --- DANH MỤC ---
    createCategory: (data) => axiosClient.post('/admin/categories', data),
    updateCategory: (id, data) => axiosClient.put(`/admin/categories/${id}`, data),
    deleteCategory: (id) => axiosClient.delete(`/admin/categories/${id}`),

    // --- SẢN PHẨM ---
    createProduct: (data) => axiosClient.post('/admin/products', data),
    updateProduct: (id, data) => axiosClient.put(`/admin/products/${id}`, data),
    deleteProduct: (id) => axiosClient.delete(`/admin/products/${id}`),
    
    // API ẢNH SẢN PHẨM (MỚI)
    uploadMultipleImages: (productId, files) => {
        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('files', file);
        });
        return axiosClient.post(`/admin/products/${productId}/images/multiple`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    setMainImage: (productId, imageId) => {
        return axiosClient.put(`/admin/products/${productId}/images/${imageId}/main`);
    },
    deleteImage: (productId, imageId) => {
        return axiosClient.delete(`/admin/products/${productId}/images/${imageId}`);
    },

    // --- ĐƠN HÀNG ---
    getAllOrders: (params) => axiosClient.get('/admin/orders', { params }),
    updateOrderStatus: (id, status) => axiosClient.put(`/admin/orders/${id}/status`, { status }),

    // --- NGƯỜI DÙNG ---
    getAllUsers: () => axiosClient.get('/admin/users'),
    deleteUser: (id) => axiosClient.delete(`/admin/users/${id}`),
};

export default AdminService;