import React, { useEffect, useState } from 'react';
import {
    Box, Container, Grid, Flex, Select, Text, Spinner, 
    useColorModeValue, Heading, IconButton, Drawer, DrawerOverlay,
    DrawerContent, DrawerCloseButton, DrawerBody, useDisclosure, HStack, Button
} from '@chakra-ui/react';
import { FaFilter, FaSearchMinus } from 'react-icons/fa';
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
    
    // Hook lấy tham số từ URL (quan trọng cho Search)
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get("search"); // Lấy từ khóa từ thanh search Header

    // Pagination
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Filter State
    const [filters, setFilters] = useState({
        minPrice: 0,
        maxPrice: 50000000,
        brand: "",
        categoryId: "", // Để trống ban đầu
        sortDirection: "desc", 
        sortBy: "createdAt"
    });

    // Mobile Drawer (Bộ lọc trên mobile)
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Theme Colors
    const bg = useColorModeValue("gray.50", "vntech.darkBg");
    const textColor = useColorModeValue("gray.800", "white");

    // 1. Load Categories cho Sidebar (Chạy 1 lần đầu)
    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await ProductService.getCategories();
                if (res.success) setCategories(res.data);
            } catch (e) { console.error("Lỗi lấy danh mục", e); }
        };
        fetchCats();
    }, []);

    // 2. Hàm gọi API lấy sản phẩm (Core Logic)
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {
                page: page,
                size: 12, // 12 sản phẩm mỗi trang
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                brand: filters.brand || null,
                categoryId: filters.categoryId || null,
                productName: keyword || null, // Truyền keyword search vào đây
                sortBy: filters.sortBy,
                sortDirection: filters.sortDirection
            };

            const res = await ProductService.getAll(params);
            if (res.success) {
                setProducts(res.data.content);
                setTotalPages(res.data.totalPages);
            }
        } catch (error) {
            console.error("Lỗi tải sản phẩm", error);
        } finally {
            setLoading(false);
        }
    };

    // 3. Trigger API khi page, sort, hoặc keyword URL thay đổi
    useEffect(() => {
        fetchProducts();
        window.scrollTo(0, 0); // Cuộn lên đầu trang
    }, [page, filters.sortBy, filters.sortDirection, keyword]); 
    
    // Lưu ý: minPrice, maxPrice, brand, categoryId sẽ đợi bấm nút "Áp dụng" mới fetch (ở hàm dưới)

    // 4. Xử lý nút "Áp dụng" ở Sidebar
    const handleApplyFilter = () => {
        setPage(0); // Reset về trang 1
        fetchProducts(); // Gọi API
        onClose(); // Đóng drawer mobile nếu đang mở
    };

    // 5. Xử lý Sort
    const handleSortChange = (e) => {
        const [by, dir] = e.target.value.split('-');
        setFilters(prev => ({ ...prev, sortBy: by, sortDirection: dir }));
    };

    // 6. Xóa hết lọc
    const handleClearAll = () => {
        setFilters({ minPrice: 0, maxPrice: 50000000, brand: "", categoryId: "", sortDirection: "desc", sortBy: "createdAt" });
        setSearchParams({}); // Xóa luôn keyword trên URL
        setPage(0);
        setTimeout(() => fetchProducts(), 100); // Hack nhẹ để đợi state cập nhật
    };

    return (
        <Box minH="100vh" py={8} bg={bg}>
            <Container maxW="container.xl">
                
                {/* HEADLINE & TOOLBAR */}
                <Flex justify="space-between" align="center" mb={6} direction={{base: 'column', md: 'row'}} gap={4}>
                    <Box>
                        <Heading size="lg" color={textColor}>
                            {keyword ? `Kết quả tìm kiếm: "${keyword}"` : "Tất cả sản phẩm"}
                        </Heading>
                        <Text color="gray.500" mt={1}>Tìm thấy {products.length} sản phẩm</Text>
                    </Box>
                    
                    <HStack spacing={3} w={{base: "full", md: "auto"}}>
                        {/* Mobile Filter Button */}
                        <IconButton 
                            icon={<FaFilter />} 
                            display={{ base: "flex", md: "none" }} 
                            onClick={onOpen}
                            aria-label="Filter"
                        />
                        
                        {/* Sort Dropdown */}
                        <Select 
                            w={{base: "full", md: "220px"}}
                            bg={useColorModeValue("white", "gray.800")}
                            borderColor={useColorModeValue("gray.200", "whiteAlpha.200")}
                            value={`${filters.sortBy}-${filters.sortDirection}`}
                            onChange={handleSortChange}
                        >
                            <option value="createdAt-desc">Mới nhất</option>
                            <option value="salePrice-asc">Giá thấp đến cao</option>
                            <option value="salePrice-desc">Giá cao đến thấp</option>
                            <option value="productName-asc">Tên A-Z</option>
                        </Select>
                    </HStack>
                </Flex>

                <Grid templateColumns={{ base: "1fr", md: "260px 1fr" }} gap={8}>
                    {/* LEFT: SIDEBAR (Desktop Only) */}
                    <Box display={{ base: "none", md: "block" }}>
                        <FilterSidebar 
                            filters={filters} 
                            setFilters={setFilters} 
                            onApply={handleApplyFilter} 
                            categories={categories}
                        />
                    </Box>

                    {/* RIGHT: PRODUCTS */}
                    <Box>
                        {loading ? (
                            <Flex justify="center" py={20}><Spinner size="xl" color="blue.500" thickness="4px" /></Flex>
                        ) : products.length === 0 ? (
                            <Box textAlign="center" py={20} bg={useColorModeValue("white", "gray.800")} borderRadius="xl" border="1px dashed" borderColor="gray.200">
                                <Icon as={FaSearchMinus} w={16} h={16} color="gray.400" mb={4} />
                                <Text fontSize="xl" color="gray.500" mb={4}>Không tìm thấy sản phẩm nào phù hợp.</Text>
                                <Button colorScheme="blue" variant="outline" onClick={handleClearAll}>Xóa bộ lọc & Tìm kiếm</Button>
                            </Box>
                        ) : (
                            <>
                                <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }} gap={6}>
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </Grid>
                                
                                <Box mt={10}>
                                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                                </Box>
                            </>
                        )}
                    </Box>
                </Grid>

                {/* DRAWER FILTER (Mobile) */}
                <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent bg={bg}>
                        <DrawerCloseButton />
                        <DrawerBody pt={10} px={4}>
                            <FilterSidebar 
                                filters={filters} 
                                setFilters={setFilters} 
                                onApply={handleApplyFilter} 
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