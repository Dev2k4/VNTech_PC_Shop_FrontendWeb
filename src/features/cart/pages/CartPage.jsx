// src/features/cart/pages/CartPage.jsx
import React, { useEffect, useState } from 'react';
import { 
    Box, Container, Heading, Image, Text, IconButton, Button, 
    Flex, Divider, useToast, useColorModeValue, VStack, HStack, Spacer, Icon
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, DeleteIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { FaShoppingBag } from 'react-icons/fa'; // Cần cài react-icons nếu chưa có
import CartService from '../../../services/cart.service';
import { formatCurrency } from '../../../utils/format';
import { useCart } from '../../../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const { fetchCartCount } = useCart();
    const toast = useToast();

    // --- THIẾT KẾ MÀU SẮC & GLASSMORPHISM ---
    const bgPage = useColorModeValue("gray.50", "#000000");
    
    // Màu nền thẻ sản phẩm (kết hợp trong suốt + mờ)
    const bgItem = useColorModeValue("white", "rgba(28, 28, 30, 0.6)");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    const textColor = useColorModeValue("gray.800", "gray.100");
    const subTextColor = useColorModeValue("gray.500", "gray.400");
    
    // Hiệu ứng Glass cho khung thanh toán
    const glassBg = useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(28, 28, 30, 0.7)");
    const glassFilter = "blur(20px) saturate(180%)";

    const fetchCart = async () => {
        try {
            const res = await CartService.getCart();
            if (res.success) setCart(res.data);
        } catch (error) {
            console.error("Lỗi tải giỏ hàng", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleUpdateQuantity = async (itemId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) return;

        // Check tồn kho
        const item = cart.cartItems.find(i => i.id === itemId);
        if (item && change > 0 && newQuantity > item.product.stock) {
            if (!toast.isActive('stock-limit')) {
                toast({
                    id: 'stock-limit',
                    title: "Giới hạn tồn kho",
                    description: `Kho chỉ còn ${item.product.stock} sản phẩm.`,
                    status: "warning",
                    duration: 1500,
                    isClosable: true,
                    position: "top"
                });
            }
            return; 
        }

        try {
            const res = await CartService.updateItem(itemId, newQuantity);
            if (res.success) {
                fetchCart(); 
                fetchCartCount(); 
            }
        } catch (error) {
            toast({
                title: "Lỗi",
                description: error.response?.data?.message,
                status: "error",
                duration: 1500,
            });
            fetchCart(); 
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (!window.confirm("Xóa sản phẩm này khỏi giỏ?")) return;
        try {
            await CartService.removeItem(itemId);
            fetchCart();
            fetchCartCount();
            toast({ title: "Đã xóa", status: "success", duration: 1000, position: 'top' });
        } catch (error) {
            toast({ title: "Lỗi xóa", status: "error" });
        }
    };

    if (loading) return <Flex justify="center" align="center" h="60vh" bg={bgPage}><Text>Đang tải...</Text></Flex>;

    // GIỎ HÀNG TRỐNG
    if (!cart || cart.cartItems.length === 0) {
        return (
            <Flex direction="column" align="center" justify="center" minH="80vh" bg={bgPage} textAlign="center" px={4}>
                <Box bg={useColorModeValue("gray.100", "whiteAlpha.100")} p={6} borderRadius="full" mb={6}>
                    <Icon as={FaShoppingBag} w={12} h={12} color="gray.400" />
                </Box>
                <Heading size="lg" mb={2} color={textColor}>Giỏ hàng trống</Heading>
                <Text color={subTextColor} mb={8}>Có vẻ bạn chưa thêm sản phẩm nào.</Text>
                <Button 
                    as={Link} to="/" 
                    size="lg" 
                    bg="blue.500" color="white" 
                    _hover={{ bg: "blue.600", transform: "translateY(-2px)" }}
                    rounded="full" px={10}
                >
                    Tiếp tục mua sắm
                </Button>
            </Flex>
        );
    }

    return (
        <Box bg={bgPage} minH="100vh" py={{ base: 6, md: 12 }}>
            <Container maxW="container.xl">
                <Flex align="center" mb={8} gap={4}>
                    <IconButton 
                        icon={<ArrowBackIcon />} 
                        variant="ghost" 
                        onClick={() => window.history.back()}
                        aria-label="Back"
                        display={{ base: "flex", md: "none" }}
                    />
                    <Heading size="lg" color={textColor}>Giỏ hàng ({cart.totalItems})</Heading>
                </Flex>
                
                <Flex direction={{ base: "column", lg: "row" }} gap={{ base: 6, lg: 10 }}>
                    
                    {/* --- DANH SÁCH SẢN PHẨM (CỘT TRÁI) --- */}
                    <VStack flex="2" align="stretch" spacing={4}>
                        {cart.cartItems.map((item) => (
                            <Flex 
                                key={item.id} 
                                bg={bgItem}
                                p={{ base: 3, md: 5 }}
                                borderRadius="2xl" 
                                border="1px solid"
                                borderColor={borderColor}
                                align="center"
                                justify="space-between"
                                shadow="sm"
                                transition="all 0.2s"
                                _hover={{ shadow: "md", borderColor: "blue.200" }}
                                direction={{ base: "column", sm: "row" }} // Mobile: Dọc, PC: Ngang
                                gap={{ base: 4, sm: 0 }}
                            >
                                {/* 1. Ảnh & Tên */}
                                <Flex align="center" flex="1" w="full">
                                    <Image 
                                        src={item.product.mainImage} 
                                        alt={item.product.productName} 
                                        boxSize={{ base: "70px", md: "90px" }} 
                                        objectFit="cover" 
                                        borderRadius="xl"
                                        bg="gray.100"
                                        fallbackSrc="https://via.placeholder.com/90"
                                    />
                                    <Box ml={4} flex="1">
                                        <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} color={textColor} noOfLines={2} mb={1}>
                                            {item.product.productName}
                                        </Text>
                                        <Text fontSize="sm" color={subTextColor}>
                                            {formatCurrency(item.price)}
                                        </Text>
                                        {item.product.stock < 5 && (
                                            <Text fontSize="xs" color="red.400" mt={1}>
                                                Còn lại {item.product.stock} cái
                                            </Text>
                                        )}
                                    </Box>
                                </Flex>

                                {/* 2. Bộ điều khiển số lượng & Giá & Xóa */}
                                <Flex 
                                    align="center" 
                                    justify={{ base: "space-between", sm: "flex-end" }} 
                                    w={{ base: "full", sm: "auto" }}
                                    gap={{ base: 0, sm: 6, md: 8 }}
                                    mt={{ base: 2, sm: 0 }}
                                >
                                    {/* Nút + / - (Style hình con nhộng) */}
                                    <HStack 
                                        bg={useColorModeValue("gray.50", "whiteAlpha.100")} 
                                        borderRadius="full" 
                                        p={1} 
                                        border="1px solid"
                                        borderColor={borderColor}
                                    >
                                        <IconButton 
                                            icon={<MinusIcon w={2.5} h={2.5} />} 
                                            size="xs" 
                                            variant="ghost"
                                            rounded="full"
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                                            isDisabled={item.quantity <= 1}
                                            aria-label="Giảm"
                                        />
                                        <Text w="30px" textAlign="center" fontWeight="bold" fontSize="sm">
                                            {item.quantity}
                                        </Text>
                                        <IconButton 
                                            icon={<AddIcon w={2.5} h={2.5} />} 
                                            size="xs" 
                                            variant="ghost"
                                            rounded="full"
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                                            isDisabled={item.quantity >= item.product.stock}
                                            aria-label="Tăng"
                                        />
                                    </HStack>

                                    {/* Giá tổng (Không bao giờ xuống dòng) */}
                                    <Text 
                                        fontWeight="bold" 
                                        color="blue.500" 
                                        fontSize="md" 
                                        minW="100px" 
                                        textAlign="right"
                                        whiteSpace="nowrap" // Chống xuống dòng
                                    >
                                        {formatCurrency(item.price * item.quantity)}
                                    </Text>

                                    {/* Nút xóa */}
                                    <IconButton 
                                        icon={<DeleteIcon />} 
                                        variant="ghost" 
                                        colorScheme="red" 
                                        size="sm"
                                        opacity={0.6}
                                        _hover={{ opacity: 1, bg: "red.50" }}
                                        onClick={() => handleRemoveItem(item.id)}
                                        aria-label="Xóa"
                                    />
                                </Flex>
                            </Flex>
                        ))}
                    </VStack>

                    {/* --- TỔNG KẾT ĐƠN HÀNG (CỘT PHẢI - STICKY) --- */}
                    <Box flex="1" maxW={{ lg: "380px" }} w="full">
                        <Box 
                            position="sticky" 
                            top="100px"
                            p={6} 
                            borderRadius="2xl" 
                            border="1px solid"
                            borderColor={borderColor}
                            bg={glassBg}            // Nền kính
                            backdropFilter={glassFilter} // Hiệu ứng mờ
                            shadow="lg"
                        >
                            <Heading size="md" mb={6} color={textColor}>Tóm tắt</Heading>
                            
                            <VStack spacing={4} align="stretch">
                                <Flex justify="space-between">
                                    <Text color={subTextColor}>Tạm tính</Text>
                                    <Text fontWeight="medium" color={textColor}>{formatCurrency(cart.totalPrice)}</Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text color={subTextColor}>Giảm giá</Text>
                                    <Text fontWeight="medium" color={textColor}>0 ₫</Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text color={subTextColor}>Vận chuyển</Text>
                                    <Text color="green.500" fontWeight="bold">Miễn phí</Text>
                                </Flex>
                                
                                <Divider borderColor={borderColor} />
                                
                                <Flex justify="space-between" align="center">
                                    <Text fontSize="lg" fontWeight="bold" color={textColor}>Tổng cộng</Text>
                                    <Text fontSize="xl" fontWeight="bold" color="blue.500">
                                        {formatCurrency(cart.totalPrice)}
                                    </Text>
                                </Flex>

                                <Button 
                                    w="full" 
                                    size="lg" 
                                    bg="blue.500" 
                                    color="white" 
                                    _hover={{ bg: "blue.600", transform: "scale(1.02)", shadow: "lg" }}
                                    _active={{ transform: "scale(0.98)" }}
                                    transition="all 0.2s"
                                    borderRadius="xl"
                                    as={Link} 
                                    to="/checkout"
                                    mt={4}
                                >
                                    Thanh toán ngay
                                </Button>
                                
                                <HStack justify="center" pt={2}>
                                    <Icon as={FaShoppingBag} color="gray.400" />
                                    <Text fontSize="xs" color="gray.500">Bảo mật thanh toán 100%</Text>
                                </HStack>
                            </VStack>
                        </Box>
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};

export default CartPage;