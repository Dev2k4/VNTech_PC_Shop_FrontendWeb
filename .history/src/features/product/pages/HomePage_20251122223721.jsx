import React, { useEffect, useState } from 'react';
import { 
    Box, Container, Grid, Heading, Text, Spinner, Flex, Input, InputGroup, InputLeftElement, Select, Button, HStack, IconButton
} from '@chakra-ui/react';
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import ProductService from '../../../services/product.service';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State phân trang & lọc
    const [filters, setFilters] = useState({
        page: 0,
        size: 8, // Số sản phẩm mỗi trang
        productName: '',
        sortBy: 'createdAt',
        sortDirection: 'desc'
    });
    
    const [totalPages, setTotalPages] = useState(0);

    // Gọi API lấy sản phẩm
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await ProductService.getAll(filters);
                if (res && res.data) {
                    setProducts(res.data.content || []);
                    setTotalPages(res.data.totalPages || 0); // Cập nhật tổng số trang
                }
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timer = setTimeout(() => {
            fetchProducts();
        }, 500);

        return () => clearTimeout(timer);
    }, [filters]);

    // Hàm chuyển trang
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setFilters(prev => ({ ...prev, page: newPage }));
            // Cuộn lên đầu trang khi chuyển trang cho mượt
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <Box bg="apple.bg" minH="100vh">
            {/* Hero Section */}
            <Box 
                py={20} 
                textAlign="center" 
                bgGradient="linear(to-b, apple.bg, apple.card)"
                borderBottom="1px solid"
                borderColor="whiteAlpha.200"
            >
                <Container maxW="container.lg">
                    <Heading 
                        as="h1" 
                        size="4xl" 
                        bgGradient="linear(to-r, apple.blue, purple.500)" 
                        bgClip="text"
                        fontWeight="extrabold"
                        mb={4}
                    >
                        VNTech Store.
                    </Heading>
                    <Text fontSize="2xl" color="apple.subText" maxW="600px" mx="auto">
                        Cách tốt nhất để mua các sản phẩm công nghệ yêu thích của bạn.
                    </Text>
                </Container>
            </Box>

            <Container maxW="container.xl" py={10}>
                {/* Toolbar: Tìm kiếm & Sắp xếp */}
                <Flex mb={10} justify="space-between" align="center" wrap="wrap" gap={4}>
                    <Heading size="lg" color="white">Sản phẩm mới</Heading>
                    
                    <Flex gap={4}>
                        <InputGroup w={{ base: "100%", md: "300px" }}>
                            <InputLeftElement pointerEvents="none">
                                <SearchIcon color="gray.500" />
                            </InputLeftElement>
                            <Input 
                                placeholder="Tìm kiếm..." 
                                bg="apple.card" 
                                border="none" 
                                color="white"
                                _focus={{ bg: "apple.cardHover", ring: 2, ringColor: "apple.blue" }}
                                borderRadius="full"
                                value={filters.productName}
                                onChange={(e) => setFilters({ ...filters, productName: e.target.value, page: 0 })}
                            />
                        </InputGroup>
                        
                        <Select 
                            w="150px" 
                            bg="apple.card" 
                            border="none" 
                            color="white" 
                            borderRadius="full"
                            cursor="pointer"
                            _focus={{ ring: 2, ringColor: "apple.blue" }}
                            value={filters.sortDirection}
                            onChange={(e) => setFilters({ ...filters, sortDirection: e.target.value, page: 0 })}
                        >
                            <option value="desc" style={{color: 'black'}}>Mới nhất</option>
                            <option value="asc" style={{color: 'black'}}>Cũ nhất</option>
                        </Select>
                    </Flex>
                </Flex>

                {/* Danh sách sản phẩm */}
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

                        {/* --- PHÂN TRANG (Pagination) --- */}
                        {totalPages > 1 && (
                            <Flex justify="center" mt={12} gap={4} align="center">
                                <IconButton 
                                    icon={<ChevronLeftIcon boxSize={6} />}
                                    isDisabled={filters.page === 0}
                                    onClick={() => handlePageChange(filters.page - 1)}
                                    variant="ghost"
                                    color="white"
                                    _hover={{ bg: "whiteAlpha.200" }}
                                    aria-label="Trang trước"
                                    borderRadius="full"
                                />
                                
                                <Text color="apple.subText" fontSize="sm">
                                    Trang <Text as="span" color="white" fontWeight="bold">{filters.page + 1}</Text> / {totalPages}
                                </Text>

                                <IconButton 
                                    icon={<ChevronRightIcon boxSize={6} />}
                                    isDisabled={filters.page === totalPages - 1}
                                    onClick={() => handlePageChange(filters.page + 1)}
                                    variant="ghost"
                                    color="white"
                                    _hover={{ bg: "whiteAlpha.200" }}
                                    aria-label="Trang sau"
                                    borderRadius="full"
                                />
                            </Flex>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
};

export default HomePage;