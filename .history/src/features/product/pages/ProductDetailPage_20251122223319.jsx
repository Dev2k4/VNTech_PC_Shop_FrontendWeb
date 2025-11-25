import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box, Container, Grid, Image, Text, Button, Heading, Flex, 
    Badge, VStack, HStack, Spinner, Divider, useToast
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import ProductService from '../../../services/product.service';
import { formatCurrency } from '../../../utils/format';
import { useCart } from '../../../context/CartContext';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState('');
    
    const { fetchCart } = useCart(); // Sau này dùng để thêm vào giỏ
    const toast = useToast();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await ProductService.getById(id);
                if (res && res.data) {
                    setProduct(res.data);
                    // Chọn ảnh main làm mặc định
                    const mainImg = res.data.images?.find(i => i.isMain)?.imageUrl || res.data.images?.[0]?.imageUrl;
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

    if (loading) return <Flex justify="center" h="50vh" align="center"><Spinner size="xl" color="apple.blue" /></Flex>;
    if (!product) return <Box p={10} color="white">Sản phẩm không tồn tại</Box>;

    return (
        <Box bg="apple.bg" minH="100vh" py={10} color="white">
            <Container maxW="container.xl">
                <Grid templateColumns={{ base: "1fr", md: "1.5fr 1fr" }} gap={12}>
                    
                    {/* CỘT TRÁI: GALLERY ẢNH */}
                    <Box>
                        {/* Ảnh Lớn */}
                        <Flex 
                            bg="black" 
                            borderRadius="3xl" 
                            h={{ base: "300px", md: "500px" }} 
                            align="center" 
                            justify="center" 
                            mb={4}
                            border="1px solid"
                            borderColor="whiteAlpha.200"
                        >
                            <Image 
                                src={selectedImage || "https://via.placeholder.com/500"} 
                                alt={product.productName} 
                                maxH="80%" 
                                objectFit="contain"
                                filter="drop-shadow(0 0 20px rgba(255,255,255,0.1))"
                            />
                        </Flex>

                        {/* List ảnh nhỏ */}
                        <HStack spacing={4} overflowX="auto" py={2}>
                            {product.images?.map((img, idx) => (
                                <Box 
                                    key={idx} 
                                    w="80px" h="80px" 
                                    borderRadius="xl" 
                                    border="2px solid" 
                                    borderColor={selectedImage === img.imageUrl ? "apple.blue" : "transparent"}
                                    bg="apple.card"
                                    cursor="pointer"
                                    onClick={() => setSelectedImage(img.imageUrl)}
                                    p={2}
                                    flexShrink={0}
                                >
                                    <Image src={img.imageUrl} w="100%" h="100%" objectFit="contain" />
                                </Box>
                            ))}
                        </HStack>
                    </Box>

                    {/* CỘT PHẢI: THÔNG TIN (Sticky) */}
                    <Box>
                        <VStack align="stretch" spacing={6} position={{ md: "sticky" }} top="100px">
                            <Box>
                                <Text color="#d46b08" fontWeight="bold" textTransform="uppercase" fontSize="sm" letterSpacing="1px">
                                    {product.brand || "New"}
                                </Text>
                                <Heading as="h1" size="2xl" mt={2} mb={2} fontWeight="700">
                                    {product.productName}
                                </Heading>
                                <HStack>
                                    <StarIcon color="yellow.400" />
                                    <Text fontSize="sm" color="gray.400">5.0 (10 đánh giá)</Text>
                                </HStack>
                            </Box>

                            <Box>
                                <Text fontSize="3xl" fontWeight="bold" color="white">
                                    {formatCurrency(product.salePrice)}
                                </Text>
                                {product.originalPrice > product.salePrice && (
                                    <Text textDecoration="line-through" color="gray.500">
                                        {formatCurrency(product.originalPrice)}
                                    </Text>
                                )}
                            </Box>

                            <Divider borderColor="whiteAlpha.200" />

                            <Box>
                                <Heading size="sm" mb={3} color="gray.300">Mô tả</Heading>
                                <Text color="gray.400" lineHeight="1.8">
                                    {product.description}
                                </Text>
                            </Box>

                            <Box pt={4}>
                                <Button 
                                    w="full" 
                                    h="56px"
                                    bg="apple.blue" 
                                    color="white" 
                                    borderRadius="full"
                                    fontSize="lg"
                                    _hover={{ bg: "blue.400", transform: "scale(1.02)" }}
                                    onClick={() => toast({ title: "Đã thêm vào giỏ", status: "success" })}
                                >
                                    Thêm vào Giỏ hàng
                                </Button>
                                <Text mt={3} textAlign="center" fontSize="xs" color="gray.500">
                                    Giao hàng miễn phí. Đổi trả trong 15 ngày.
                                </Text>
                            </Box>
                        </VStack>
                    </Box>

                </Grid>
            </Container>
        </Box>
    );
};

export default ProductDetailPage;