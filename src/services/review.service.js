import axiosClient from '../config/axiosClient';

const ReviewService = {
    // Tạo đánh giá mới
    createReview: (data) => {
        // data: { productId, rating, comment }
        return axiosClient.post('/user/reviews', data);
    },

    // Kiểm tra xem user có được phép đánh giá sản phẩm này không
    checkCanReview: (productId) => {
        return axiosClient.get(`/user/reviews/product/${productId}/can-review`);
    },

    // Lấy danh sách đánh giá của 1 sản phẩm (có phân trang)
    getProductReviews: (productId, params) => {
        // params: { page, size, sortBy, sortDirection }
        return axiosClient.get(`/user/reviews/product/${productId}`, { params });
    },

    // Lấy tổng quan đánh giá (sao trung bình, số lượng từng sao)
    getProductReviewSummary: (productId) => {
        return axiosClient.get(`/user/reviews/product/${productId}/summary`);
    },

    // Lấy danh sách đánh giá của user
    getMyReviews: (params) => {
        return axiosClient.get('/user/reviews/my-reviews', { params });
    },

    // Cập nhật đánh giá
    updateReview: (reviewId, data) => {
        return axiosClient.put(`/user/reviews/${reviewId}`, data);
    },

    // Xóa đánh giá
    deleteReview: (reviewId) => {
        return axiosClient.delete(`/user/reviews/${reviewId}`);
    }
};

export default ReviewService;