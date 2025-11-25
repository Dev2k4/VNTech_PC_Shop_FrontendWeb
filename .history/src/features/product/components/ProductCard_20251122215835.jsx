import React from 'react';
import {
    Box, Image, Text, Button, Flex, VStack
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/format';

const ProductCard = ({ product }) => {
    const { id, productName, salePrice, originalPrice, brand, stock, images } = product;
    
    // Lấy ảnh
    const displayImage = (images && images.length > 0) ? images[0].imageUrl : "https://via.placeholder.com/300";
    const isOutOfStock = stock <= 0;

    return (
        <Box 
            bg="apple.card" 
            borderRadius="2xl" 
            overflow="hidden" 
            transition="all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)"
            _hover={{ 
                transform: 'scale(1.03)', 
                bg: "apple.cardHover", 
                boxShadow: "0 20px 40px rgba(0,0,0,0.6)" 
            }}
            position="relative"
            h="420px" 
            display="flex"
            flexDirection="column"
            role="group" 
        >
            <Link to={`/products/${id}`} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                
               
                <Flex 
                    flex="1" 
                    align="center" 
                    justify="center" 
                    p={5}
                    bg="#0d0d0d" 
                    position="relative"
                >
                    <Image 
                        src={displayImage} 
                        alt={productName} 
                        maxH="100%" // Để ảnh tự bung lụa
                        maxW="100%" 
                        objectFit="contain"
                        transition="transform 0.5s ease"
                        _groupHover={{ transform: 'scale(1.1)' }} // Phóng to ảnh khi hover vào thẻ
                    />
                </Flex>

                {/* Phần thông tin - Gọn gàng phía dưới */}
                <VStack p={5} align="center" spacing={1} bg="apple.card" zIndex="1">
                    {/* Tên Brand nhỏ màu cam (đặc trưng store mới) */}
                    <Text fontSize="xs" fontWeight="bold" color="#d46b08" textTransform="uppercase" letterSpacing="1px">
                        {isOutOfStock ? "Tạm hết" : (brand || "New")}
                    </Text>

                    <Text 
                        fontSize="md" 
                        fontWeight="600" 
                        color="white" 
                        textAlign="center"
                        noOfLines={2}
                        h="48px"
                    >
                        {productName}
                    </Text>

                    <Flex align="baseline" gap={2} mt={1}>
                        <Text fontSize="lg" fontWeight="bold" color="white">
                            {formatCurrency(salePrice)}
                        </Text>
                        {originalPrice > salePrice && (
                            <Text textDecoration="line-through" color="gray.500" fontSize="xs">
                                {formatCurrency(originalPrice)}
                            </Text>
                        )}
                    </Flex>
                </VStack>
            </Link>

            {/* Nút Mua hiện ra khi Hover (Tùy chọn, cho giống Apple Store PC) */}
            <Box p={5} pt={0} display="flex" justifyContent="center">
                <Button 
                    variant="solid"
                    size="sm"
                    bg="apple.blue"
                    color="white"
                    borderRadius="full"
                    px={6}
                    _hover={{ bg: "blue.400" }}
                    isDisabled={isOutOfStock}
                    onClick={() => alert("Đã thêm")}
                >
                    Mua ngay
                </Button>
            </Box>
        </Box>
    );
};

export default ProductCard;