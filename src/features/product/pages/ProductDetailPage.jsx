import React, { useEffect, useState, useCallback } from "react";
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
import ReviewSummary from "../components/ReviewSummary";
import Pagination from "../../../components/common/Pagination"; // Import Pagination

const FeatureItem = ({ icon, text }) => (
    <HStack spacing={3} align="center">
        <Icon as={icon} color="blue.500" w={5} h={5} />
        <Text fontSize="sm" color="gray.500">{text}</Text>
    </HStack>
);

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const { addToCart } = useCart();
    
    // UI State
    const { isOpen, onOpen, onClose } = useDisclosure(); 
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
    const textColor = useColorModeValue("gray.800", "white");

    // Data State
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState("");
    
    // Review State
    const [reviews, setReviews] = useState([]);
    const [reviewSummary, setReviewSummary] = useState(null);
    const [canReview, setCanReview] = useState(false);
    
    // Pagination State for Reviews
    const [page, setPage] = useState(0); 
    const [totalPages, setTotalPages] = useState(0);
    const [reviewLoading, setReviewLoading] = useState(false);

    // Initial Data Fetch
    const fetchProductData = useCallback(async () => {
        try {
            const res = await ProductService.getById(id);
            if (res.success) {
                setProduct(res.data);
                if (res.data.images && res.data.images.length > 0) {
                    setSelectedImage(res.data.images[0].imageUrl);
                }
                // Sau khi có product, fetch luôn summary review
                fetchReviewSummary();
                fetchReviews(0); // Load trang đầu
                checkReviewPermission();
            }
        } catch (error) {
            toast({ title: "Lỗi tải sản phẩm", status: "error" });
        } finally {
            setLoading(false);
        }
    }, [id]);

    // Fetch Review Summary
    const fetchReviewSummary = async () => {
        try {
            const res = await ReviewService.getProductReviewSummary(id);
            if (res) setReviewSummary(res); // API trả về object luôn, ko bọc trong data/success
        } catch (e) { console.error("Error loading review summary", e); }
    };

    // Fetch Reviews List with Pagination
    const fetchReviews = async (pageIndex = 0) => {
        setReviewLoading(true);
        try {
            const res = await ReviewService.getProductReviews(id, { page: pageIndex, size: 5 });
             // API trả về Page<ReviewResponseDto>
             // Dựa vào code controller: return ResponseEntity.ok(response); -> response là Page object
             if (res && res.content) {
                 setReviews(res.content);
                 setTotalPages(res.totalPages);
                 setPage(pageIndex);
             }
        } catch (e) { console.error("Error loading reviews", e); }
        finally { setReviewLoading(false); }
    };

    // Check permission
    const checkReviewPermission = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setCanReview(false);
            return;
        }
        try {
            const res = await ReviewService.checkCanReview(id);
            if (res === true || res === false) { // Có thể API trả về boolean trực tiếp
                setCanReview(res);
            } else if (res && res.data !== undefined) {
                 setCanReview(res.data);
            } else {
                 setCanReview(!!res); // Fallback
            }
        } catch (error) {
            console.log("User cannot review or not logged in");
            setCanReview(false);
        }
    };

    useEffect(() => {
        fetchProductData();
    }, [fetchProductData]);

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
        navigate("/checkout", { 
            state: { buyNow: { product: product, quantity: 1 } } 
        });
    };

    const handleSuccessReview = () => {
        // Refresh lại dữ liệu sau khi đánh giá
        fetchReviewSummary();
        fetchReviews(0);
        checkReviewPermission(); // Thường đánh giá xong sẽ mất quyền đánh giá tiếp
        // Có thể reload product để cập nhật rating chung nếu cần thiết
        // product.rating = ... (tùy backend có trả về updated rating ko)
    };

    if (loading || !product) return <Flex justify="center" py={20}><Spinner size="xl" color="blue.500"/></Flex>;

    return (
        <Box minH="100vh" py={10}>
            <Container maxW="container.xl">
                {/* --- PRODUCT TOP SECTION (Images + Info) --- */}
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
                        </SimpleGrid>
                    </VStack>
                </Grid>

                {/* --- DETAILS & REVIEWS SECTION --- */}
                {/* Changed layout: Stacked instead of side-by-side on large screens primarily, but grid is okay.
                    User requested review below description. So I will change grid to single column or stack them.
                */}
                
                <Box borderTop="1px solid" borderColor={borderColor} pt={10}>
                    {/* 1. Description & Specs */}
                    <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={12} mb={16}>
                        <Box>
                            <Heading size="lg" mb={6}>Mô tả chi tiết</Heading>
                            <Text color="gray.500" lineHeight="1.8" whiteSpace="pre-line" fontSize="md">
                                {product.description}
                            </Text>
                        </Box>
                        <Box>
                            <Heading size="lg" mb={6}>Thông số kỹ thuật</Heading>
                            <SpecificationTable specifications={product.specifications} />
                        </Box>
                    </Grid>

                    {/* 2. Review Section (Full Width below) */}
                    <Box id="reviews">
                        <Flex justify="space-between" align="center" mb={8} wrap="wrap" gap={4}>
                            <Heading size="lg">Đánh giá & Nhận xét</Heading>
                            {canReview && (
                                <Button colorScheme="blue" onClick={onOpen} leftIcon={<Icon as={StarIcon} />}>
                                    Viết đánh giá
                                </Button>
                            )}
                        </Flex>

                        {/* Summary Widget */}
                        <Box mb={10}>
                            <ReviewSummary summary={reviewSummary} />
                        </Box>

                        {/* Review List */}
                        <Box>
                            {reviewLoading ? (
                                <Flex justify="center" py={10}><Spinner color="blue.500" /></Flex>
                            ) : (
                                <>
                                    <ReviewList reviews={reviews} />
                                    {/* Pagination */}
                                    <Box mt={6} display="flex" justifyContent="flex-end">
                                        <Pagination 
                                            currentPage={page} 
                                            totalPages={totalPages} 
                                            onPageChange={(p) => fetchReviews(p)} 
                                        />
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Container>

            {/* REVIEW MODAL */}
            <ReviewModal 
                isOpen={isOpen} 
                onClose={onClose} 
                productId={product.id} 
                onSuccess={handleSuccessReview} 
            />
        </Box>
    );
};

export default ProductDetailPage;