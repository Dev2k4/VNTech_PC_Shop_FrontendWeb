import React, { useEffect, useState } from 'react';
// ... giữ nguyên các import cũ (Box, Container, Grid...)
// ...
import ProductService from '../../../services/product.service';
import ProductCard from '../components/ProductCard';
import Pagination from '../../../components/common/Pagination'; // <--- IMPORT MỚI

const HomePage = () => {
    // ... Giữ nguyên toàn bộ state và useEffect cũ
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        page: 0,
        size: 8, // Thử sửa thành size: 1 để test phân trang nếu ít sản phẩm
        productName: '',
        sortBy: 'createdAt',
        sortDirection: 'desc'
    });
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        // ... (Giữ nguyên logic gọi API)
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await ProductService.getAll(filters);
                if (res && res.data) {
                    setProducts(res.data.content || []);
                    setTotalPages(res.data.totalPages || 0);
                }
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [filters]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setFilters(prev => ({ ...prev, page: newPage }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // ... Giữ nguyên handleSearchChange

    return (
        <Box bg="apple.bg" minH="100vh">
            {/* ... Giữ nguyên phần Hero Banner và Toolbar */}
            {/* (Tôi rút gọn để bạn dễ nhìn chỗ thay đổi) */}
            <Container maxW="container.xl" py={10}>
                {/* ... Toolbar ... */}

                {loading ? (
                    <Flex justify="center" py={20}>
                        <Spinner size="xl" color="apple.blue" thickness="4px" emptyColor="gray.700" />
                    </Flex>
                ) : products.length === 0 ? (
                    <Box textAlign="center" py={20}>
                        <Text fontSize="xl" color="gray.500">Không tìm thấy sản phẩm nào.</Text>
                    </Box>
                ) : (
                    <>
                        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }} gap={8}>
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </Grid>

                        {/* --- SỬ DỤNG COMPONENT PAGINATION MỚI --- */}
                        <Pagination 
                            currentPage={filters.page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                        {/* ---------------------------------------- */}
                    </>
                )}
            </Container>
        </Box>
    );
};

export default HomePage;