import React, { useEffect, useState } from "react";
import {
  Box, Container, Grid, VStack, Heading, Text, Flex, Radio, RadioGroup, Button, Divider,
  useToast, FormControl, FormLabel, Input, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, useDisclosure, Stack, useColorModeValue, Icon, Badge
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCreditCard, FaClipboardList, FaPlus } from "react-icons/fa";

import CartService from "../../../services/cart.service";
import AddressService from "../../../services/address.service";
import OrderService from "../../../services/order.service";
import PaymentService from "../../../services/payment.service"; // Import mới
import { useCart } from "../../../context/CartContext";
import { formatCurrency } from "../../../utils/format";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { fetchCartCount } = useCart();

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Default COD
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal thêm địa chỉ
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newAddress, setNewAddress] = useState({
      recipientName: "", phoneNumber: "", province: "", district: "", ward: "", addressDetail: ""
  });

  // Styles
  const bg = useColorModeValue("gray.50", "vntech.darkBg");
  const cardBg = useColorModeValue("white", "vntech.cardBg");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const textColor = useColorModeValue("gray.800", "white");
  const inputBg = useColorModeValue("white", "whiteAlpha.100");

  // Fetch dữ liệu
  useEffect(() => {
      const initData = async () => {
          try {
              // 1. Lấy giỏ hàng
              const cartRes = await CartService.getCart();
              if (cartRes.success) setCart(cartRes.data);

              // 2. Lấy địa chỉ
              const addrRes = await AddressService.getMyAddresses();
              if (addrRes.success) {
                  setAddresses(addrRes.data);
                  // Tự động chọn địa chỉ mặc định hoặc địa chỉ đầu tiên
                  const defaultAddr = addrRes.data.find(a => a.isDefault);
                  if (defaultAddr) setSelectedAddressId(defaultAddr.id);
                  else if (addrRes.data.length > 0) setSelectedAddressId(addrRes.data[0].id);
              }
          } catch (error) {
              console.error(error);
          }
      };
      initData();
  }, []);

  // Xử lý thêm địa chỉ
  const handleAddAddress = async () => {
      if (!newAddress.recipientName || !newAddress.phoneNumber || !newAddress.addressDetail) {
          toast({ title: "Vui lòng điền đủ thông tin", status: "warning" });
          return;
      }
      try {
          await AddressService.addAddress(newAddress);
          toast({ title: "Thêm địa chỉ thành công", status: "success" });
          
          // Reload list
          const res = await AddressService.getMyAddresses();
          if(res.success) {
              setAddresses(res.data);
              // Chọn luôn địa chỉ vừa thêm (thường là cái cuối cùng)
              setSelectedAddressId(res.data[res.data.length-1].id);
          }
          onClose();
      } catch (error) {
          toast({ title: "Lỗi thêm địa chỉ", status: "error" });
      }
  };

  // --- LOGIC ĐẶT HÀNG (QUAN TRỌNG) ---
  const handlePlaceOrder = async () => {
      if (!selectedAddressId) {
          toast({ title: "Chưa chọn địa chỉ nhận hàng", status: "warning", position: "top" });
          return;
      }
      if (!cart || cart.selectedItems === 0) {
        toast({ title: "Vui lòng chọn sản phẩm để mua", status: "warning", position: "top" });
        return;
      }

      setLoading(true);
      try {
          // BƯỚC 1: TẠO ĐƠN HÀNG (Order)
          const orderPayload = {
              addressId: selectedAddressId,
              paymentMethod: paymentMethod, // Gửi phương thức để BE lưu (COD/VNPAY)
              note: note,
              couponCode: "" // Tạm thời để trống
          };

          const orderRes = await OrderService.createOrder(orderPayload);
          
          if (orderRes.success) {
              const createdOrder = orderRes.data;
              console.log("Order Created:", createdOrder);

              await fetchCartCount(); // Update lại số lượng giỏ hàng

              // BƯỚC 2: XỬ LÝ THANH TOÁN
              if (paymentMethod === "VNPAY") {
                  // Nếu là VNPAY -> Gọi tiếp API lấy URL
                  try {
                    const paymentPayload = {
                        orderId: createdOrder.id,
                        amount: createdOrder.finalPrice, // BE yêu cầu amount
                        paymentMethod: "VNPAY",
                        language: "vn"
                    };
                    const payRes = await PaymentService.createPayment(paymentPayload);
                    
                    if (payRes.code === "00" || payRes.paymentUrl) {
                        // Redirect sang VNPay
                        window.location.href = payRes.paymentUrl;
                    } else {
                        // Trường hợp tạo order xong nhưng lỗi lấy link thanh toán
                        toast({ title: "Lỗi lấy link thanh toán", description: "Vui lòng thử lại trong Lịch sử đơn hàng", status: "error" });
                        navigate(`/user/orders/${createdOrder.id}`);
                    }
                  } catch (payErr) {
                      console.error("Lỗi API Payment:", payErr);
                      toast({ title: "Lỗi kết nối cổng thanh toán", status: "error" });
                      navigate(`/user/orders/${createdOrder.id}`);
                  }

              } else {
                  // Nếu là COD -> Xong luôn
                  toast({ title: "Đặt hàng thành công!", status: "success", duration: 3000 });
                  navigate("/user/orders"); // Chuyển về trang lịch sử
              }
          }

      } catch (error) {
          console.error("Lỗi đặt hàng:", error);
          toast({ 
              title: "Đặt hàng thất bại", 
              description: error.response?.data?.message || "Có lỗi xảy ra", 
              status: "error" 
          });
      } finally {
          setLoading(false);
      }
  };

  return (
    <Box bg={bg} minH="100vh" py={10}>
      <Container maxW="container.xl">
        <Heading mb={8} size="lg" color={textColor}>Thanh toán</Heading>
        
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          {/* LEFT COLUMN */}
          <VStack align="stretch" spacing={6}>
            
            {/* 1. ĐỊA CHỈ */}
            <Box bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderColor}>
                <Flex justify="space-between" align="center" mb={4}>
                    <Flex align="center" gap={2}>
                        <Icon as={FaMapMarkerAlt} color="blue.500" />
                        <Heading size="md" color={textColor}>Địa chỉ nhận hàng</Heading>
                    </Flex>
                    <Button size="sm" leftIcon={<FaPlus />} onClick={onOpen}>Thêm mới</Button>
                </Flex>

                {addresses.length === 0 ? (
                    <Text color="red.400">Bạn chưa có địa chỉ nào. Vui lòng thêm mới.</Text>
                ) : (
                    <RadioGroup onChange={(val) => setSelectedAddressId(parseInt(val))} value={selectedAddressId}>
                        <Stack>
                            {addresses.map(addr => (
                                <Box key={addr.id} p={3} border="1px solid" borderColor={selectedAddressId === addr.id ? "blue.500" : borderColor} borderRadius="md" position="relative">
                                    <Radio value={addr.id}>
                                        <Text fontWeight="bold">{addr.recipientName} | {addr.phoneNumber}</Text>
                                        <Text fontSize="sm" color="gray.500">{addr.addressDetail}, {addr.ward}, {addr.district}, {addr.province}</Text>
                                    </Radio>
                                    {addr.isDefault && <Badge colorScheme="green" position="absolute" right={2} top={2}>Mặc định</Badge>}
                                </Box>
                            ))}
                        </Stack>
                    </RadioGroup>
                )}
            </Box>

            {/* 2. SẢN PHẨM (Chỉ hiển thị tóm tắt các item ĐƯỢC CHỌN) */}
            <Box bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderColor}>
                <Heading size="md" mb={4} color={textColor} display="flex" alignItems="center" gap={2}>
                    <Icon as={FaClipboardList} color="blue.500" /> Sản phẩm ({cart?.selectedItems || 0})
                </Heading>
                {/* Ở đây bạn có thể map lại cart.cartItems.filter(i => i.selected) để hiển thị chi tiết nếu muốn */}
            </Box>

            {/* 3. PHƯƠNG THỨC THANH TOÁN */}
            <Box bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderColor}>
                 <Heading size="md" mb={4} color={textColor} display="flex" alignItems="center" gap={2}>
                    <Icon as={FaCreditCard} color="blue.500" /> Phương thức thanh toán
                </Heading>
                <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
                    <Stack spacing={4}>
                        <Box p={4} border="1px solid" borderColor={paymentMethod === "COD" ? "blue.500" : borderColor} borderRadius="lg" cursor="pointer" onClick={() => setPaymentMethod("COD")}>
                            <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
                        </Box>
                        <Box p={4} border="1px solid" borderColor={paymentMethod === "VNPAY" ? "blue.500" : borderColor} borderRadius="lg" cursor="pointer" onClick={() => setPaymentMethod("VNPAY")}>
                            <Radio value="VNPAY">Thanh toán qua VNPAY (Thẻ ATM/Internet Banking)</Radio>
                            {paymentMethod === "VNPAY" && <Text fontSize="xs" color="gray.500" ml={6} mt={1}>Bạn sẽ được chuyển hướng sang cổng thanh toán VNPAY.</Text>}
                        </Box>
                    </Stack>
                </RadioGroup>
            </Box>

            {/* 4. GHI CHÚ */}
            <Box bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderColor}>
                 <Heading size="md" mb={4} color={textColor}>Ghi chú đơn hàng</Heading>
                 <Input placeholder="Lưu ý cho người bán..." value={note} onChange={(e) => setNote(e.target.value)} bg={inputBg} />
            </Box>
          </VStack>

          {/* RIGHT COLUMN: SUMMARY */}
          <Box>
              <Box bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderColor} position="sticky" top="20px">
                  <Heading size="md" mb={6} color={textColor}>Tóm tắt đơn hàng</Heading>
                  <Flex justify="space-between" mb={2}>
                      <Text color="gray.500">Tiền hàng</Text>
                      <Text fontWeight="bold">{formatCurrency(cart?.selectedItemsPrice || 0)}</Text>
                  </Flex>
                  <Flex justify="space-between" mb={2}>
                      <Text color="gray.500">Phí vận chuyển</Text>
                      <Text fontWeight="bold">0 ₫</Text>
                  </Flex>
                  <Divider my={4} />
                  <Flex justify="space-between" mb={6}>
                      <Text fontSize="lg" fontWeight="bold" color={textColor}>Tổng thanh toán</Text>
                      <Text fontSize="xl" fontWeight="bold" color="blue.500">{formatCurrency(cart?.selectedItemsPrice || 0)}</Text>
                  </Flex>
                  
                  <Button 
                    w="full" size="lg" colorScheme="blue" 
                    onClick={handlePlaceOrder}
                    isLoading={loading}
                    loadingText="Đang xử lý..."
                  >
                      ĐẶT HÀNG
                  </Button>
              </Box>
          </Box>
        </Grid>

        {/* Modal Thêm Địa Chỉ */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent bg={bg} color={textColor}>
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