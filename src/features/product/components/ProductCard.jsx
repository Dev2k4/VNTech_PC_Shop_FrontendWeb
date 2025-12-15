// src/features/product/components/ProductCard.jsx
import React from "react";
import {
  Box, Image, Text, Button, Flex, VStack, useColorModeValue, useToast, Badge, IconButton, Tooltip
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaEye } from "react-icons/fa";
import { formatCurrency } from "../../../utils/format";
import { useCart } from "../../../context/CartContext";

const ProductCard = ({ product }) => {
  const { id, productName, salePrice, originalPrice, brand, stock, images } = product;
  const displayImage = images?.[0]?.imageUrl || "https://via.placeholder.com/300";
  const isOutOfStock = stock <= 0;
  const { addToCart } = useCart();
  const toast = useToast();

  // --- Styles ---
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "whiteAlpha.100");
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.500", "gray.400");

  const handleBuyNow = async (e) => {
    e.preventDefault();
    if (isOutOfStock) return;
    await addToCart(product, 1);
  };

  // Tính % giảm giá
  const discountPercent = originalPrice > salePrice 
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) 
    : 0;

  return (
    <Box
      w="full"
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="2xl"
      overflow="hidden"
      position="relative"
      transition="all 0.3s ease"
      role="group"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "xl",
        borderColor: "blue.400"
      }}
    >
      {/* Badges */}
      <Flex position="absolute" top={3} left={3} zIndex={2} gap={2}>
        {discountPercent > 0 && (
            <Badge colorScheme="red" variant="solid" borderRadius="md" px={2}>-{discountPercent}%</Badge>
        )}
        {stock > 0 && stock < 5 && (
            <Badge colorScheme="orange" variant="solid" borderRadius="md" px={2}>Sắp hết</Badge>
        )}
      </Flex>

      {/* Image Area */}
      <Link to={`/products/${id}`}>
        <Box 
            h="200px" 
            p={4} 
            bg={useColorModeValue("gray.50", "whiteAlpha.50")} 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            position="relative"
            overflow="hidden"
        >
            <Image
                src={displayImage}
                alt={productName}
                maxH="100%"
                objectFit="contain"
                transition="transform 0.5s ease"
                _groupHover={{ transform: "scale(1.1)" }}
            />
            
            {/* Quick Actions overlay on hover */}
            <Flex 
                position="absolute" 
                bottom={0} 
                left={0} 
                right={0} 
                bg="rgba(0,0,0,0.6)" 
                p={2} 
                justify="center" 
                gap={2}
                opacity={0}
                transform="translateY(100%)"
                transition="all 0.3s"
                _groupHover={{ opacity: 1, transform: "translateY(0)" }}
            >
                <Tooltip label="Xem chi tiết">
                    <IconButton icon={<FaEye />} size="sm" isRound colorScheme="blue" aria-label="View" />
                </Tooltip>
            </Flex>
        </Box>
      </Link>

      {/* Content Area */}
      <VStack p={4} align="stretch" spacing={2}>
        <Text fontSize="xs" fontWeight="bold" color="blue.500" textTransform="uppercase" letterSpacing="1px">
            {brand || "VNTECH"}
        </Text>
        
        <Link to={`/products/${id}`}>
            <Text 
                fontWeight="semibold" 
                fontSize="md" 
                color={textColor} 
                noOfLines={2} 
                h="44px" 
                _hover={{ color: "blue.500" }}
                title={productName}
            >
                {productName}
            </Text>
        </Link>

        <Flex align="center" justify="space-between" mt={2}>
            <Box>
                <Text fontWeight="bold" fontSize="lg" color="blue.500">
                    {formatCurrency(salePrice)}
                </Text>
                {originalPrice > salePrice && (
                    <Text fontSize="xs" color="gray.500" textDecoration="line-through">
                        {formatCurrency(originalPrice)}
                    </Text>
                )}
            </Box>
            
            <IconButton 
                icon={<FaShoppingCart />}
                colorScheme="blue"
                variant={isOutOfStock ? "ghost" : "solid"}
                isDisabled={isOutOfStock}
                onClick={handleBuyNow}
                aria-label="Add to cart"
                size="sm"
                isRound
                _hover={{ transform: "scale(1.1)" }}
            />
        </Flex>
      </VStack>
    </Box>
  );
};

export default ProductCard;