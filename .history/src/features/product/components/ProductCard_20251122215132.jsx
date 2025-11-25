import React from 'react';
import {
    Box, Image, Text, Button, Flex, VStack, Badge
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/format';

const ProductCard = ({ product }) => {
    const { id, productName, salePrice, originalPrice, brand, stock, images } = product;
    
    const displayImage = (images && images.length > 0) ? images[0].imageUrl : "https://via.placeholder.com/300";
    const isOutOfStock = stock <= 0;

    return (
        <Box 
            bg="apple.card" // Màu xám đậm Apple
            borderRadius="2xl" // Bo góc cực mạnh
            overflow="hidden" 
            transition="all 0.3s ease"
            _hover={{ 
                transform: 'scale(1.02)', // Phóng to nhẹ khi hover
                bg: "apple.cardHover", 
                boxShadow: "0 10px 20px rgba(0,0,0,0.5)" 
            }}
            position="relative"
            h="100%"
            display="flex"
            flexDirection="column"
        >
            <Link to={`/products/${id}`} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Phần Ảnh - Đặt trên nền đen để nổi bật */}
                <Flex h="280px" align="center" justify="center" p={6} bg="blackAlpha.300">
                    <Image 
                        src={displayImage} 
                        alt={productName} 
                        maxH="100%" 
                        maxW="100%" 
                        objectFit="contain"
                        filter="drop-shadow(0 10px 10px rgba(0,0,0,0.5))" // Đổ bóng cho ảnh sản phẩm
                    />
                </Flex>

                {/* Phần thông tin */}
                <VStack p={6} align="center" spacing={1} flex={1}>
                    {/* Brand nhỏ màu cam hoặc xám */}
                    <Text fontSize="xs" fontWeight="bold" color="orange.400" textTransform="uppercase" letterSpacing="wider">
                        {isOutOfStock ? "Tạm hết hàng" : (brand || "New")}
                    </Text>

                    <Text 
                        fontSize="lg" 
                        fontWeight="semibold" 
                        color="white" 
                        textAlign="center"
                        noOfLines={2}
                        minH="54px"
                    >
                        {productName}
                    </Text>

                    <Flex align="center" gap={3} mt={2}>
                        <Text fontSize="xl" fontWeight="bold" color="white">
                            {formatCurrency(salePrice)}
                        </Text>
                        {originalPrice > salePrice && (
                            <Text textDecoration="line-through" color="apple.subText" fontSize="sm">
                                {formatCurrency(originalPrice)}
                            </Text>
                        )}
                    </Flex>
                </VStack>
            </Link>

            {/* Nút Mua - Pill Shape */}
            <Box p={6} pt={0}>
                <Button 
                    w="full" 
                    colorScheme="blue" 
                    borderRadius="full" // Nút tròn
                    isDisabled={isOutOfStock}
                    onClick={() => alert("Đã thêm vào giỏ")}
                    size="md"
                    fontSize="sm"
                >
                    {isOutOfStock ? "Hết hàng" : "Mua ngay"}
                </Button>
            </Box>
        </Box>
    );
};

export default ProductCard;