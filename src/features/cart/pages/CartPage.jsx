// src/features/cart/pages/CartPage.jsx
import React, { useEffect, useState } from 'react';
import { 
    Box, Container, Heading, Image, Text, IconButton, Button, 
    Flex, Divider, useToast, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, DeleteIcon } from '@chakra-ui/icons';
import CartService from '../../../services/cart.service';
import { formatCurrency } from '../../../utils/format';
import { useCart } from '../../../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const { fetchCartCount } = useCart();
    const toast = useToast();

    // Color mode values
    const bgColor = useColorModeValue("apple.lightBg", "apple.bg");
    const cardBg = useColorModeValue("apple.lightCard", "apple.card");
    const textColor = useColorModeValue("apple.lightText", "white");
    const subTextColor = useColorModeValue("apple.lightSubText", "gray.400");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");

    const fetchCart = async () => {
        try {
            const res = await CartService.getCart();
            if (res.success) {
                setCart(res.data);
            }
        } catch (error) {
            console.error("Lỗi tải giỏ hàng", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // --- HÀM XỬ LÝ TĂNG GIẢM SỐ LƯỢNG ---
    const handleUpdateQuantity = async (itemId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;

        // Nếu giảm xuống < 1 thì không làm gì (hoặc có thể hỏi xóa)
        if (newQuantity < 1) return;

        try {
            // Gọi API cập nhật
            const res = await CartService.updateItem(itemId, newQuantity);
            
            if (res.success) {
                // Cập nhật lại state giỏ hàng ngay lập tức để UI mượt mà
                // (Cách này nhanh hơn gọi lại fetchCart)
                fetchCart(); 
                fetchCartCount(); // Cập nhật số nhỏ trên Header
            }
        } catch (error) {
            toast({
                title: "Lỗi cập nhật",
                description: error.response?.data?.message || "Không thể cập nhật số lượng",
                status: "error"
            });
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (!window.confirm("Bạn muốn xóa sản phẩm này?")) return;
        try {
            await CartService.removeItem(itemId);
            fetchCart();
            fetchCartCount();
            toast({ title: "Đã xóa sản phẩm", status: "success" });
        } catch (error) {
            toast({ title: "Lỗi xóa sản phẩm", status: "error" });
        }
    };

    if (loading) return <Box p={10} color={textColor} textAlign="center">Đang tải giỏ hàng...</Box>;

    if (!cart || cart.cartItems.length === 0) {
        return (
            <Box textAlign="center" py={20} bg={bgColor} minH="60vh">
                <Heading size="lg" mb={4} color={textColor}>Giỏ hàng của bạn đang trống</Heading>
                <Text mb={6} color={subTextColor}>Hãy thêm vài sản phẩm nhé!</Text>
                <Button as={Link} to="/" colorScheme="blue" borderRadius="full">Mua sắm ngay</Button>
            </Box>
        );
    }

    return (
        <Box bg={bgColor} minH="100vh" py={10}>
            <Container maxW="container.xl">
                <Heading mb={8} size="xl" color={textColor}>Giỏ hàng ({cart.totalItems} sản phẩm)</Heading>
                
                <Flex direction={{ base: "column", lg: "row" }} gap={8}>
                    {/* Danh sách sản phẩm */}
                    <Box flex="2">
                        {cart.cartItems.map((item) => (
                            <Flex 
                                key={item.id} 
                                bg={cardBg} 
                                p={4} 
                                mb={4} 
                                borderRadius="xl" 
                                align="center" 
                                justify="space-between"
                                border="1px solid"
                                borderColor={borderColor}
                            >
                                <Flex align="center" gap={4}>
                                    <Image 
                                        src={item.product.mainImage} 
                                        alt={item.product.productName} 
                                        boxSize="80px" 
                                        objectFit="cover" 
                                        borderRadius="md"
                                        fallbackSrc="https://via.placeholder.com/80"
                                    />
                                    <Box>
                                        <Text fontWeight="bold" color={textColor} noOfLines={1}>
                                            {item.product.productName}
                                        </Text>
                                        <Text fontSize="sm" color={subTextColor}>
                                            Đơn giá: {formatCurrency(item.price)}
                                        </Text>
                                    </Box>
                                </Flex>

                                <Flex align="center" gap={6}>
                                    {/* Nút Tăng/Giảm */}
                                    <Flex align="center" border="1px solid" borderColor={borderColor} borderRadius="lg">
                                        <IconButton 
                                            icon={<MinusIcon w={3} h={3} />} 
                                            size="sm" 
                                            variant="ghost"
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                                            isDisabled={item.quantity <= 1}
                                            aria-label="Giảm"
                                            color={textColor}
                                        />
                                        <Text w="40px" textAlign="center" fontWeight="bold" color={textColor}>
                                            {item.quantity}
                                        </Text>
                                        <IconButton 
                                            icon={<AddIcon w={3} h={3} />} 
                                            size="sm" 
                                            variant="ghost"
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                                            aria-label="Tăng"
                                            color={textColor}
                                        />
                                    </Flex>

                                    <Text fontWeight="bold" color="blue.500" w="100px" textAlign="right">
                                        {formatCurrency(item.totalPrice)}
                                    </Text>

                                    <IconButton 
                                        icon={<DeleteIcon />} 
                                        variant="ghost" 
                                        colorScheme="red" 
                                        onClick={() => handleRemoveItem(item.id)}
                                        aria-label="Xóa"
                                    />
                                </Flex>
                            </Flex>
                        ))}
                    </Box>

                    {/* Tổng tiền & Thanh toán */}
                    <Box flex="1">
                        <Box bg={cardBg} p={6} borderRadius="2xl" position="sticky" top="100px" border="1px solid" borderColor={borderColor}>
                            <Heading size="md" mb={6} color={textColor}>Tóm tắt đơn hàng</Heading>
                            <Flex justify="space-between" mb={3}>
                                <Text color={subTextColor}>Tạm tính</Text>
                                <Text color={textColor} fontWeight="bold">{formatCurrency(cart.totalPrice)}</Text>
                            </Flex>
                            <Flex justify="space-between" mb={6}>
                                <Text color={subTextColor}>Vận chuyển</Text>
                                <Text color="green.400">Miễn phí</Text>
                            </Flex>
                            <Divider borderColor={borderColor} mb={4} />
                            <Flex justify="space-between" mb={8}>
                                <Heading size="md" color={textColor}>Tổng cộng</Heading>
                                <Heading size="md" color="blue.500">{formatCurrency(cart.totalPrice)}</Heading>
                            </Flex>
                            <Button 
                                w="full" 
                                colorScheme="blue" 
                                borderRadius="full" 
                                size="lg" 
                                as={Link} 
                                to="/checkout"
                                _hover={{ transform: 'scale(1.02)' }}
                            >
                                Thanh toán ngay
                            </Button>
                        </Box>
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};

export default CartPage;