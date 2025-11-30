import React, { useEffect, useState } from 'react';
import {
    Box, Container, Grid, VStack, Heading, Text, Flex, Radio, RadioGroup,
    Button, Divider, useToast, FormControl, FormLabel, Input,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, 
    useDisclosure, Stack, useColorModeValue
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import CartService from '../../../services/cart.service';
import AddressService from '../../../services/address.service';
import OrderService from '../../../services/order.service';
import { useCart } from '../../../context/CartContext';
import { formatCurrency } from '../../../utils/format';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { fetchCartCount } = useCart();
    
    const [cart, setCart] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newAddress, setNewAddress] = useState({
        recipientName: '', phoneNumber: '', addressDetail: '', 
        province: '', district: '', ward: '', default: false
    });

    // --- CẤU HÌNH MÀU SẮC (FIX DARK MODE) ---
    // Nền trang
    const pageBg = useColorModeValue("gray.50", "gray.900");
    // Nền các khối (Box)
    const boxBg = useColorModeValue("white", "gray.800");
    // Màu chữ chính
    const textColor = useColorModeValue("gray.800", "white");
    // Màu viền
    const borderColor = useColorModeValue("gray.200", "gray.700");
    // ----------------------------------------

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cartRes, addrRes] = await Promise.all([
                    CartService.getCart(),
                    AddressService.getMyAddresses()
                ]);

                if (cartRes.success) {
                    setCart(cartRes.data);
                    if (cartRes.data.cartItems.length === 0) {
                        toast({ title: "Giỏ hàng trống", status: "warning" });
                        navigate('/cart');
                    }
                }

                if (addrRes.success) {
                    setAddresses(addrRes.data);
                    const defaultAddr = addrRes.data.find(a => a.isDefault);
                    if (defaultAddr) setSelectedAddressId(defaultAddr.id);
                    else if (addrRes.data.length > 0) setSelectedAddressId(addrRes.data[0].id);
                }
            } catch (error) {
                console.error(error);
                toast({ title: "Lỗi tải dữ liệu", status: "error" });
            }
        };
        fetchData();
    }, [navigate, toast]);

    const handleAddAddress = async () => {
        try {
            if(!newAddress.recipientName || !newAddress.phoneNumber || !newAddress.addressDetail) {
                toast({ title: "Vui lòng điền đủ thông tin", status: "warning" });
                return;
            }
            const res = await AddressService.addAddress(newAddress);
            if (res.success) {
                toast({ title: "Thêm địa chỉ thành công", status: "success" });
                const updatedList = await AddressService.getMyAddresses();
                setAddresses(updatedList.data);
                setSelectedAddressId(res.data.id);
                onClose();
            }
        } catch (error) {
            toast({ title: "Lỗi thêm địa chỉ", status: "error" });
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            toast({ title: "Vui lòng chọn địa chỉ nhận hàng", status: "warning" });
            return;
        }
        setLoading(true);
        try {
            const orderData = {
                addressId: selectedAddressId,
                paymentMethod: paymentMethod,
                note: note
            };
            const res = await OrderService.createOrder(orderData);
            if (res.success) {
                await fetchCartCount();
                if (paymentMethod === 'VNPAY' && res.data.paymentUrl) {
                    window.location.href = res.data.paymentUrl;
                } else {
                    toast({ title: "Đặt hàng thành công!", status: "success", duration: 3000 });
                    navigate(`/user/orders/${res.data.id}`);
                }
            }
        } catch (error) {
            toast({ 
                title: "Đặt hàng thất bại", 
                description: error.response?.data?.message || "Có lỗi xảy ra", 
                status: "error" 
            });
        } finally {
            setLoading(false);
        }
    };

    if (!cart) return <Box p={10} textAlign="center" color={textColor}>Đang tải...</Box>;

    return (
        <Box bg={pageBg} minH="100vh" py={10}>
            <Container maxW="container.xl">
                <Heading mb={8} color={textColor}>Thanh toán</Heading>
                <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={10}>
                    {/* CỘT TRÁI */}
                    <VStack align="stretch" spacing={8}>
                        
                        {/* 1. Chọn địa chỉ */}
                        <Box bg={boxBg} p={6} borderRadius="lg" shadow="sm" border="1px solid" borderColor={borderColor}>
                            <Flex justify="space-between" align="center" mb={4}>
                                <Heading size="md" color={textColor}>Địa chỉ nhận hàng</Heading>
                                <Button size="sm" colorScheme="blue" variant="outline" onClick={onOpen}>+ Thêm mới</Button>
                            </Flex>
                            
                            {addresses.length === 0 ? (
                                <Text color="red.500">Bạn chưa có địa chỉ nào. Hãy thêm mới.</Text>
                            ) : (
                                <RadioGroup onChange={(val) => setSelectedAddressId(parseInt(val))} value={selectedAddressId}>
                                    <Stack>
                                        {addresses.map((addr) => (
                                            <Box key={addr.id} p={3} border="1px solid" borderColor={selectedAddressId === addr.id ? "blue.500" : borderColor} borderRadius="md" bg={useColorModeValue("white", "gray.700")}>
                                                <Radio value={addr.id}>
                                                    <Box ml={2}>
                                                        <Text fontWeight="bold" color={textColor}>{addr.recipientName} ({addr.phoneNumber})</Text>
                                                        <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
                                                            {addr.addressDetail}, {addr.ward}, {addr.district}, {addr.province}
                                                        </Text>
                                                    </Box>
                                                </Radio>
                                            </Box>
                                        ))}
                                    </Stack>
                                </RadioGroup>
                            )}
                        </Box>

                        {/* 2. Phương thức thanh toán */}
                        <Box bg={boxBg} p={6} borderRadius="lg" shadow="sm" border="1px solid" borderColor={borderColor}>
                            <Heading size="md" mb={4} color={textColor}>Phương thức thanh toán</Heading>
                            <RadioGroup onChange={setPaymentMethod} value={paymentMethod} color={textColor}>
                                <Stack direction={{ base: "column", md: "row" }} spacing={5}>
                                    <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
                                    <Radio value="VNPAY">Thanh toán qua VNPAY</Radio>
                                </Stack>
                            </RadioGroup>
                        </Box>

                        {/* 3. Ghi chú */}
                        <Box bg={boxBg} p={6} borderRadius="lg" shadow="sm" border="1px solid" borderColor={borderColor}>
                            <Heading size="md" mb={4} color={textColor}>Ghi chú đơn hàng</Heading>
                            <Input 
                                placeholder="Ví dụ: Giao hàng giờ hành chính..." 
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                color={textColor}
                            />
                        </Box>
                    </VStack>

                    {/* CỘT PHẢI */}
                    <Box>
                        <Box bg={boxBg} p={6} borderRadius="lg" shadow="sm" border="1px solid" borderColor={borderColor} position="sticky" top="100px">
                            <Heading size="md" mb={6} color={textColor}>Đơn hàng của bạn</Heading>
                            
                            <VStack align="stretch" spacing={4} mb={6} maxH="300px" overflowY="auto">
                                {cart.cartItems.map((item) => (
                                    <Flex key={item.id} justify="space-between">
                                        <Box>
                                            <Text fontWeight="medium" noOfLines={1} color={textColor}>{item.product.productName}</Text>
                                            <Text fontSize="sm" color="gray.500">x {item.quantity}</Text>
                                        </Box>
                                        <Text color={textColor} fontWeight="bold">{formatCurrency(item.price * item.quantity)}</Text>
                                    </Flex>
                                ))}
                            </VStack>
                            
                            <Divider mb={4} borderColor={borderColor} />
                            
                            <Flex justify="space-between" mb={2} color={textColor}>
                                <Text>Tạm tính</Text>
                                <Text>{formatCurrency(cart.totalPrice)}</Text>
                            </Flex>
                            <Flex justify="space-between" mb={4} color={textColor}>
                                <Text>Phí vận chuyển</Text>
                                <Text color="green.500">Miễn phí</Text>
                            </Flex>
                            
                            <Divider mb={4} borderColor={borderColor} />
                            
                            <Flex justify="space-between" mb={6}>
                                <Heading size="md" color={textColor}>Tổng cộng</Heading>
                                <Heading size="md" color="blue.500">{formatCurrency(cart.totalPrice)}</Heading>
                            </Flex>

                            <Button 
                                w="full" 
                                colorScheme="blue" 
                                size="lg" 
                                onClick={handlePlaceOrder}
                                isLoading={loading}
                                loadingText="Đang xử lý..."
                            >
                                ĐẶT HÀNG
                            </Button>
                        </Box>
                    </Box>
                </Grid>

                {/* MODAL */}
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent bg={boxBg} color={textColor}>
                        <ModalHeader>Thêm địa chỉ mới</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <VStack spacing={4}>
                                <FormControl>
                                    <FormLabel>Tên người nhận</FormLabel>
                                    <Input value={newAddress.recipientName} onChange={(e) => setNewAddress({...newAddress, recipientName: e.target.value})} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Số điện thoại</FormLabel>
                                    <Input value={newAddress.phoneNumber} onChange={(e) => setNewAddress({...newAddress, phoneNumber: e.target.value})} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Tỉnh/Thành phố</FormLabel>
                                    <Input value={newAddress.province} onChange={(e) => setNewAddress({...newAddress, province: e.target.value})} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Quận/Huyện</FormLabel>
                                    <Input value={newAddress.district} onChange={(e) => setNewAddress({...newAddress, district: e.target.value})} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Phường/Xã</FormLabel>
                                    <Input value={newAddress.ward} onChange={(e) => setNewAddress({...newAddress, ward: e.target.value})} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Địa chỉ chi tiết</FormLabel>
                                    <Input value={newAddress.addressDetail} onChange={(e) => setNewAddress({...newAddress, addressDetail: e.target.value})} />
                                </FormControl>
                                <Button colorScheme="blue" w="full" onClick={handleAddAddress}>Lưu địa chỉ</Button>
                            </VStack>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Container>
        </Box>
    );
};

export default CheckoutPage;