import React from 'react';
import {
    Box, Image, Badge, Text, Stack, Button, Icon, Flex
} from '@chakra-ui/react';
import { FaCartPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/format';

const ProductCard = ({ product }) => {
    // Mapping dữ liệu từ Backend DTO
    const { id, productName, salePrice, originalPrice, brand, stock, images } = product;
    
    // Lấy ảnh đầu tiên làm ảnh đại diện (nếu không có thì dùng ảnh mẫu)
    const displayImage = (images && images.length > 0) ? images[0].imageUrl : "https://via.placeholder.com/300";
    
    const isOutOfStock = stock <= 0;
    // Tính % giảm giá
    const discount = originalPrice > salePrice 
        ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) 
        : 0;

    return (
        <Box 
            borderWidth="1px" 
            borderRadius="lg" 
            overflow="hidden" 
            bg="white" 
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
            position="relative"
        >
            {/* Link sang trang chi tiết */}
            <Link to={`/products/${id}`}>
                <Box h="250px" overflow="hidden" position="relative" p={4}>
                    <Image 
                        src={displayImage} 
                        alt={productName} 
                        w="100%" 
                        h="100%" 
                        objectFit="contain" 
                        transition="0.3s"
                        _hover={{ transform: 'scale(1.05)' }}
                    />
                    {/* Badge giảm giá */}
                    {discount > 0 && (
                        <Badge position="absolute" top={2} right={2} colorScheme="red" fontSize="0.8em" borderRadius="full" px={2}>
                            -{discount}%
                        </Badge>
                    )}
                </Box>
            </Link>

            <Box p="5">
                <Flex align="baseline" mb={2}>
                    <Badge colorScheme={isOutOfStock ? "gray" : "green"}>
                        {isOutOfStock ? "Hết hàng" : "Còn hàng"}
                    </Badge>
                    <Text ml={2} textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.500">
                        {brand || "VNTech"}
                    </Text>
                </Flex>

                <Link to={`/products/${id}`}>
                    <Text 
                        mt={1} 
                        fontWeight="semibold" 
                        as="h4" 
                        lineHeight="tight" 
                        noOfLines={2} 
                        minH="45px"
                        _hover={{ color: 'blue.500' }}
                        title={productName}
                    >
                        {productName}
                    </Text>
                </Link>

                <Stack direction="row" align="center" mt={2}>
                    <Text fontSize="xl" fontWeight="bold" color="red.500">
                        {formatCurrency(salePrice)}
                    </Text>
                    {discount > 0 && (
                        <Text textDecoration="line-through" color="gray.400" fontSize="sm">
                            {formatCurrency(originalPrice)}
                        </Text>
                    )}
                </Stack>

                <Button 
                    mt={4} 
                    w="full" 
                    colorScheme="blue" 
                    variant="outline"
                    leftIcon={<Icon as={FaCartPlus} />}
                    isDisabled={isOutOfStock}
                    onClick={() => alert(`Đã thêm ${productName} vào giỏ (Chức năng đang phát triển)`)}
                    _hover={{ bg: "blue.500", color: "white" }}
                >
                    Thêm vào giỏ
                </Button>
            </Box>
        </Box>
    );
};

export default ProductCard;