// src/features/order/pages/OrderDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  VStack,
  Heading,
  Flex,
  Badge,
  Button,
  useToast,
  Spinner,
  useColorModeValue,
  useDisclosure,
  Text,
  Divider,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepTitle,
  StepSeparator,
  Stepper,
  Icon,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  FaBoxOpen,
  FaShippingFast,
  FaCheckCircle,
  FaClipboardList,
} from "react-icons/fa";
import OrderService from "../../../services/order.service";
import OrderItemList from "../components/OrderItemList";
import OrderShippingAddress from "../components/OrderShippingAddress";
import OrderPaymentSummary from "../components/OrderPaymentSummary";
import CancelOrderModal from "../components/CancelOrderModal";

const OrderTracker = ({ status }) => {
  const steps = [
    { title: "Đặt hàng", icon: FaClipboardList },
    { title: "Xác nhận", icon: FaCheckCircle },
    { title: "Vận chuyển", icon: FaShippingFast },
    { title: "Giao hàng", icon: FaBoxOpen },
  ];
  const getActiveStep = (s) => {
    if (s === "CANCELLED") return -1;
    if (s === "PENDING") return 0;
    if (s === "CONFIRMED" || s === "PROCESSING") return 1;
    if (s === "SHIPPING") return 2;
    if (s === "DELIVERED") return 3;
    return 0;
  };
  const activeStep = getActiveStep(status);

  if (status === "CANCELLED")
    return (
      <Box
        bg="red.500"
        color="white"
        p={4}
        borderRadius="xl"
        mb={8}
        textAlign="center"
        fontWeight="bold"
      >
        ĐƠN HÀNG ĐÃ BỊ HỦY
      </Box>
    );

  return (
    <Box w="full" py={6}>
      <Stepper index={activeStep} colorScheme="blue">
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={
                  <Box w="2" h="2" bg="gray.500" borderRadius="full" />
                }
                active={<Icon as={step.icon} />}
              />
            </StepIndicator>
            <Box flexShrink="0" display={{ base: "none", md: "block" }}>
              <StepTitle>{step.title}</StepTitle>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [canceling, setCanceling] = useState(false);
  // Theme Colors
  const pageBg = useColorModeValue("gray.50", "vntech.darkBg");
  const cardBg = useColorModeValue("white", "vntech.cardBg");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const textColor = useColorModeValue("gray.800", "white");

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const res = await OrderService.getOrderById(id);
      if (res.success) setOrder(res.data);
    } catch (error) {
      toast({ title: "Lỗi tải đơn hàng", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);
  const handleCancelOrder = async (reason) => {
    setCanceling(true); // Bắt đầu loading
    try {
      const res = await OrderService.cancelOrder(id, reason);

      // Kiểm tra response success từ Backend
      if (res.success) {
        toast({
          title: "Đã hủy đơn hàng thành công",
          status: "success",
          position: "top-right",
        });

        onClose();
        await fetchOrder();
      } else {
        toast({
          title: "Không thể hủy đơn",
          description: res.message,
          status: "error",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Lỗi",
        description:
          error.response?.data?.message || "Có lỗi xảy ra khi hủy đơn",
        status: "error",
      });
    } finally {
      setCanceling(false); // Tắt loading dù thành công hay thất bại
    }
  };

  if (loading)
    return (
      <Flex justify="center" h="100vh" align="center" bg={pageBg}>
        <Spinner color="blue.500" />
      </Flex>
    );
  if (!order) return <Box p={10}>Đơn hàng không tồn tại</Box>;

  return (
    <Box bg={pageBg} minH="100vh" py={10} color={textColor}>
      <Container maxW="container.xl">
        <Button
          as={Link}
          to="/user/orders"
          leftIcon={<ArrowBackIcon />}
          mb={6}
          variant="ghost"
          color="gray.500"
        >
          Quay lại danh sách
        </Button>

        <Box
          bg={cardBg}
          p={8}
          borderRadius="2xl"
          border="1px solid"
          borderColor={borderColor}
          mb={8}
          shadow="lg"
        >
          <Flex
            justify="space-between"
            align="center"
            wrap="wrap"
            gap={4}
            mb={6}
          >
            <Box>
              <Heading size="lg" mb={1}>
                Đơn hàng #{order.orderCode}
              </Heading>
              <Text color="gray.500" fontSize="sm">
                Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}
              </Text>
            </Box>
            <Badge
              fontSize="md"
              px={4}
              py={2}
              borderRadius="md"
              colorScheme={order.status === "CANCELLED" ? "red" : "green"}
              variant="subtle"
            >
              {order.status === "CANCELLED"
                ? "ĐÃ HỦY"
                : order.statusName || order.status}
            </Badge>
          </Flex>

          <Divider borderColor="whiteAlpha.200" mb={6} />
          <OrderTracker status={order.status} />
        </Box>

        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          {/* Phần 1: Danh sách sản phẩm (Cập nhật UI ItemList trong code cũ của bạn tương tự style này) */}
          <Box
            bg={cardBg}
            p={6}
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
          >
            <Heading size="md" mb={6}>
              Sản phẩm
            </Heading>
            <OrderItemList items={order.orderItems} />
          </Box>

          {/* Phần 2: Thông tin thanh toán & Địa chỉ */}
          <VStack align="stretch" spacing={6}>
            <Box
              bg={cardBg}
              p={6}
              borderRadius="2xl"
              border="1px solid"
              borderColor={borderColor}
            >
              <Heading size="md" mb={4}>
                Địa chỉ nhận hàng
              </Heading>
              <OrderShippingAddress address={order.address} />
            </Box>

            <Box
              bg={cardBg}
              p={6}
              borderRadius="2xl"
              border="1px solid"
              borderColor={borderColor}
            >
              <Heading size="md" mb={4}>
                Thanh toán
              </Heading>
              <OrderPaymentSummary order={order} onCancel={onOpen} />
            </Box>
          </VStack>
        </Grid>

        <CancelOrderModal
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={handleCancelOrder}
        />
      </Container>
    </Box>
  );
};

export default OrderDetailPage;
