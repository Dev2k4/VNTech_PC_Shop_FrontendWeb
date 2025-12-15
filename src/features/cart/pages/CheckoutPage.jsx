// src/features/cart/pages/CheckoutPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Container, Grid, VStack, Heading, Text, Flex, Radio, RadioGroup, Button, Divider,
  useToast, FormControl, FormLabel, Input, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, useDisclosure, Stack, useColorModeValue, Icon
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCreditCard, FaClipboardList } from "react-icons/fa"; // Icons

import CartService from "../../../services/cart.service";
import AddressService from "../../../services/address.service";
import OrderService from "../../../services/order.service";
import { useCart } from "../../../context/CartContext";
import { formatCurrency } from "../../../utils/format";

const CheckoutPage = () => {
  // ... (Giữ nguyên logic state, useEffect, handlers như cũ)
  // Chỉ thay đổi phần RETURN UI bên dưới
  const navigate = useNavigate();
  const toast = useToast();
  const { fetchCartCount } = useCart();

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newAddress, setNewAddress] = useState({ recipientName: "", phoneNumber: "", addressDetail: "", province: "", district: "", ward: "", default: false });

  // Theme Colors
  const pageBg = useColorModeValue("gray.50", "vntech.darkBg");
  const cardBg = useColorModeValue("white", "vntech.cardBg");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const textColor = useColorModeValue("gray.800", "white");
  const inputBg = useColorModeValue("gray.50", "gray.900");

  useEffect(() => {
        const fetchData = async () => {
          try {
            const [cartRes, addrRes] = await Promise.all([
              CartService.getCart(),
              AddressService.getMyAddresses(),
            ]);
    
            if (cartRes.success) {
              setCart(cartRes.data);
              if (cartRes.data.cartItems.length === 0) {
                toast({ title: "Giỏ hàng trống", status: "warning" });
                navigate("/cart");
              }
            }
    
            if (addrRes.success) {
              setAddresses(addrRes.data);
              const defaultAddr = addrRes.data.find((a) => a.isDefault);
              if (defaultAddr) setSelectedAddressId(defaultAddr.id);
              else if (addrRes.data.length > 0)
                setSelectedAddressId(addrRes.data[0].id);
            }
          } catch (error) {
            console.error(error);
            toast({ title: "Lỗi tải dữ liệu", status: "error" });
          }
        };
        fetchData();
      }, [navigate, toast]);

    // ... (Giữ nguyên các hàm handleAddAddress, handlePlaceOrder)
    const handleAddAddress = async () => {
        try {
          if (
            !newAddress.recipientName ||
            !newAddress.phoneNumber ||
            !newAddress.addressDetail
          ) {
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
          toast({ title: "Vui lòng chọn địa chỉ nhận hàng", status: "warning", position: "top" });
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
            if (paymentMethod === "VNPAY" && res.data.paymentUrl) {
              window.location.href = res.data.paymentUrl;
            } else {
              toast({ title: "Đặt hàng thành công!", status: "success", position: "top" });
              navigate(`/user/orders/${res.data.id}`);
            }
          }
        } catch (error) {
          toast({ title: "Đặt hàng thất bại", description: error.response?.data?.message, status: "error" });
        } finally {
          setLoading(false);
        }
      };

  if (!cart) return <Box p={10} bg={pageBg} minH="100vh">Loading...</Box>;

  return (
    <Box bg={pageBg} minH="100vh" py={10} color={textColor}>
      <Container maxW="container.xl">
        <Heading mb={8} bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text" size="xl">
            Xác nhận thanh toán
        </Heading>
        
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          <VStack align="stretch" spacing={6}>
            
            {/* Section: Địa chỉ */}
            <Box bg={cardBg} p={6} borderRadius="2xl" border="1px solid" borderColor={borderColor} shadow="lg">
              <Flex justify="space-between" align="center" mb={4}>
                <Flex align="center" gap={3}>
                    <Icon as={FaMapMarkerAlt} color="blue.500" />
                    <Heading size="md">Địa chỉ nhận hàng</Heading>
                </Flex>
                <Button size="sm" variant="outline" colorScheme="blue" onClick={onOpen}>+ Thêm mới</Button>
              </Flex>

              <RadioGroup onChange={(val) => setSelectedAddressId(parseInt(val))} value={selectedAddressId}>
                <Stack spacing={4}>
                  {addresses.map((addr) => (
                    <Box
                      key={addr.id}
                      p={4}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor={selectedAddressId === addr.id ? "blue.500" : "whiteAlpha.200"}
                      bg={selectedAddressId === addr.id ? "blue.500" : "transparent"} // Highlight active item
                      bgOpacity={selectedAddressId === addr.id ? 0.1 : 0}
                      transition="all 0.2s"
                      _hover={{ borderColor: "blue.400" }}
                    >
                      <Radio value={addr.id} colorScheme="blue">
                        <Box ml={2}>
                          <Text fontWeight="bold" color={selectedAddressId === addr.id ? "white" : textColor}>
                            {addr.recipientName} <Text as="span" fontWeight="normal">| {addr.phoneNumber}</Text>
                          </Text>
                          <Text fontSize="sm" color={selectedAddressId === addr.id ? "gray.200" : "gray.500"}>
                            {addr.addressDetail}, {addr.ward}, {addr.district}, {addr.province}
                          </Text>
                        </Box>
                      </Radio>
                    </Box>
                  ))}
                </Stack>
              </RadioGroup>
            </Box>

            {/* Section: Thanh toán */}
            <Box bg={cardBg} p={6} borderRadius="2xl" border="1px solid" borderColor={borderColor} shadow="lg">
              <Flex align="center" gap={3} mb={4}>
                 <Icon as={FaCreditCard} color="purple.500" />
                 <Heading size="md">Phương thức thanh toán</Heading>
              </Flex>
              <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
                <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                  <Box 
                    as="label" 
                    p={4} border="1px solid" borderColor={paymentMethod === "COD" ? "blue.500" : borderColor} 
                    borderRadius="xl" cursor="pointer" flex="1"
                    _hover={{ bg: "whiteAlpha.50" }}
                  >
                    <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
                  </Box>
                  <Box 
                    as="label" 
                    p={4} border="1px solid" borderColor={paymentMethod === "VNPAY" ? "blue.500" : borderColor} 
                    borderRadius="xl" cursor="pointer" flex="1"
                    _hover={{ bg: "whiteAlpha.50" }}
                  >
                    <Radio value="VNPAY">Thanh toán qua VNPAY</Radio>
                  </Box>
                </Stack>
              </RadioGroup>
            </Box>

            {/* Section: Note */}
            <Box bg={cardBg} p={6} borderRadius="2xl" border="1px solid" borderColor={borderColor} shadow="lg">
               <Flex align="center" gap={3} mb={4}>
                 <Icon as={FaClipboardList} color="orange.500" />
                 <Heading size="md">Ghi chú</Heading>
              </Flex>
              <Input 
                placeholder="Lời nhắn cho cửa hàng..." 
                value={note} 
                onChange={(e) => setNote(e.target.value)} 
                bg={inputBg} border="none" py={6}
              />
            </Box>
          </VStack>

          {/* Sticky Summary */}
          <Box>
            <Box position="sticky" top="100px" bg={cardBg} p={6} borderRadius="2xl" border="1px solid" borderColor={borderColor} shadow="xl">
              <Heading size="md" mb={6}>Đơn hàng của bạn</Heading>
              <VStack align="stretch" spacing={4} maxH="300px" overflowY="auto" mb={4}>
                {cart.cartItems.map((item) => (
                  <Flex key={item.id} justify="space-between">
                    <Box>
                        <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>{item.product.productName}</Text>
                        <Text fontSize="xs" color="gray.500">x {item.quantity}</Text>
                    </Box>
                    <Text fontSize="sm" fontWeight="bold">{formatCurrency(item.price * item.quantity)}</Text>
                  </Flex>
                ))}
              </VStack>
              <Divider borderColor="whiteAlpha.300" mb={4} />
              <Flex justify="space-between" mb={2}>
                <Text color="gray.500">Tạm tính</Text>
                <Text fontWeight="bold">{formatCurrency(cart.totalPrice)}</Text>
              </Flex>
              <Flex justify="space-between" mb={6}>
                <Text color="gray.500">Vận chuyển</Text>
                <Text color="green.400" fontWeight="bold">Miễn phí</Text>
              </Flex>
              <Flex justify="space-between" mb={6} align="center">
                <Heading size="md">Tổng cộng</Heading>
                <Heading size="lg" color="blue.400">{formatCurrency(cart.totalPrice)}</Heading>
              </Flex>
              
              <Button 
                w="full" size="lg" variant="brand" 
                onClick={handlePlaceOrder} isLoading={loading}
                boxShadow="lg"
              >
                ĐẶT HÀNG NGAY
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Modal Thêm địa chỉ (Giữ nguyên logic form, chỉ update style nếu cần) */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay backdropFilter="blur(5px)" />
          <ModalContent bg={cardBg} border="1px solid" borderColor={borderColor}>
            <ModalHeader>Thêm địa chỉ mới</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
                <Stack spacing={4}>
                    <Input placeholder="Tên người nhận" value={newAddress.recipientName} onChange={(e) => setNewAddress({...newAddress, recipientName: e.target.value})} bg={inputBg} />
                    <Input placeholder="Số điện thoại" value={newAddress.phoneNumber} onChange={(e) => setNewAddress({...newAddress, phoneNumber: e.target.value})} bg={inputBg} />
                    <Flex gap={2}>
                        <Input placeholder="Tỉnh/TP" value={newAddress.province} onChange={(e) => setNewAddress({...newAddress, province: e.target.value})} bg={inputBg} />
                        <Input placeholder="Quận/Huyện" value={newAddress.district} onChange={(e) => setNewAddress({...newAddress, district: e.target.value})} bg={inputBg} />
                    </Flex>
                    <Input placeholder="Phường/Xã" value={newAddress.ward} onChange={(e) => setNewAddress({...newAddress, ward: e.target.value})} bg={inputBg} />
                    <Input placeholder="Số nhà, đường..." value={newAddress.addressDetail} onChange={(e) => setNewAddress({...newAddress, addressDetail: e.target.value})} bg={inputBg} />
                    
                    <Button colorScheme="blue" w="full" onClick={handleAddAddress}>Lưu địa chỉ</Button>
                </Stack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default CheckoutPage;