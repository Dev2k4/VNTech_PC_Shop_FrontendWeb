// src/features/product/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Container, Grid, Heading, Text, Spinner, Flex, Input, InputGroup,
  InputLeftElement, Select, useColorModeValue, Button, Image, Stack, SimpleGrid, Icon
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion"; // Hiệu ứng chuyển động
import { FaRocket, FaHeadset, FaTools, FaLaptop, FaGamepad, FaMicrochip } from "react-icons/fa"; // Icon đẹp

import ProductService from "../../../services/product.service";
import ProductCard from "../components/ProductCard";
import Pagination from "../../../components/common/Pagination";

// Component con: Hero Banner
const HeroSection = () => {
    const bgGradient = useColorModeValue("linear(to-r, blue.50, purple.50)", "linear(to-r, gray.900, blue.900)");
    return (
        <Box w="full" bg={bgGradient} pt={{ base: 20, md: 28 }} pb={{ base: 10, md: 20 }} overflow="hidden" position="relative">
            <Container maxW="container.xl">
                <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between" gap={10}>
                    <Box flex="1" as={motion.div} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                        <Text color="blue.500" fontWeight="bold" textTransform="uppercase" letterSpacing="wide" mb={2}>
                            Công nghệ tương lai
                        </Text>
                        <Heading as="h1" size="3xl" lineHeight="1.2" mb={4} fontWeight="800">
                            Build PC Cấu Hình <br />
                            <Text as="span" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
                                Siêu Khủng - Giá Tốt
                            </Text>
                        </Heading>
                        <Text fontSize="lg" color="gray.500" mb={8} maxW="lg">
                            Trải nghiệm gaming đỉnh cao và hiệu suất làm việc vượt trội với các dòng linh kiện mới nhất 2024.
                        </Text>
                        <Stack direction="row" spacing={4}>
                            <Button variant="brand" size="lg" px={8}>Mua Ngay</Button>
                            <Button variant="outline" size="lg" px={8} _hover={{bg: "whiteAlpha.100"}}>Xem Deal Hot</Button>
                        </Stack>
                    </Box>
                    {/* Ảnh minh họa (Bạn nên thay bằng ảnh thật) */}
                    <Box flex="1" position="relative" as={motion.div} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
                        {/* Vòng tròn gradient phía sau */}
                        <Box position="absolute" top="10%" left="10%" w="80%" h="80%" bgGradient="radial(blue.400, transparent 60%)" opacity={0.3} filter="blur(40px)" zIndex={0} />
                        <Image 
                            src="https://fptshop.com.vn/Uploads/Originals/2023/8/16/638277983637841963_msi-gaming-katana-15-b13v-den-dd.jpg" // Link ảnh mẫu laptop gaming
                            alt="Gaming Setup" 
                            position="relative" 
                            zIndex={1}
                            borderRadius="2xl"
                            boxShadow="2xl"
                            transform="rotate(-2deg)"
                            _hover={{ transform: "rotate(0deg) scale(1.02)", transition: "all 0.5s" }}
                        />
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};

// Component con: Bento Grid Categories
const CategoryGrid = () => {
    const categories = [
        { name: "Laptop Gaming", icon: FaLaptop, color: "red.500", bg: "red.50" },
        { name: "Linh Kiện PC", icon: FaMicrochip, color: "blue.500", bg: "blue.50" },
        { name: "Gaming Gear", icon: FaGamepad, color: "purple.500", bg: "purple.50" },
        { name: "Build PC", icon: FaTools, color: "orange.500", bg: "orange.50" },
    ];

    return (
        <Container maxW="container.xl" py={16}>
            <Heading textAlign="center" mb={10} size="xl">Danh mục nổi bật</Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
                {categories.map((cat, idx) => (
                    <Flex
                        key={idx}
                        direction="column"
                        align="center"
                        justify="center"
                        p={8}
                        bg={useColorModeValue("white", "gray.800")}
                        borderRadius="2xl"
                        border="1px solid"
                        borderColor={useColorModeValue("gray.100", "whiteAlpha.100")}
                        boxShadow="sm"
                        cursor="pointer"
                        transition="all 0.3s"
                        _hover={{ transform: "translateY(-5px)", boxShadow: "xl", borderColor: cat.color }}
                    >
                        <Box p={4} bg={useColorModeValue(cat.bg, "whiteAlpha.100")} borderRadius="full" mb={4}>
                            <Icon as={cat.icon} w={8} h={8} color={cat.color} />
                        </Box>
                        <Text fontWeight="bold" fontSize="lg">{cat.name}</Text>
                    </Flex>
                ))}
            </SimpleGrid>
        </Container>
    );
}

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 0,
    size: 12, // Tăng số lượng hiển thị
    productName: "",
    sortBy: "createdAt",
    sortDirection: "desc",
  });
  const [totalPages, setTotalPages] = useState(0);

  // Theme colors
  const bgColor = useColorModeValue("gray.50", "vntech.darkBg");
  const inputBg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await ProductService.getAll(filters);
        if (res?.data) {
          setProducts(res.data.content || []);
          setTotalPages(res.data.totalPages || 0);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    // Debounce
    const timer = setTimeout(() => fetchProducts(), 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Box bg={bgColor} minH="100vh">
      {/* 1. Hero Banner */}
      <HeroSection />

      {/* 2. Categories */}
      <CategoryGrid />

      {/* 3. Main Product List */}
      <Container maxW="container.xl" py={10} id="products">
        <Flex mb={8} justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box>
             <Heading size="lg" mb={1}>Sản phẩm mới về</Heading>
             <Text color="gray.500">Săn ngay kẻo lỡ</Text>
          </Box>

          <Flex gap={4} w={{ base: "100%", md: "auto" }}>
            <InputGroup w={{ base: "100%", md: "320px" }}>
              <InputLeftElement pointerEvents="none"><SearchIcon color="gray.400" /></InputLeftElement>
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                bg={inputBg}
                border="1px solid"
                borderColor={useColorModeValue("gray.200", "whiteAlpha.200")}
                borderRadius="full"
                _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                value={filters.productName}
                onChange={(e) => setFilters({ ...filters, productName: e.target.value, page: 0 })}
              />
            </InputGroup>

            <Select
              w="160px"
              bg={inputBg}
              borderRadius="full"
              borderColor={useColorModeValue("gray.200", "whiteAlpha.200")}
              value={filters.sortDirection}
              onChange={(e) => setFilters({ ...filters, sortDirection: e.target.value, page: 0 })}
            >
              <option value="desc">Mới nhất</option>
              <option value="asc">Cũ nhất</option>
            </Select>
          </Flex>
        </Flex>

        {loading ? (
          <Flex justify="center" py={20}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
          </Flex>
        ) : products.length === 0 ? (
          <Box textAlign="center" py={20} bg={inputBg} borderRadius="xl">
            <Text fontSize="xl" color="gray.500">Không tìm thấy sản phẩm nào phù hợp.</Text>
          </Box>
        ) : (
          <>
            <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Grid>

            <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </Container>
      
      {/* 4. Why Choose Us Section */}
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
                    <Heading size="md" mb={2}>Bảo hành vàng</Heading>
                    <Text color="gray.500">Lỗi 1 đổi 1 trong 30 ngày. Bảo hành chính hãng tận nơi.</Text>
                </Flex>
            </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;