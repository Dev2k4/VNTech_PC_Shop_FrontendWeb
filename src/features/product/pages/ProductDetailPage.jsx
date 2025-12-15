// src/features/product/pages/ProductDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box, Container, Grid, Image, Text, Button, Heading, Flex, VStack, HStack,
  Spinner, Divider, useToast, useColorModeValue, Icon, Badge, SimpleGrid
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { FaCartPlus, FaCheckCircle, FaShippingFast, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";

import ProductService from "../../../services/product.service";
import { formatCurrency } from "../../../utils/format";
import { useCart } from "../../../context/CartContext";
import SpecificationTable from "../components/SpecificationTable";
import ReviewList from "../components/ReviewList";

const FeatureItem = ({ icon, text }) => (
    <HStack spacing={3} align="center">
        <Icon as={icon} color="blue.500" w={5} h={5} />
        <Text fontSize="sm" color="gray.500">{text}</Text>
    </HStack>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const { addToCart } = useCart();
  const toast = useToast();

  // Theme colors updated
  const bgColor = useColorModeValue("gray.50", "vntech.darkBg");
  const cardBg = useColorModeValue("white", "vntech.cardBg");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const textColor = useColorModeValue("gray.800", "white");
  const priceColor = useColorModeValue("blue.600", "blue.300");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await ProductService.getById(id);
        if (res?.data) {
          setProduct(res.data);
          const mainImg = res.data.images?.find((i) => i.isMain)?.imageUrl || res.data.images?.[0]?.imageUrl;
          setSelectedImage(mainImg);
        }
      } catch (error) {
        toast({ title: "Lỗi", description: "Không tìm thấy sản phẩm", status: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Flex justify="center" h="100vh" align="center" bg={bgColor}><Spinner size="xl" color="blue.500" /></Flex>;
  if (!product) return <Box p={10} color={textColor}>Sản phẩm không tồn tại</Box>;

  return (
    <Box bg={bgColor} minH="100vh" py={10} color={textColor}>
      <Container maxW="container.xl">
        {/* Product Main Info */}
        <Grid templateColumns={{ base: "1fr", md: "1.2fr 1fr" }} gap={12} mb={16}>
          
          {/* LEFT: Image Gallery */}
          <Box as={motion.div} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Flex
              bg={useColorModeValue("white", "black")}
              borderRadius="2xl"
              h={{ base: "350px", md: "500px" }}
              align="center"
              justify="center"
              mb={6}
              border="1px solid"
              borderColor={borderColor}
              boxShadow="lg"
              overflow="hidden"
              position="relative"
            >
               {/* Background Glow Effect */}
               <Box position="absolute" w="full" h="full" bgGradient="radial(circle, blue.500 0%, transparent 70%)" opacity={0.05} />
               
              <Image
                src={selectedImage || "https://via.placeholder.com/500"}
                alt={product.productName}
                maxH="85%"
                objectFit="contain"
                transition="transform 0.3s"
                _hover={{ transform: "scale(1.05)" }}
              />
            </Flex>
            
            <HStack spacing={4} overflowX="auto" py={2} justify="center">
              {product.images?.map((img, idx) => (
                <Box
                  key={idx}
                  w="80px" h="80px"
                  borderRadius="lg"
                  border="2px solid"
                  borderColor={selectedImage === img.imageUrl ? "blue.500" : "transparent"}
                  bg={cardBg}
                  cursor="pointer"
                  onClick={() => setSelectedImage(img.imageUrl)}
                  p={2}
                  transition="all 0.2s"
                  _hover={{ borderColor: "blue.300", transform: "translateY(-2px)" }}
                >
                  <Image src={img.imageUrl} w="100%" h="100%" objectFit="contain" />
                </Box>
              ))}
            </HStack>
          </Box>

          {/* RIGHT: Info */}
          <VStack align="stretch" spacing={6} as={motion.div} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Box>
              <Badge colorScheme="blue" mb={2} px={2} py={1} borderRadius="md">
                 {product.brand || "CHÍNH HÃNG"}
              </Badge>
              <Heading as="h1" size="2xl" fontWeight="800" lineHeight="1.2" mb={2}>
                {product.productName}
              </Heading>
              
              <HStack spacing={4} mt={3}>
                <HStack color="yellow.400" spacing={1}>
                   <Text fontWeight="bold" color={textColor} mr={1}>5.0</Text>
                   {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
                </HStack>
                <Text color="gray.500" fontSize="sm">|</Text>
                <Text color="gray.500" fontSize="sm">Đã bán {product.quantitySold || 100}+</Text>
              </HStack>
            </Box>

            <Box bg={useColorModeValue("gray.50", "whiteAlpha.50")} p={5} borderRadius="xl" border="1px dashed" borderColor="gray.600">
                <Text fontSize="4xl" fontWeight="bold" color={priceColor} lineHeight="1">
                  {formatCurrency(product.salePrice)}
                </Text>
                {product.originalPrice > product.salePrice && (
                  <HStack mt={2}>
                      <Text textDecoration="line-through" color="gray.500">
                        {formatCurrency(product.originalPrice)}
                      </Text>
                      <Badge colorScheme="red">-{Math.round(((product.originalPrice - product.salePrice)/product.originalPrice)*100)}%</Badge>
                  </HStack>
                )}
            </Box>

            {/* Description Short */}
            <Text color="gray.500" fontSize="md" noOfLines={4}>
                {product.description}
            </Text>

            {/* Action Buttons */}
            <Box pt={4}>
                <Button
                  size="lg"
                  w="full"
                  h="60px"
                  variant="brand" // Sử dụng variant mới
                  leftIcon={<FaCartPlus />}
                  onClick={() => addToCart(product, 1)}
                  fontSize="xl"
                  mb={4}
                >
                  THÊM VÀO GIỎ NGAY
                </Button>
                
                <SimpleGrid columns={2} spacing={4} mt={6}>
                    <FeatureItem icon={FaCheckCircle} text="Hàng chính hãng 100%" />
                    <FeatureItem icon={FaShippingFast} text="Giao hàng siêu tốc 2H" />
                    <FeatureItem icon={FaShieldAlt} text="Bảo hành tận nơi 12T" />
                    <FeatureItem icon={FaCheckCircle} text="Lỗi 1 đổi 1 trong 30 ngày" />
                </SimpleGrid>
            </Box>
          </VStack>
        </Grid>

        {/* Details & Reviews */}
        <Grid templateColumns={{ base: "1fr", lg: "1.5fr 1fr" }} gap={12} borderTop="1px solid" borderColor={borderColor} pt={16}>
          <Box>
            <Heading size="lg" mb={6}>Thông số kỹ thuật</Heading>
            {product.specifications?.length > 0 ? (
              <SpecificationTable specifications={product.specifications} />
            ) : (
              <Text color="gray.500">Đang cập nhật...</Text>
            )}
            
            <Box mt={10}>
                <Heading size="lg" mb={4}>Mô tả chi tiết</Heading>
                <Text color="gray.400" lineHeight="1.8" whiteSpace="pre-line">
                    {product.description}
                </Text>
            </Box>
          </Box>

          <Box>
            <ReviewList reviews={product.reviews} />
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductDetailPage;