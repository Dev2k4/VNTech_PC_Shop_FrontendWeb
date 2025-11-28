import React, { useEffect, useState } from 'react';
import { 
    Box, Container, Heading, Image, Text, IconButton, Button, 
    Flex, Divider, useToast, useColorModeValue
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
    const quantityBorderColor = useColorModeValue("gray.300", "gray.600");

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

    useEffect(() => {
        fetchCart();
    }, []);

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await CartService.updateItem(itemId, newQuantity);
            fetchCart();
        } catch (error) {
            toast({ title: "Lỗi cập nhật", status: "error" });
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (!confirm("Bạn muốn xóa sản phẩm này?")) return;
        try {
            await CartService.removeItem(itemId);
            fetchCart();
            fetchCartCount();
            toast({ title: "Đã xóa sản phẩm", status: "info" });
        } catch (error) {
            toast({ title: "Lỗi xóa", status: "error" });
        }
    };

    if (loading) return <Box p={10} color={textColor} textAlign="center">Đang tải giỏ hàng...</Box>;

    if (!cart || cart.cartItems.length === 0) {
        return (
            <Box minH="60vh" bg={bgColor} pt={20} textAlign="center" color={textColor}>
                <Heading size="lg" mb={4}>Giỏ hàng của bạn đang trống.</Heading>
                <Button as={Link} to="/" colorScheme="blue" borderRadius="full">Mua sắm ngay</Button>
            </Box>
        );
    }

    return (
        <Box bg={bgColor} minH="100vh" py={10} color={textColor}>
            <Container maxW="container.lg">
                <Heading mb={8} borderBottom="1px solid" borderColor={borderColor} pb={4}>
                    Xem lại giỏ hàng của bạn.
                </Heading>

                <Flex direction={{ base: "column", lg: "row" }} gap={10}>
                    {/* Danh sách sản phẩm */}
                    <Box flex="2">
                        {cart.cartItems.map((item) => (
                            <Flex key={item.id} py={6} borderBottom="1px solid" borderColor={borderColor} align="center">
                                <Image 
                                    src={item.product.mainImage || "https://via.placeholder.com/100"} 
                                    boxSize="100px" 
                                    objectFit="contain" 
                                    bg="white" 
                                    borderRadius="lg"
                                    mr={6}
                                />
                                <Box flex="1">
                                    <Heading size="md" mb={1}>{item.product.productName}</Heading>
                                    <Text color={subTextColor} fontSize="sm" mb={2}>Giao hàng miễn phí</Text>
                                    <Flex align="center" gap={4}>
                                        <Flex align="center" border="1px solid" borderColor={quantityBorderColor} borderRadius="full" px={2} py={1}>
                                            <IconButton 
                                                icon={<MinusIcon w={3} h={3} />} 
                                                size="xs" 
                                                variant="ghost" 
                                                color={textColor}
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                            />
                                            <Text mx={3} fontSize="sm">{item.quantity}</Text>
                                            <IconButton 
                                                icon={<AddIcon w={3} h={3} />} 
                                                size="xs" 
                                                variant="ghost" 
                                                color={textColor}
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                            />
                                        </Flex>
                                        <Button 
                                            size="sm" 
                                            variant="link" 
                                            color="red.400" 
                                            leftIcon={<DeleteIcon />}
                                            onClick={() => handleRemoveItem(item.id)}
                                        >
                                            Xóa
                                        </Button>
                                    </Flex>
                                </Box>
                                <Box textAlign="right">
                                    <Text fontWeight="bold" fontSize="lg">
                                        {formatCurrency(item.price * item.quantity)}
                                    </Text>
                                </Box>
                            </Flex>
                        ))}
                    </Box>

                    {/* Tổng tiền */}
                    <Box flex="1">
                        <Box bg={cardBg} p={6} borderRadius="2xl" position="sticky" top="100px">
                            <Heading size="md" mb={6}>Tóm tắt đơn hàng</Heading>
                            <Flex justify="space-between" mb={3}>
                                <Text color={subTextColor}>Tạm tính</Text>
                                <Text>{formatCurrency(cart.totalPrice)}</Text>
                            </Flex>
                            <Flex justify="space-between" mb={6}>
                                <Text color={subTextColor}>Vận chuyển</Text>
                                <Text color="green.400">Miễn phí</Text>
                            </Flex>
                            <Divider borderColor={borderColor} mb={4} />
                            <Flex justify="space-between" mb={8}>
                                <Heading size="md">Tổng cộng</Heading>
                                <Heading size="md" color="apple.blue">{formatCurrency(cart.totalPrice)}</Heading>
                            </Flex>
                            <Button w="full" colorScheme="blue" borderRadius="full" size="lg" as={Link} to="/checkout">
                                Thanh toán
                            </Button>
                        </Box>
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};

export default CartPage;