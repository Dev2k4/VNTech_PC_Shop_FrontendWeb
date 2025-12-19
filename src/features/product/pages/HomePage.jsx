import React, { useEffect, useState } from "react";
import {
  Box, Container, Heading, Text, Spinner, Flex, useColorModeValue, Button, Image, SimpleGrid, Icon
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaRocket, FaHeadset, FaTools, FaArrowRight } from "react-icons/fa";

import ProductService from "../../../services/product.service";
import ProductCard from "../components/ProductCard";
import Pagination from "../../../components/common/Pagination";

// Component Hero Banner (Đã bỏ Search Bar)
const HeroSection = () => {
    const bgGradient = useColorModeValue("linear(to-r, blue.50, purple.50)", "linear(to-r, gray.900, blue.900)");
    
    return (
        <Box w="full" bg={bgGradient} pt={{ base: 20, md: 28 }} pb={{ base: 10, md: 20 }} overflow="hidden" position="relative">
            <Container maxW="container.xl">
                <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between" gap={10}>
                    {/* Text Content */}
                    <Box flex="1" as={motion.div} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                        <Heading as="h1" size="2xl" fontWeight="900" bgGradient="linear(to-r, blue.400, purple.600)" bgClip="text" mb={4}>
                            CÔNG NGHỆ TƯƠNG LAI <br /> TRONG TẦM TAY BẠN
                        </Heading>
                        <Text fontSize="xl" color="gray.500" mb={8}>
                            Khám phá những sản phẩm công nghệ đỉnh cao với giá tốt nhất thị trường. Bảo hành chính hãng, hậu mãi dài lâu.
                        </Text>
                        
                        {/* Nút cuộn xuống danh sách sản phẩm */}
                        <Button 
                            as="a" 
                            href="#products-section"
                            size="lg" 
                            colorScheme="blue" 
                            px={8} 
                            rightIcon={<FaArrowRight />}
                            rounded="full"
                            boxShadow="lg"
                            _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                        >
                            Mua sắm ngay
                        </Button>
                    </Box>
                    
                    {/* Hero Image */}
                    <Box flex="1" display={{ base: "none", md: "block" }} as={motion.div} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                        <Image 
                            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop" 
                            alt="Hero Image" 
                            borderRadius="2xl" 
                            boxShadow="2xl"
                            objectFit="cover"
                            maxH="400px"
                            w="full"
                        />
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchProducts = async (pageIndex) => {
        setLoading(true);
        try {
            const res = await ProductService.getAll({ page: pageIndex, size: 8 });
            if (res.success) {
                setProducts(res.data.content);
                setTotalPages(res.data.totalPages);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    return (
        <Box minH="100vh">
            <HeroSection />
            
            {/* Thêm ID để nút ở trên cuộn xuống đây */}
            <Container maxW="container.xl" py={16} id="products-section">
                <Heading mb={8} textAlign="center" size="xl">Sản phẩm nổi bật</Heading>
                
                {loading ? (
                    <Flex justify="center" py={20}><Spinner size="xl" color="blue.500" /></Flex>
                ) : (
                    <>
                        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={8} mb={10}>
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </SimpleGrid>
                        
                        <Flex justify="center">
                            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                        </Flex>
                    </>
                )}
            </Container>

            {/* Why Choose Us Section */}
            <Box bg={useColorModeValue("white", "gray.900")} py={16}>
                <Container maxW="container.xl">
                    <SimpleGrid columns={{base: 1, md: 3}} spacing={8}>
                        <Flex align="center" direction="column" textAlign="center" p={4}>
                            <Icon as={FaRocket} w={10} h={10} color="blue.500" mb={4} />
                            <Heading size="md" mb={2}>Giao hàng thần tốc</Heading>
                            <Text color="gray.500">Giao hàng nội thành trong 2h. Miễn phí vận chuyển toàn quốc.</Text>
                        </Flex>
                        <Flex align="center" direction="column" textAlign="center" p={4}>
                            <Icon as={FaHeadset} w={10} h={10} color="purple.500" mb={4} />
                            <Heading size="md" mb={2}>Hỗ trợ 24/7</Heading>
                            <Text color="gray.500">Đội ngũ kỹ thuật viên chuyên nghiệp sẵn sàng hỗ trợ bạn bất cứ lúc nào.</Text>
                        </Flex>
                        <Flex align="center" direction="column" textAlign="center" p={4}>
                            <Icon as={FaTools} w={10} h={10} color="green.500" mb={4} />
                            <Heading size="md" mb={2}>Bảo hành dài hạn</Heading>
                            <Text color="gray.500">Cam kết bảo hành chính hãng. 1 đổi 1 trong 30 ngày đầu.</Text>
                        </Flex>
                    </SimpleGrid>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;