import React, { useEffect, useState } from 'react';
import {
    Box, Container, Grid, useColorModeValue, Drawer, DrawerOverlay,
    DrawerContent, DrawerCloseButton, DrawerBody, useDisclosure, Button
} from '@chakra-ui/react';
import { FaFilter } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

import ProductService from '../../../services/product.service';
import ProductCard from '../components/ProductCard';
import Pagination from '../../../components/common/Pagination';
import FilterSidebar from '../components/FilterSidebar';

const ProductListPage = () => {
    // --- STATE ---
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Hook lấy tham số từ URL
    const [searchParams, setSearchParams] = useSearchParams();

    // Pagination
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Filter State - Khởi tạo giá trị mặc định
    const [filters, setFilters] = useState({
        minPrice: 0,
        maxPrice: 50000000,
        brand: "",
        categoryId: "", 
        productName: ""
    });

    const { isOpen, onOpen, onClose } = useDisclosure();
    const bg = useColorModeValue("gray.50", "vntech.darkBg");

    // 1. Load danh mục (chạy 1 lần đầu)
    useEffect(() => {
        const fetchCategories = async () => {
            const res = await ProductService.getCategories();
            if (res.success) setCategories(res.data);
        };
        fetchCategories();
    }, []);

    // 2. QUAN TRỌNG: Đồng bộ URL vào Filters State
    // Khi URL thay đổi (?categoryId=52...), cập nhật ngay vào biến filters
    useEffect(() => {
        const catId = searchParams.get('categoryId');
        const search = searchParams.get('search');
        
        setFilters(prev => ({
            ...prev,
            categoryId: catId || "", // Nếu không có thì reset về rỗng
            productName: search || "",
            // Giữ nguyên các giá trị lọc khác nếu muốn, hoặc reset tùy logic
        }));
        
        // Reset về trang 0 khi đổi danh mục/từ khóa
        setPage(0);
    }, [searchParams]);

    // 3. Gọi API lấy sản phẩm khi filters hoặc page thay đổi
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {
                    page: page,
                    size: 12,
                    ...filters // Truyền toàn bộ filters vào API
                };

                // Loại bỏ các param rỗng để API sạch hơn
                if (!params.categoryId) delete params.categoryId;
                if (!params.productName) delete params.productName;
                if (!params.brand) delete params.brand;

                const res = await ProductService.getAll(params);
                if (res.success) {
                    setProducts(res.data.content);
                    setTotalPages(res.data.totalPages);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        // Debounce nhẹ để tránh gọi API quá nhiều khi gõ phím (nếu cần)
        const timeout = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(timeout);
    }, [filters, page]); // Chạy lại khi filters hoặc page đổi

    // Xử lý khi bấm nút "Áp dụng" ở Sidebar (cập nhật lại URL hoặc State)
    const handleApplyFilter = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPage(0);
        onClose(); // Đóng drawer mobile nếu đang mở
    };

    return (
        <Box bg={bg} minH="100vh" py={8}>
            <Container maxW="container.xl">
                {/* Nút mở bộ lọc trên Mobile */}
                <Button 
                    leftIcon={<FaFilter />} 
                    display={{ base: 'flex', lg: 'none' }} 
                    mb={4} 
                    onClick={onOpen}
                >
                    Bộ lọc tìm kiếm
                </Button>

                <Grid templateColumns={{ base: "1fr", lg: "250px 1fr" }} gap={8}>
                    {/* Sidebar Desktop */}
                    <Box display={{ base: "none", lg: "block" }}>
                        <FilterSidebar 
                            filters={filters} 
                            setFilters={setFilters} 
                            onApply={() => handleApplyFilter(filters)} 
                            categories={categories}
                        />
                    </Box>

                    {/* Product Grid */}
                    <Box>
                        {loading ? (
                            <Box textAlign="center" py={20}>Đang tải sản phẩm...</Box>
                        ) : (
                            <>
                                <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }} gap={6}>
                                    {products.length > 0 ? products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    )) : (
                                        <Box gridColumn="1/-1" textAlign="center" py={10} color="gray.500">
                                            Không tìm thấy sản phẩm nào phù hợp.
                                        </Box>
                                    )}
                                </Grid>
                                
                                {products.length > 0 && (
                                    <Box mt={10}>
                                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>
                </Grid>

                {/* Drawer Mobile */}
                <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent bg={bg}>
                        <DrawerCloseButton />
                        <DrawerBody pt={10} px={4}>
                            <FilterSidebar 
                                filters={filters} 
                                setFilters={setFilters} 
                                onApply={() => handleApplyFilter(filters)} 
                                categories={categories}
                            />
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>

            </Container>
        </Box>
    );
};

export default ProductListPage;