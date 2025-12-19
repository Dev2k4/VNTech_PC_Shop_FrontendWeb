
 import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box, Container, Grid, Image, Text, Button, Heading, Flex, VStack, HStack,
  Spinner, Divider, useToast, useColorModeValue, Icon, Badge, SimpleGrid, useDisclosure
} from "@chakra-ui/react";
import { StarIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { FaCartPlus, FaShippingFast, FaShieldAlt } from "react-icons/fa";

import ProductService from "../../../services/product.service";
import ReviewService from "../../../services/review.service";
import { formatCurrency } from "../../../utils/format";
import { useCart } from "../../../context/CartContext";
import SpecificationTable from "../components/SpecificationTable";
import ReviewList from "../components/ReviewList";
import ReviewModal from "../components/ReviewModal";

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
  const [canReview, setCanReview] = useState(false); // State check quyền review
  
  const { addToCart } = useCart();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal control
  const toast = useToast();

  // Theme Colors
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const textColor = useColorModeValue("gray.800", "white");

  const fetchProduct = async () => {
    try {
        const res = await ProductService.getById(id);
        if (res.success) {
            setProduct(res.data);
            if (res.data.images && res.data.images.length > 0) {
                setSelectedImage(res.data.images[0].imageUrl);
            }
        }
    } catch (error) {
        toast({ title: "Lỗi tải sản phẩm", status: "error" });
    } finally {
        setLoading(false);
    }
  };

  // Check xem user có được review không
  const checkReviewPermission = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      try {
          const res = await ReviewService.checkCanReview(id);
          // Giả sử API trả về data: { canReview: true } hoặc boolean trực tiếp
          // Swagger bạn gửi return object, mình check trường hợp phổ biến
          if (res.success) {
              // Tuỳ vào response BE trả về gì, cứ log ra xem trước
              // Ở đây mình giả định BE trả về true/false trong data
              setCanReview(res.data); 
          }
      } catch (error) {
          console.log("User cannot review");
      }
  };

  useEffect(() => {
    fetchProduct();
    checkReviewPermission();
  }, [id]);

  const handleAddToCart = async () => {
    if (product.stock <= 0) {
        toast({ title: "Hết hàng", status: "warning" });
        return;
    }
    await addToCart(product, 1);
  };

  if (loading || !product) return <Flex justify="center" py={20}><Spinner size="xl" color="blue.500"/></Flex>;

  return (
    <Box minH="100vh" py={10}>
        <Container maxW="container.xl">
            {/* ... (Phần hiển thị ảnh và thông tin sản phẩm - GIỮ NGUYÊN) ... */}
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={10} mb={16}>
                {/* Image Gallery */}
                <Box>
                    <Box borderRadius="2xl" overflow="hidden" boxShadow="lg" mb={4} border="1px solid" borderColor={borderColor}>
                        <Image src={selectedImage || "https://via.placeholder.com/500"} alt={product.productName} w="full" h="400px" objectFit="contain" bg="white" />
                    </Box>
                    <HStack spacing={4} overflowX="auto" py={2}>
                        {product.images?.map((img) => (
                            <Box 
                                key={img.id} 
                                border={selectedImage === img.imageUrl ? "2px solid" : "1px solid"}
                                borderColor={selectedImage === img.imageUrl ? "blue.500" : borderColor}
                                borderRadius="md" cursor="pointer" onClick={() => setSelectedImage(img.imageUrl)}
                                boxSize="80px" flexShrink={0} bg="white" p={1}
                            >
                                <Image src={img.imageUrl} w="full" h="full" objectFit="contain" />
                            </Box>
                        ))}
                    </HStack>
                </Box>

                {/* Product Info */}
                <VStack align="start" spacing={6}>
                    <Box>
                        <Badge colorScheme="blue" mb={2}>{product.brand}</Badge>
                        <Heading size="xl" color={textColor} mb={2}>{product.productName}</Heading>
                        <Flex align="center" mb={4}>
                            <Text fontWeight="bold" fontSize="3xl" color="blue.500" mr={4}>{formatCurrency(product.salePrice)}</Text>
                            {product.originalPrice > product.salePrice && <Text textDecoration="line-through" color="gray.500">{formatCurrency(product.originalPrice)}</Text>}
                        </Flex>
                        <Flex align="center">
                            {[...Array(5)].map((_, i) => <StarIcon key={i} color={i < product.rating ? "yellow.400" : "gray.300"} />)}
                            <Text ml={2} color="gray.500">({product.rating} sao)</Text>
                        </Flex>
                    </Box>

                    <Button 
                        leftIcon={<FaCartPlus />} size="lg" colorScheme="blue" w="full" h="56px" fontSize="lg"
                        onClick={handleAddToCart} isDisabled={product.stock <= 0}
                    >
                        {product.stock > 0 ? "THÊM VÀO GIỎ" : "TẠM HẾT HÀNG"}
                    </Button>
                    
                    <SimpleGrid columns={2} spacing={4} mt={6} w="full">
                        <FeatureItem icon={CheckCircleIcon} text="Hàng chính hãng 100%" />
                        <FeatureItem icon={FaShippingFast} text="Giao hàng siêu tốc 2H" />
                        <FeatureItem icon={FaShieldAlt} text="Bảo hành tận nơi 12T" />
                        <FeatureItem icon={CheckCircleIcon} text="Lỗi 1 đổi 1 trong 30 ngày" />
                    </SimpleGrid>
                </VStack>
            </Grid>

            {/* Details & Reviews */}
            <Grid templateColumns={{ base: "1fr", lg: "1.5fr 1fr" }} gap={12} borderTop="1px solid" borderColor={borderColor} pt={16}>
              <Box>
                <Heading size="lg" mb={6}>Thông số kỹ thuật</Heading>
                <SpecificationTable specifications={product.specifications} />
                <Box mt={10}>
                    <Heading size="lg" mb={4}>Mô tả chi tiết</Heading>
                    <Text color="gray.400" lineHeight="1.8" whiteSpace="pre-line">{product.description}</Text>
                </Box>
              </Box>

              <Box>
                <Flex justify="space-between" align="center" mb={6}>
                    <Heading size="lg">Đánh giá</Heading>
                    {canReview && (
                        <Button size="sm" colorScheme="green" onClick={onOpen}>Viết đánh giá</Button>
                    )}
                </Flex>
                
                {/* List Review - Bạn cần truyền list review vào đây nếu product có field reviews, 
                    nếu không phải gọi API lấy list review riêng */}
                <ReviewList reviews={[]} /> 
                {/* Lưu ý: Nếu object product không chứa reviews, bạn cần gọi API getReviews trong useEffect và truyền vào đây */}

              </Box>
            </Grid>
        </Container>

        {/* REVIEW MODAL */}
        <ReviewModal 
            isOpen={isOpen} 
            onClose={onClose} 
            productId={product.id} 
            onSuccess={() => {
                fetchProduct(); // Reload lại sản phẩm để cập nhật rating
                checkReviewPermission(); // Check lại quyền (thường review xong sẽ mất quyền review tiếp)
            }} 
        />
    </Box>
  );
};

export default ProductDetailPage;