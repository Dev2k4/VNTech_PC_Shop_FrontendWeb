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

    // --- SẢN PHẨM (Sẽ dùng sau) ---
    createProduct: (data) => axiosClient.post('/admin/products', data),
    updateProduct: (id, data) => axiosClient.put(`/admin/products/${id}`, data),
    deleteProduct: (id) => axiosClient.delete(`/admin/products/${id}`),

    // --- ĐƠN HÀNG (Sẽ dùng sau) ---
    getAllOrders: (params) => axiosClient.get('/admin/orders', { params }),
    updateOrderStatus: (id, status) => axiosClient.put(`/admin/orders/${id}/status`, { status }),

    // --- NGƯỜI DÙNG (Sẽ dùng sau) ---
    getAllUsers: () => axiosClient.get('/admin/users'),
    deleteUser: (id) => axiosClient.delete(`/admin/users/${id}`),
};

export default AdminService;