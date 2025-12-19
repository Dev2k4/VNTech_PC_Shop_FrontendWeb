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

    // Lấy danh sách đánh giá của 1 sản phẩm
    getProductReviews: (productId) => {
        return axiosClient.get(`/user/reviews/product/${productId}`);
    }
};

export default ReviewService;