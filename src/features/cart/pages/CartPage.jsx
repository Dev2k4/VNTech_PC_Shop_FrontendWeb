// src/features/cart/pages/CartPage.jsx
import React, { useEffect, useState } from 'react';
import { 
    Box, Container, Heading, Image, Text, IconButton, Button, 
    Flex, Divider, useToast, useColorModeValue, VStack, HStack, Icon, Badge
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, DeleteIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { FaShoppingBag, FaCreditCard, FaTruck } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import CartService from '../../../services/cart.service';
import { formatCurrency } from '../../../utils/format';
import { useCart } from '../../../context/CartContext';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const { fetchCartCount } = useCart();
    const toast = useToast();

    // --- THEME COLORS ---
    const pageBg = useColorModeValue("gray.50", "vntech.darkBg");
    const cardBg = useColorModeValue("white", "vntech.cardBg"); // Màu card tối
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    const textColor = useColorModeValue("gray.800", "white");
    const subTextColor = useColorModeValue("gray.500", "gray.400");

    const fetchCart = async () => {
        try {
            const res = await CartService.getCart();
            if (res.success) setCart(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCart(); }, []);

    const handleUpdateQuantity = async (itemId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) return;
        
        // Optimistic UI update (optional) or just wait for reload
        try {
            await CartService.updateItem(itemId, newQuantity);
            fetchCart(); 
            fetchCartCount();
        } catch (error) {
            toast({ title: "Lỗi", description: error.response?.data?.message, status: "error" });
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (!window.confirm("Xóa sản phẩm này?")) return;
        try {
            await CartService.removeItem(itemId);
            fetchCart();
            fetchCartCount();
            toast({ title: "Đã xóa", status: "success", position: 'top' });
        } catch (error) {
            toast({ title: "Lỗi xóa", status: "error" });
        }
    };

    if (loading) return <Flex justify="center" align="center" h="100vh" bg={pageBg}><Text color="gray.500">Đang tải giỏ hàng...</Text></Flex>;

    if (!cart || cart.cartItems.length === 0) {
        return (
            <Flex direction="column" align="center" justify="center" minH="100vh" bg={pageBg} px={4}>
                <Box bg={useColorModeValue("gray.100", "whiteAlpha.100")} p={8} borderRadius="full" mb={6}>
                    <Icon as={FaShoppingBag} w={16} h={16} color="gray.400" />
                </Box>
                <Heading size="lg" mb={2} color={textColor}>Giỏ hàng trống</Heading>
                <Text color={subTextColor} mb={8}>Chưa có siêu phẩm nào trong giỏ hàng của bạn.</Text>
                <Button as={Link} to="/" size="lg" variant="brand" rounded="full" px={10}>
                    Khám phá ngay
                </Button>
            </Flex>
        );
    }

    return (
        <Box bg={pageBg} minH="100vh" py={{ base: 6, md: 12 }}>
            <Container maxW="container.xl">
                <Flex align="center" mb={8} gap={4}>
                    <IconButton icon={<ArrowBackIcon />} variant="ghost" onClick={() => window.history.back()} aria-label="Back" color={textColor} />
                    <Heading size="lg" color={textColor}>Giỏ hàng ({cart.totalItems})</Heading>
                </Flex>
                
                <Flex direction={{ base: "column", lg: "row" }} gap={8}>
                    {/* LIST ITEMS */}
                    <VStack flex="2" align="stretch" spacing={4}>
                        {cart.cartItems.map((item) => (
                            <Flex 
                                key={item.id} 
                                bg={cardBg} p={4} borderRadius="2xl" 
                                border="1px solid" borderColor={borderColor}
                                align="center" justify="space-between"
                                direction={{ base: "column", sm: "row" }} gap={4}
                                transition="all 0.2s" _hover={{ borderColor: "blue.500", transform: "translateY(-2px)" }}
                            >
                                <Flex align="center" flex="1" w="full">
                                    <Box p={2} bg="white" borderRadius="xl" mr={4}>
                                        <Image src={item.product.mainImage} boxSize="80px" objectFit="contain" />
                                    </Box>
                                    <Box flex="1">
                                        <Text fontWeight="bold" color={textColor} noOfLines={2} mb={1}>
                                            {item.product.productName}
                                        </Text>
                                        <Text fontSize="sm" color="blue.400" fontWeight="semibold">
                                            {formatCurrency(item.price)}
                                        </Text>
                                    </Box>
                                </Flex>

                                <Flex align="center" gap={6} w={{ base: "full", sm: "auto" }} justify="space-between">
                                    <HStack bg={useColorModeValue("gray.100", "black")} borderRadius="full" p={1}>
                                        <IconButton icon={<MinusIcon w={2} />} size="xs" variant="ghost" isRound onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)} />
                                        <Text w="30px" textAlign="center" fontSize="sm" fontWeight="bold" color={textColor}>{item.quantity}</Text>
                                        <IconButton icon={<AddIcon w={2} />} size="xs" variant="ghost" isRound onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)} />
                                    </HStack>
                                    
                                    <Text fontWeight="bold" color={textColor} minW="100px" textAlign="right">
                                        {formatCurrency(item.price * item.quantity)}
                                    </Text>

                                    <IconButton icon={<DeleteIcon />} variant="ghost" colorScheme="red" size="sm" onClick={() => handleRemoveItem(item.id)} />
                                </Flex>
                            </Flex>
                        ))}
                    </VStack>

                    {/* ORDER SUMMARY */}
                    <Box flex="1" maxW={{ lg: "400px" }} w="full">
                        <Box 
                            position="sticky" top="100px" p={6} borderRadius="2xl" 
                            bg={cardBg} border="1px solid" borderColor={borderColor} shadow="xl"
                        >
                            <Heading size="md" mb={6} color={textColor}>Thanh toán</Heading>
                            
                            <VStack spacing={4} align="stretch" mb={6}>
                                <Flex justify="space-between" color={subTextColor}>
                                    <Text>Tạm tính</Text>
                                    <Text color={textColor}>{formatCurrency(cart.totalPrice)}</Text>
                                </Flex>
                                <Flex justify="space-between" color={subTextColor}>
                                    <Text>Giảm giá</Text>
                                    <Text color="green.400">0 ₫</Text>
                                </Flex>
                                <Flex justify="space-between" color={subTextColor}>
                                    <Text>Vận chuyển</Text>
                                    <Badge colorScheme="green">Miễn phí</Badge>
                                </Flex>
                                <Divider borderColor={borderColor} />
                                <Flex justify="space-between" align="center">
                                    <Text fontSize="lg" fontWeight="bold" color={textColor}>Tổng cộng</Text>
                                    <Text fontSize="2xl" fontWeight="bold" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
                                        {formatCurrency(cart.totalPrice)}
                                    </Text>
                                </Flex>
                            </VStack>

                            <Button 
                                w="full" size="lg" variant="brand" 
                                as={Link} to="/checkout" h="56px" fontSize="lg"
                                rightIcon={<Icon as={FaCreditCard} />}
                            >
                                TIẾN HÀNH ĐẶT HÀNG
                            </Button>
                            
                            <HStack justify="center" mt={4} spacing={4} color="gray.500">
                                <Icon as={FaTruck} /><Text fontSize="xs">Freeship toàn quốc</Text>
                            </HStack>
                        </Box>
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};

export default CartPage;