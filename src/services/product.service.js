import axiosClient from '../config/axiosClient';

const ProductService = {
    // 1. Lấy danh sách kèm bộ lọc (Search, Giá, Danh mục, Hãng...)
    getAll: (params) => {
        // params sẽ bao gồm:
        // page, size, productName (keyword), minPrice, maxPrice, 
        // categoryId, brand, sortBy, sortDirection
        return axiosClient.get('/products', { params });
    },

    // 2. Lấy danh sách danh mục (để hiển thị checkbox lọc)
    getCategories: () => {
        return axiosClient.get('/categories');
    },

    getById: (id) => {
        return axiosClient.get(`/products/${id}`);
    }
};

export default ProductService;