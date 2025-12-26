// src/features/order/pages/OrderDetailPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box, Container, Grid, VStack, Heading, Flex, Badge, Button,
  useToast, Spinner, useColorModeValue, useDisclosure, Text, Divider,
  Icon,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { FaBoxOpen, FaShippingFast, FaCheckCircle, FaClipboardList, FaTimesCircle } from "react-icons/fa";

import OrderService from "../../../services/order.service";
import OrderItemList from "../components/OrderItemList";
import OrderShippingAddress from "../components/OrderShippingAddress";
import OrderPaymentSummary from "../components/OrderPaymentSummary";
import CancelOrderModal from "../components/CancelOrderModal";
import OrderTracker from "../components/OrderTracker";  

const OrderDetailPage = () => {
  const { id } = useParams();  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [canceling, setCanceling] = useState(false);

  const toast = useToast();
  
  const bg = useColorModeValue("gray.50", "vntech.darkBg");
  const cardBg = useColorModeValue("white", "vntech.cardBg");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const textColor = useColorModeValue("gray.800", "white");

  const fetchOrder = useCallback(async () => {
    try {
      const res = await OrderService.getOrderById(id);
      if (res.success) {
        setOrder(res.data);
      } else {
        toast({ title: "Không tìm thấy đơn hàng", status: "error" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Lỗi tải đơn hàng", status: "error" });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleCancelOrder = async (reason) => {
    setCanceling(true);
    try {
        const res = await OrderService.cancelOrder(id, reason);
        
        if (res.success) {
            toast({ title: "Hủy đơn hàng thành công", status: "success" });
            onClose();
            await fetchOrder(); 
        } else {
            toast({ title: "Không thể hủy đơn", description: res.message, status: "error" });
        }
    } catch (error) {
        console.error("Lỗi hủy đơn:", error);
        toast({ title: "Có lỗi xảy ra", description: "Vui lòng thử lại sau", status: "error" });
    } finally {
        setCanceling(false);
    }
  };

  if (loading) return <Flex justify="center" align="center" h="100vh"><Spinner size="xl" color="blue.500" /></Flex>;
  if (!order) return <Box textAlign="center" py={20}>Đơn hàng không tồn tại</Box>;

  const canCancel = order.status === 'PENDING' || order.status === 'CONFIRMED';

  return (
    <Box bg={bg} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" mb={6}>
            <Button leftIcon={<ArrowBackIcon />} variant="ghost" as={Link} to="/user/orders">
                Trở lại danh sách
            </Button>
            <Heading size="md" color={textColor}>
                Đơn hàng #{order.orderCode}
            </Heading>
        </Flex>

        <OrderTracker status={order.status} />

        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          <Box bg={cardBg} p={6} borderRadius="2xl" border="1px solid" borderColor={borderColor}>
            <Heading size="md" mb={6}>Sản phẩm</Heading>
            <OrderItemList items={order.orderItems} />
          </Box>

          <VStack align="stretch" spacing={6}>
            <Box bg={cardBg} p={6} borderRadius="2xl" border="1px solid" borderColor={borderColor}>
              <Heading size="md" mb={4}>Địa chỉ nhận hàng</Heading>
              <OrderShippingAddress address={order.address} />
            </Box>

            <Box bg={cardBg} p={6} borderRadius="2xl" border="1px solid" borderColor={borderColor}>
              <Heading size="md" mb={4}>Thanh toán</Heading>
              <OrderPaymentSummary order={order} />
              
              {canCancel && (
                  <>
                    <Divider my={4} />
                    <Button 
                        w="full" 
                        colorScheme="red" 
                        variant="outline" 
                        onClick={onOpen}
                        isLoading={canceling}
                    >
                        Hủy đơn hàng
                    </Button>
                  </>
              )}
            </Box>
          </VStack>
        </Grid>

        <CancelOrderModal
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={handleCancelOrder}
          isLoading={canceling}
        />

      </Container>
    </Box>
  );
};

export default OrderDetailPage;