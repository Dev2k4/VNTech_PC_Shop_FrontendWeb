import React, { useEffect, useState } from 'react';
import { 
    Box, Container, Grid, Heading, Text, Spinner, Flex, Input, InputGroup, InputRightElement, Select, Button 
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import ProductService from '../../../services/product.service';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State cho bộ lọc
    const [filters, setFilters] = useState({
        page: 0,
        size: 8,
        productName: '',
        sortBy: 'createdAt',
        sortDirection: 'desc'
    });

    // Gọi API lấy sản phẩm
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await ProductService.getAll(filters);
                // Backend trả về PageResponse: { content: [], totalPages: ... }
                if (res && res.data) {
                    setProducts(res.data.content || []);
                }
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce (Chờ 500ms sau khi gõ phím mới gọi API)
        const timer = setTimeout(() => {
            fetchProducts();
        }, 500);

        return () => clearTimeout(timer);
    }, [filters]); // Chạy lại khi filters thay đổi

    // Xử lý thay đổi ô tìm kiếm
    const handleSearchChange = (e) => {
        setFilters(prev => ({ ...prev, productName: e.target.value, page: 0 }));
    };

    return (
        <Container maxW="container.xl" py={8}>
            {/* Banner đơn giản */}
            <Box bg="blue.600" color="white" p={10} borderRadius="lg" mb={8} textAlign="center">
                <Heading>Chào mừng đến với VNTech Store</Heading>
                <Text mt={2}>Công nghệ đỉnh cao - Giá cả phải chăng</Text>
            </Box>

            {/* Thanh công cụ: Tìm kiếm & Sắp xếp */}
            <Flex mb={6} gap={4} flexWrap="wrap">
                <InputGroup maxW="400px">
                    <Input 
                        placeholder="Tìm kiếm sản phẩm..." 
                        value={filters.productName}
                        onChange={handleSearchChange}
                        bg="white"
                    />
                    <InputRightElement children={<SearchIcon color="gray.500" />} />
                </InputGroup>

                <Select 
                    maxW="200px" 
                    bg="white" 
                    value={filters.sortDirection}
                    onChange={(e) => setFilters({ ...filters, sortDirection: e.target.value })}
                >
                    <option value="desc">Mới nhất</option>
                    <option value="asc">Cũ nhất</option>
                </Select>
            </Flex>

            {/* Danh sách sản phẩm */}
            {loading ? (
                <Flex justify="center" align="center" minH="300px">
                    <Spinner size="xl" color="blue.500" thickness="4px" />
                </Flex>
            ) : products.length === 0 ? (
                <Box textAlign="center" py={10}>
                    <Text fontSize="xl" color="gray.500">Không tìm thấy sản phẩm nào.</Text>
                </Box>
            ) : (
                <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default HomePage;