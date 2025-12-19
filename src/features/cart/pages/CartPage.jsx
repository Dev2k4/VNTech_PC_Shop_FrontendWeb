import React, { useEffect, useState } from 'react';
import { 
    Box, Container, Heading, Image, Text, IconButton, Button, 
    Flex, Divider, useToast, useColorModeValue, VStack, HStack, Icon, Badge, Checkbox, Spinner
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, DeleteIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { FaCreditCard, FaTruck, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import CartService from '../../../services/cart.service';
import { formatCurrency } from '../../../utils/format';
import { useCart } from '../../../context/CartContext';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const { fetchCartCount } = useCart();
    const toast = useToast();

    // Theme Colors
    const pageBg = useColorModeValue("gray.50", "vntech.darkBg");
    const cardBg = useColorModeValue("white", "vntech.cardBg");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    const textColor = useColorModeValue("gray.800", "white");

    const fetchCart = async () => {
        try {
            const res = await CartService.getCart();
            if (res.success) {
                setCart(res.data);
                fetchCartCount(); // Đồng bộ số lượng trên Header
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Xử lý tăng giảm số lượng
    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await CartService.updateItem(itemId, newQuantity);
            fetchCart(); // Load lại để tính lại tiền
        } catch (error) {
            toast({ title: 'Lỗi', description: 'Không thể cập nhật số lượng', status: 'error' });
        }
    };

    // Xử lý xóa item
    const handleRemoveItem = async (itemId) => {
        try {
            await CartService.removeItem(itemId);
            toast({ title: 'Đã xóa', status: 'success', duration: 1000 });
            fetchCart();
        } catch (error) {
            toast({ title: 'Lỗi', description: 'Không thể xóa sản phẩm', status: 'error' });
        }
    };

    // --- LOGIC MỚI: CHỌN SẢN PHẨM ---
    const handleSelectItem = async (itemId, isChecked) => {
        try {
            // Gọi API select update lên BE
            await CartService.updateSelected([itemId], isChecked);
            fetchCart(); // Load lại để BE trả về tổng tiền mới
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectAll = async (e) => {
        const isChecked = e.target.checked;
        const allIds = cart.cartItems.map(item => item.id);
        try {
            await CartService.updateSelected(allIds, isChecked);
            fetchCart();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <Flex justify="center" py={20} bg={pageBg} minH="100vh"><Spinner size="xl" color="blue.500"/></Flex>;

    // Kiểm tra xem có đang chọn tất cả không
    const isAllSelected = cart?.cartItems?.length > 0 && cart?.cartItems?.every(item => item.selected);
    const hasSelectedItems = cart?.selectedItems > 0;

    return (
        <Box bg={pageBg} minH="100vh" py={10}>
            <Container maxW="container.xl">
                <Button leftIcon={<ArrowBackIcon />} variant="ghost" mb={6} as={Link} to="/">Tiếp tục mua sắm</Button>
                <Heading mb={8} size="lg" color={textColor}>Giỏ hàng của bạn</Heading>

                {!cart || cart.cartItems.length === 0 ? (
                    <Box textAlign="center" py={20} bg={cardBg} borderRadius="2xl">
                        <Text color="gray.500" mb={4}>Giỏ hàng đang trống</Text>
                        <Button as={Link} to="/" colorScheme="blue">Mua ngay</Button>
                    </Box>
                ) : (
                    <Flex direction={{ base: "column", lg: "row" }} gap={8}>
                        {/* LEFT: CART ITEMS */}
                        <Box flex="2">
                            {/* Header List */}
                            <Flex bg={cardBg} p={4} borderRadius="xl" mb={4} align="center" border="1px solid" borderColor={borderColor}>
                                <Checkbox 
                                    isChecked={isAllSelected} 
                                    onChange={handleSelectAll} 
                                    colorScheme="blue" 
                                    mr={4}
                                >
                                    Tất cả ({cart.totalItems} sản phẩm)
                                </Checkbox>
                                <Icon as={FaTrash} color="gray.400" cursor="pointer" ml="auto" />
                            </Flex>

                            <VStack spacing={4} align="stretch">
                                {cart.cartItems.map((item) => (
                                    <Flex key={item.id} bg={cardBg} p={4} borderRadius="xl" align="center" border="1px solid" borderColor={borderColor}>
                                        <Checkbox 
                                            isChecked={item.selected} 
                                            onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                                            colorScheme="blue" 
                                            mr={4}
                                        />
                                        
                                        <Image 
                                            src={item.product.mainImage} 
                                            alt={item.product.productName}
                                            boxSize="80px" 
                                            objectFit="contain" 
                                            mr={4} 
                                            borderRadius="md"
                                            bg="white"
                                        />
                                        
                                        <Box flex="1">
                                            <Text fontWeight="bold" noOfLines={2} color={textColor}>{item.product.productName}</Text>
                                            <Text fontSize="sm" color="gray.500">{item.product.model}</Text>
                                            <Text fontWeight="bold" color="blue.500" mt={1}>{formatCurrency(item.price)}</Text>
                                        </Box>

                                        <Flex align="center" border="1px solid" borderColor="gray.200" borderRadius="md">
                                            <IconButton 
                                                icon={<MinusIcon />} size="xs" variant="ghost" 
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                            />
                                            <Text px={2} fontSize="sm" fontWeight="bold">{item.quantity}</Text>
                                            <IconButton 
                                                icon={<AddIcon />} size="xs" variant="ghost" 
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                            />
                                        </Flex>

                                        <IconButton 
                                            icon={<DeleteIcon />} 
                                            variant="ghost" colorScheme="red" ml={4}
                                            onClick={() => handleRemoveItem(item.id)}
                                        />
                                    </Flex>
                                ))}
                            </VStack>
                        </Box>

                        {/* RIGHT: SUMMARY */}
                        <Box flex="1">
                            <Box bg={cardBg} p={6} borderRadius="2xl" border="1px solid" borderColor={borderColor} position="sticky" top="20px">
                                <Heading size="md" mb={6} color={textColor}>Thanh toán</Heading>
                                <VStack spacing={4} align="stretch" mb={6}>
                                    <Flex justify="space-between">
                                        <Text color="gray.500">Đã chọn:</Text>
                                        <Text fontWeight="bold">{cart.selectedItems} sản phẩm</Text>
                                    </Flex>
                                    <Flex justify="space-between">
                                        <Text color="gray.500">Tạm tính:</Text>
                                        <Text fontWeight="bold">{formatCurrency(cart.selectedItemsPrice)}</Text>
                                    </Flex>
                                    <Flex justify="space-between">
                                        <Text color="gray.500">Vận chuyển:</Text>
                                        <Badge colorScheme="green">Miễn phí</Badge>
                                    </Flex>
                                    <Divider borderColor={borderColor} />
                                    <Flex justify="space-between" align="center">
                                        <Text fontSize="lg" fontWeight="bold" color={textColor}>Tổng cộng</Text>
                                        <Text fontSize="2xl" fontWeight="bold" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
                                            {formatCurrency(cart.selectedItemsPrice)}
                                        </Text>
                                    </Flex>
                                </VStack>

                                <Button 
                                    w="full" size="lg" variant="brand" 
                                    as={Link} to="/checkout" h="56px" fontSize="lg"
                                    rightIcon={<Icon as={FaCreditCard} />}
                                    isDisabled={!hasSelectedItems} // Disable nếu chưa chọn gì
                                >
                                    MUA HÀNG ({cart.selectedItems})
                                </Button>
                                
                                <HStack justify="center" mt={4} spacing={4} color="gray.500">
                                    <Icon as={FaTruck} /><Text fontSize="xs">Freeship toàn quốc</Text>
                                </HStack>
                            </Box>
                        </Box>
                    </Flex>
                )}
            </Container>
        </Box>
    );
};

export default CartPage;