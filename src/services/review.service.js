import axiosClient from '../config/axiosClient';

const ReviewService = {
    // Tạo đánh giá mới
    createReview: (data) => {
        return axiosClient.post('/user/reviews', data);
    },

    // Cập nhật đánh giá
    updateReview: (reviewId, data) => {
        return axiosClient.put(`/user/reviews/${reviewId}`, data);
    },

    // Xóa đánh giá
    deleteReview: (reviewId) => {
        return axiosClient.delete(`/user/reviews/${reviewId}`);
    },

    // Lấy đánh giá của user hiện tại
    getUserReviews: (page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'desc') => {
        return axiosClient.get('/user/reviews/my-reviews', {
            params: { page, size, sortBy, sortDirection }
        });
    },

    // Lấy danh sách đánh giá của 1 sản phẩm
    getProductReviews: (productId, page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'desc') => {
        return axiosClient.get(`/user/reviews/product/${productId}`, {
            params: { page, size, sortBy, sortDirection }
        });
    },

    // Lấy đánh giá theo 1 star, 2 star...
    getProductReviewsByRating: (productId, rating, page = 0, size = 10) => {
        return axiosClient.get(`/user/reviews/product/${productId}/rating/${rating}`, {
            params: { page, size }
        });
    },

    // Lấy summary (avg rating, count...)
    getProductReviewSummary: (productId) => {
        return axiosClient.get(`/user/reviews/product/${productId}/summary`);
    },

    // Kiểm tra xem user có được phép đánh giá sản phẩm này không
    checkCanReview: (productId) => {
        return axiosClient.get(`/user/reviews/product/${productId}/can-review`);
    }
};

export default ReviewService;