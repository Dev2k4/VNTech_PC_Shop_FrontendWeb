import axiosClient from '../config/axiosClient';

const ProductService = {
    // Lấy danh sách sản phẩm (có hỗ trợ lọc và phân trang)
    getAll: (params) => {
        // params: { page, size, productName, minPrice, maxPrice, categoryId, sort... }
        return axiosClient.get('/products', { params });
    },

    // Lấy chi tiết 1 sản phẩm (Dùng cho trang chi tiết sau này)
    getById: (id) => {
        return axiosClient.get(`/products/${id}`);
    },

    // Lấy danh sách danh mục (để làm bộ lọc bên trái)
    getCategories: () => {
        return axiosClient.get('/categories');
    }
};

export default ProductService;