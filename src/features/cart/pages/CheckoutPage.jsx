import React, { useEffect, useState } from "react";
import {
  Box, Container, Grid, VStack, Heading, Text, Flex, Radio, RadioGroup, Button, Divider,
  useToast, Stack, useColorModeValue, Icon, Badge, useDisclosure, Spinner, Input,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, 
  Tooltip, SimpleGrid, Tag, HStack
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCreditCard, FaClipboardList, FaPlus, FaCheckCircle } from "react-icons/fa";

import CartService from "../../../services/cart.service";
import AddressService from "../../../services/address.service";
import OrderService from "../../../services/order.service";
import PaymentService from "../../../services/payment.service";
import ShippingService from "../../../services/shipping.service";
import CouponService from "../../../services/couponService";
import UserService from "../../../services/user.service";
import { useCart } from "../../../context/CartContext";
import { formatCurrency } from "../../../utils/format";
import AddressModal from "../../user/components/AddressModal"; // Tái sử dụng Modal xịn xò

const CheckoutPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { fetchCartCount } = useCart();

  // State
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD"); 
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [calculatingFee, setCalculatingFee] = useState(false);

  // Voucher state
  const [user, setUser] = useState(null);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  // Modal thêm địa chỉ nhanh
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Modal chọn voucher
  const { isOpen: isCouponOpen, onOpen: onCouponOpen, onClose: onCouponClose } = useDisclosure();

  // Theme Colors
  const bg = useColorModeValue("gray.50", "vntech.darkBg");
  const cardBg = useColorModeValue("white", "vntech.cardBg");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const textColor = useColorModeValue("gray.800", "white");

  // 1. Load Giỏ hàng & Địa chỉ cùng lúc
  const fetchData = async () => {
    try {
      const [cartRes, addrRes, userRes, couponRes] = await Promise.all([
        CartService.getCart(),
        AddressService.getMyAddresses(),
        UserService.getProfile(),
        CouponService.getActiveCoupons()
      ]);

      // Xử lý Giỏ hàng
      if (cartRes.success) {
        setCart(cartRes.data);
        if (!cartRes.data || cartRes.data.selectedItems === 0) {
            toast({ title: "Chưa chọn sản phẩm nào", status: "warning" });
            navigate("/cart");
        }
      }

      // Xử lý Địa chỉ
      if (addrRes.success) {
        const addrList = addrRes.data || [];
        setAddresses(addrList);
        // Tự động chọn địa chỉ mặc định (hoặc cái đầu tiên)
        const defaultAddr = addrList.find(a => a.isDefault) || addrList[0];
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      }

      // Profile (cho userId)
      if (userRes.success) {
        setUser(userRes.data);
      }

      // Coupons (xử lý cả APIResponse hoặc list thô)
      if (couponRes) {
        const couponList = couponRes.success ? couponRes.data : couponRes;
        setAvailableCoupons(Array.isArray(couponList) ? couponList : []);
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Lỗi tải dữ liệu", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // 1.5. Fetch phí ship mỗi khi đổi địa chỉ hoặc giá trị giỏ hàng đổi
  useEffect(() => {
      const getShippingFee = async () => {
        if (!selectedAddressId || !cart?.selectedItemsPrice) return;
        
        const selectedAddr = addresses.find(a => a.id === selectedAddressId);
        if (!selectedAddr) return;
  
        setCalculatingFee(true);
        try {
          const res = await ShippingService.calculateShippingFee({
            province: selectedAddr.province,
            orderValue: cart.selectedItemsPrice
          });
          if (res.success) {
            setShippingFee(res.data.shippingFee);
          }
        } catch (error) {
          console.error("Lỗi tính phí ship:", error);
        } finally {
          setCalculatingFee(false);
        }
      };
  
      getShippingFee();
    }, [selectedAddressId, cart?.selectedItemsPrice, addresses]);

    // 1.6. Xử lý Voucher
    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setValidatingCoupon(true);
        try {
            const res = await CouponService.validateCoupon({
                couponCode: couponInput.trim(),
                userId: user.id,
                orderValue: cart.selectedItemsPrice,
                shippingFee: shippingFee
            });

            if (res.isValid) {
                setAppliedCoupon(res);
                toast({ title: "Đã áp dụng mã giảm giá", status: "success" });
            } else {
                toast({ title: "Mã không hợp lệ", description: res.message, status: "error" });
            }
        } catch (error) {
            toast({ title: "Lỗi kiểm tra mã", status: "error" });
        } finally {
            setValidatingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponInput("");
    };

    const handleSelectVoucherFromList = (code) => {
        setCouponInput(code);
        onCouponClose();
        // Áp dụng luôn sau khi đóng modal (dùng useEffect hoặc gọi trực tiếp với code)
        setTimeout(() => {
            validateAndApply(code);
        }, 100);
    };

    const validateAndApply = async (code) => {
        setValidatingCoupon(true);
        try {
            const res = await CouponService.validateCoupon({
                couponCode: code,
                userId: user.id,
                orderValue: cart.selectedItemsPrice,
                shippingFee: shippingFee
            });

            if (res.isValid) {
                setAppliedCoupon(res);
                toast({ title: "Đã áp dụng mã giảm giữ", status: "success" });
            } else {
                toast({ title: "Mã không hợp lệ", description: res.message, status: "error" });
            }
        } catch (error) {
            toast({ title: "Lỗi kiểm tra mã", status: "error" });
        } finally {
            setValidatingCoupon(false);
        }
    };

  // 2. Xử lý Đặt hàng
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
        toast({ title: "Vui lòng chọn địa chỉ nhận hàng", status: "warning" });
        return;
    }

    setProcessing(true);
    try {
        // Bước 1: Tạo đơn hàng (Order)
        const orderPayload = {
            addressId: selectedAddressId,
            paymentMethod: paymentMethod,
            note: "", // Có thể thêm textarea note nếu muốn
            couponCode: appliedCoupon ? appliedCoupon.couponCode : null
        };
        
        const orderRes = await OrderService.createOrder(orderPayload);
        if (!orderRes.success) throw new Error(orderRes.message);

        const orderId = orderRes.data.id;
        const finalPrice = orderRes.data.finalPrice;

        // Bước 2: Xử lý thanh toán
        if (paymentMethod === "VNPAY") {
            // Gọi API lấy link VNPAY
            const payRes = await PaymentService.createPayment({
                orderId: orderId,
                amount: finalPrice,
                paymentMethod: "VNPAY",
                bankCode: null, // Để null cho user tự chọn bank tại cổng VNPAY
                language: "vn"
            });
            // Chuyển hướng sang VNPAY
            if(payRes.paymentUrl) {
                window.location.href = payRes.paymentUrl;
            }
        } else {
            // COD: Chuyển hướng đến trang thành công
            toast({ title: "Đặt hàng thành công!", status: "success" });
            fetchCartCount(); // Update lại icon giỏ hàng
            navigate("/payment/return?vnp_ResponseCode=00"); // Giả lập thành công cho COD
        }

    } catch (error) {
        toast({ title: "Đặt hàng thất bại", description: error.response?.data?.message, status: "error" });
    } finally {
        setProcessing(false);
    }
  };

  if (loading) return <Flex justify="center" h="100vh" align="center"><Spinner size="xl" color="blue.500" /></Flex>;

  return (
    <Box bg={bg} minH="100vh" py={10}>
      <Container maxW="container.xl">
        <Heading mb={6} color={textColor}>Thanh toán</Heading>
        
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
            {/* LEFT COLUMN */}
            <VStack spacing={6} align="stretch">
                
                {/* 1. ĐỊA CHỈ NHẬN HÀNG */}
                <Box bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderColor}>
                    <Flex justify="space-between" align="center" mb={4}>
                        <Heading size="md" display="flex" alignItems="center" gap={2}>
                            <Icon as={FaMapMarkerAlt} color="blue.500"/> Địa chỉ nhận hàng
                        </Heading>
                        <Button size="sm" leftIcon={<FaPlus/>} variant="ghost" colorScheme="blue" onClick={onOpen}>
                            Thêm mới
                        </Button>
                    </Flex>
                    
                    {addresses.length === 0 ? (
                        <Text color="red.400" fontStyle="italic">Bạn chưa có địa chỉ nào. Vui lòng thêm mới!</Text>
                    ) : (
                        <RadioGroup value={selectedAddressId} onChange={(val) => setSelectedAddressId(parseInt(val))}>
                            <Stack spacing={4}>
                                {addresses.map((addr) => (
                                    <Box 
                                        key={addr.id} 
                                        p={4} 
                                        border="1px solid" 
                                        borderColor={selectedAddressId === addr.id ? "blue.500" : borderColor} 
                                        borderRadius="lg"
                                        bg={selectedAddressId === addr.id ? useColorModeValue("blue.50", "whiteAlpha.100") : "transparent"}
                                        cursor="pointer"
                                        onClick={() => setSelectedAddressId(addr.id)}
                                        position="relative"
                                    >
                                        <Radio value={addr.id} position="absolute" top={4} right={4} size="lg" colorScheme="blue" />
                                        <Text fontWeight="bold">{addr.recipientName} <span style={{fontWeight:'normal', color:'gray'}}>| {addr.phoneNumber}</span></Text>
                                        <Text fontSize="sm" color="gray.500" mt={1}>
                                            {addr.addressDetail}, {addr.ward}, {addr.district}, {addr.province}
                                        </Text>
                                        {addr.isDefault && <Badge colorScheme="green" mt={2}>Mặc định</Badge>}
                                    </Box>
                                ))}
                            </Stack>
                        </RadioGroup>
                    )}
                </Box>

                {/* 2. SẢN PHẨM */}
                <Box bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderColor}>
                    <Heading size="md" mb={4} display="flex" alignItems="center" gap={2}>
                        <Icon as={FaClipboardList} color="orange.500"/> Sản phẩm ({cart?.selectedItems})
                    </Heading>
                    <Stack spacing={4} divider={<Divider borderColor={borderColor} />}>
                        {cart?.cartItems.filter(item => item.selected).map(item => (
                            <Flex key={item.id} justify="space-between" align="center">
                                <Text flex="1" noOfLines={1} fontWeight="medium">{item.product.productName}</Text>
                                <Text w="50px" textAlign="center" color="gray.500">x{item.quantity}</Text>
                                <Text w="120px" textAlign="right" fontWeight="bold">{formatCurrency(item.price * item.quantity)}</Text>
                            </Flex>
                        ))}
                    </Stack>
                </Box>
            </VStack>

            {/* RIGHT COLUMN: PAYMENT & SUMMARY */}
            <VStack spacing={6} align="stretch">
                <Box bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderColor} position="sticky" top="20px">
                    <Heading size="md" mb={4} display="flex" alignItems="center" gap={2}>
                        <Icon as={FaCreditCard} color="purple.500"/> Phương thức thanh toán
                    </Heading>
                    
                    <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                        <Stack spacing={4}>
                            <Box p={3} border="1px solid" borderColor={paymentMethod === 'COD' ? 'blue.500' : borderColor} borderRadius="lg" cursor="pointer" onClick={() => setPaymentMethod('COD')}>
                                <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
                            </Box>
                            <Box p={3} border="1px solid" borderColor={paymentMethod === 'VNPAY' ? 'blue.500' : borderColor} borderRadius="lg" cursor="pointer" onClick={() => setPaymentMethod('VNPAY')}>
                                <Radio value="VNPAY">Thanh toán qua VNPAY</Radio>
                            </Box>
                        </Stack>
                    </RadioGroup>

                    <Divider my={6} borderColor={borderColor} />

                    {/* VOUCHER SECTION */}
                    <Box mb={6}>
                        <Text fontWeight="bold" mb={2} fontSize="sm">Mã giảm giá</Text>
                        {!appliedCoupon ? (
                            <Flex gap={2}>
                                <Input 
                                    placeholder="Nhập mã voucher..." 
                                    size="sm" 
                                    value={couponInput}
                                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                    bg={useColorModeValue("white", "whiteAlpha.100")}
                                />
                                <Button 
                                    size="sm" 
                                    colorScheme="blue" 
                                    onClick={handleApplyCoupon}
                                    isLoading={validatingCoupon}
                                    isDisabled={!couponInput}
                                >
                                    ÁP DỤNG
                                </Button>
                            </Flex>
                        ) : (
                            <Flex 
                                p={2} bg="green.50" border="1px dashed" borderColor="green.500" 
                                borderRadius="md" justify="space-between" align="center"
                            >
                                <Box>
                                    <Text fontSize="xs" fontWeight="bold" color="green.700">{appliedCoupon.couponCode}</Text>
                                    <Text fontSize="2xs" color="green.600">Đã giảm {formatCurrency(appliedCoupon.discountAmount)}</Text>
                                </Box>
                                <Button size="xs" colorScheme="red" variant="ghost" onClick={handleRemoveCoupon}>Gỡ</Button>
                            </Flex>
                        )}
                        <Button 
                            mt={2} w="full" size="xs" variant="ghost" colorScheme="purple"
                            leftIcon={<Icon as={FaCheckCircle} />}
                            onClick={onCouponOpen}
                        >
                            Chọn từ danh sách Voucher
                        </Button>
                    </Box>

                    <Divider my={6} borderColor={borderColor} />

                    <VStack spacing={2} align="stretch" fontSize="sm">
                        <Flex justify="space-between">
                            <Text color="gray.500">Tổng tiền hàng</Text>
                            <Text fontWeight="bold">{formatCurrency(cart?.selectedItemsPrice)}</Text>
                        </Flex>
                        <Flex justify="space-between">
                            <Text color="gray.500">Phí vận chuyển</Text>
                            {calculatingFee ? (
                                <Spinner size="xs" color="blue.500" />
                            ) : (
                                <Text fontWeight="bold">{shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}</Text>
                            )}
                        </Flex>
                        {appliedCoupon && (
                            <Flex justify="space-between">
                                <Text color="gray.500">Mã giảm giá</Text>
                                <Text fontWeight="bold" color="red.500">-{formatCurrency(appliedCoupon.discountAmount)}</Text>
                            </Flex>
                        )}
                        <Divider />
                        <Flex justify="space-between" align="center" pt={2}>
                            <Text fontSize="lg" fontWeight="bold">Tổng thanh toán</Text>
                            <Text fontSize="xl" fontWeight="bold" color="blue.500">
                                {formatCurrency((cart?.selectedItemsPrice || 0) + shippingFee - (appliedCoupon?.discountAmount || 0))}
                            </Text>
                        </Flex>
                    </VStack>

                    <Button 
                        mt={6} w="full" size="lg" colorScheme="blue" 
                        onClick={handlePlaceOrder} 
                        isLoading={processing}
                        isDisabled={addresses.length === 0} // Chặn nếu chưa có địa chỉ
                    >
                        ĐẶT HÀNG
                    </Button>
                </Box>
            </VStack>
        </Grid>

        {/* Modal Thêm địa chỉ mới (Tự động reload data khi thêm xong) */}
        <AddressModal 
            isOpen={isOpen} 
            onClose={onClose} 
            onSuccess={fetchData} 
        />

        {/* Modal Chọn Voucher */}
        <Modal isOpen={isCouponOpen} onClose={onCouponClose} size="xl" scrollBehavior="inside">
            <ModalOverlay backdropFilter="blur(5px)" />
            <ModalContent bg={bg} color={textColor} borderRadius="2xl">
                <ModalHeader borderBottomWidth="1px" borderColor={borderColor}>
                    Vouchers của shop
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody p={6}>
                    <SimpleGrid columns={1} spacing={4}>
                        {availableCoupons.length === 0 ? (
                            <Text textAlign="center" color="gray.500">Hiện không có mã giảm giá nào.</Text>
                        ) : (
                            availableCoupons.map((coupon) => (
                                <Box 
                                    key={coupon.id} p={4} borderRadius="xl" border="1px solid" borderColor={borderColor}
                                    bg={cardBg} transition="all 0.2s" _hover={{ borderColor: 'blue.400', shadow: 'sm' }}
                                >
                                    <Flex justify="space-between" align="center">
                                        <VStack align="start" spacing={1} flex="1">
                                            <HStack>
                                                <Badge colorScheme="purple" fontSize="sm">{coupon.code}</Badge>
                                                <Tag size="sm" variant="subtle" colorScheme="blue">
                                                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : formatCurrency(coupon.discountValue)}
                                                </Tag>
                                            </HStack>
                                            <Text fontWeight="bold" fontSize="sm">{coupon.description || `Giảm cho đơn từ ${formatCurrency(coupon.minOrderValue)}`}</Text>
                                            <Text fontSize="xs" color="gray.500">HSD: {new Date(coupon.endDate).toLocaleDateString('vi-VN')}</Text>
                                        </VStack>
                                        <Button 
                                            size="sm" colorScheme="blue" variant="outline"
                                            onClick={() => handleSelectVoucherFromList(coupon.code)}
                                            isDisabled={cart?.selectedItemsPrice < coupon.minOrderValue}
                                        >
                                            Sử dụng
                                        </Button>
                                    </Flex>
                                </Box>
                            ))
                        )}
                    </SimpleGrid>
                </ModalBody>
            </ModalContent>
        </Modal>

      </Container>
    </Box>
  );
};

export default CheckoutPage;