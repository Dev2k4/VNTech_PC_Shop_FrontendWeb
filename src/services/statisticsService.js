import axiosClient from '../config/axiosClient';

const StatisticsService = {
    // Thống kê tổng quan
    getTotalRevenue: (from, to) => {
        return axiosClient.get('/admin/statistics/total-revenue', { params: { from, to } });
    },
    getTotalOrders: (from, to) => {
        return axiosClient.get('/admin/statistics/total-orders', { params: { from, to } });
    },
    getTotalCustomers: (from, to) => {
        return axiosClient.get('/admin/statistics/total-customers', { params: { from, to } });
    },
    getPendingOrders: (status = 'PENDING', from, to) => {
        return axiosClient.get('/admin/statistics/pending-orders', { params: { status, from, to } });
    },

    // Thống kê chi tiết
    getMonthlyRevenue: (year) => {
        return axiosClient.get('/admin/statistics/revenue/monthly', { params: { year } });
    },
    getOrdersByStatus: (from, to) => {
        return axiosClient.get('/admin/statistics/orders/by-status', { params: { from, to } });
    },
    getTopSellingProducts: (from, to, limit = 5) => {
        return axiosClient.get('/admin/statistics/products/top-selling', { params: { from, to, limit } });
    },
    getMonthlyNewUsers: (year) => {
        return axiosClient.get('/admin/statistics/users/new/monthly', { params: { year } });
    }
};

export default StatisticsService;
