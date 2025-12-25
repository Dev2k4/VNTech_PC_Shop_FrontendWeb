
 import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box, Container, Grid, Image, Text, Button, Heading, Flex, VStack, HStack,
  Spinner, Divider, useToast, useColorModeValue, Icon, Badge, SimpleGrid, useDisclosure
} from "@chakra-ui/react";
import { StarIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { FaCartPlus, FaShippingFast, FaShieldAlt, FaRocket } from "react-icons/fa";

import ProductService from "../../../services/product.service";
import ReviewService from "../../../services/review.service";
import { formatCurrency } from "../../../utils/format";
import { useCart } from "../../../context/CartContext";
import SpecificationTable from "../components/SpecificationTable";
import ReviewList from "../components/ReviewList";
import ReviewModal from "../components/ReviewModal";
import ReviewStats from "../components/ReviewStats";

const FeatureItem = ({ icon, text }) => (
    <HStack spacing={3} align="center">
        <Icon as={icon} color="blue.500" w={5} h={5} />
        <Text fontSize="sm" color="gray.500">{text}</Text>
    </HStack>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [canReview, setCanReview] = useState(false); // State check quyền review
  
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);

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

  const fetchReviews = async () => {
    try {
        const res = await ReviewService.getProductReviews(id);
        // Kiểm tra cấu trúc response từ backend
        if (res && res.content) {
            setReviews(res.content);
        } else if (res && res.data && res.data.content) {
             setReviews(res.data.content);
        } else {
            setReviews([]);
        }
    } catch (error) {
        console.error("Error fetching reviews:", error);
    }
  };

  const fetchReviewSummary = async () => {
    try {
        const res = await ReviewService.getProductReviewSummary(id);
        if (res) {
           setReviewSummary(res);
        }
    } catch (error) {
        console.error("Error fetching review summary", error);
    }
  };

  // Check xem user có được review không
  const checkReviewPermission = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      try {
          const res = await ReviewService.checkCanReview(id);
          // Backend trả về true/false trực tiếp hoặc trong object
          setCanReview(res); 
      } catch (error) {
          console.log("User cannot review");
      }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    fetchReviewSummary();
    checkReviewPermission();
  }, [id]);

  const handleAddToCart = async () => {
    if (product.stock <= 0) {
        toast({ title: "Hết hàng", status: "warning" });
        return;
    }
    await addToCart(product, 1);
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) {
      toast({ title: "Hết hàng", status: "warning" });
      return;
    }
    // Chuyển sang Checkout với state Buy Now
    navigate("/checkout", { 
      state: { 
        buyNow: {
          product: product,
          quantity: 1
        } 
      } 
    });
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
                    <Box w="full">
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

                    <HStack spacing={4} w="full">
                        <Button 
                            leftIcon={<FaCartPlus />} size="lg" colorScheme="blue" variant="outline" flex="1" h="56px" fontSize="lg"
                            onClick={handleAddToCart} isDisabled={product.stock <= 0}
                            _hover={{ bg: "blue.50" }}
                        >
                            THÊM GIỎ HÀNG
                        </Button>
                        <Button 
                            leftIcon={<FaRocket />} size="lg" colorScheme="blue" flex="1" h="56px" fontSize="lg"
                            onClick={handleBuyNow} isDisabled={product.stock <= 0}
                            boxShadow="lg"
                            _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
                            transition="all 0.2s"
                        >
                            MUA NGAY
                        </Button>
                    </HStack>
                    
                    <SimpleGrid columns={2} spacing={4} mt={6} w="full">
                        <FeatureItem icon={CheckCircleIcon} text="Hàng chính hãng 100%" />
                        <FeatureItem icon={FaShippingFast} text="Giao hàng siêu tốc 2H" />
                        <FeatureItem icon={FaShieldAlt} text="Bảo hành tận nơi 12T" />
                        <FeatureItem icon={CheckCircleIcon} text="Lỗi 1 đổi 1 trong 30 ngày" />
                    </SimpleGrid>
                </VStack>
            </Grid>

            {/* Details & Reviews */}
            {/* Details & Reviews */}
            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={12} borderTop="1px solid" borderColor={borderColor} pt={16}>
               {/* Left Column: Description & Specs */}
              <Box>
                <Heading size="lg" mb={6}>Thông số kỹ thuật</Heading>
                <SpecificationTable specifications={product.specifications} />
                <Box mt={10}>
                    <Heading size="lg" mb={4}>Mô tả chi tiết</Heading>
                    <Text color="gray.400" lineHeight="1.8" whiteSpace="pre-line">{product.description}</Text>
                </Box>
              </Box>

              {/* Right Column: Can be used for something else or left empty, 
                  but for now let's just make the left column take up more space or 
                  remove the grid if we want full width. 
                  User asked for "review below description".
                  So I will close the Grid here and start a new Box for reviews.
               */}
            </Grid>

            {/* REVIEW SECTION BELOW */}
            <Box mt={16} borderTop="1px solid" borderColor={borderColor} pt={10}>
                <Flex justify="space-between" align="center" mb={8}>
                    <Heading size="lg">Đánh giá & Nhận xét</Heading>
                    {canReview && (
                        <Button size="md" colorScheme="blue" onClick={onOpen}>Viết đánh giá</Button>
                    )}
                </Flex>

                <Grid templateColumns={{ base: "1fr", lg: "1fr 2fr" }} gap={10}>
                    {/* Summary Stats */}
                    <Box>
                        {reviewSummary && <ReviewStats summary={reviewSummary} />}
                    </Box>

                    {/* Review List */}
                    <Box>
                        <ReviewList reviews={reviews} />
                        {reviews.length === 0 && !loading && (
                            <Text textAlign="center" color="gray.500" mt={4}>Chưa có đánh giá nào.</Text>
                        )}
                    </Box>
                </Grid>
            </Box>
        </Container>

        {/* REVIEW MODAL */}
        <ReviewModal 
            isOpen={isOpen} 
            onClose={onClose} 
            productId={product.id} 
            onSuccess={() => {
                fetchReviews(); 
                fetchReviewSummary(); 
                checkReviewPermission(); 
            }} 
        />
    </Box>
  );
};

export default ProductDetailPage;