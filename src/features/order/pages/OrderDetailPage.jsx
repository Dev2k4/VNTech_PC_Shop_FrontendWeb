import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Box, Container, Grid, VStack, Heading, Flex, Badge, Button, useToast, Spinner, useColorModeValue, useDisclosure
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import OrderService from '../../../services/order.service';

// Import Components
import OrderTracker from '../components/OrderTracker';
import OrderItemList from '../components/OrderItemList';
import OrderShippingAddress from '../components/OrderShippingAddress';
import OrderPaymentSummary from '../components/OrderPaymentSummary';
import CancelOrderModal from '../components/CancelOrderModal';

const OrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
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

    const handleCancelOrder = async () => {
        try {
            await OrderService.cancelOrder(id, "Người dùng hủy");
            toast({ title: "Đã hủy đơn hàng", status: "success" });
            fetchOrderDetail();
            onClose();
        } catch (error) {
            toast({ title: "Lỗi hủy đơn", description: error.response?.data?.message, status: "error" });
        }
    };

    if (loading) return <Flex justify="center" align="center" h="50vh"><Spinner size="xl" /></Flex>;
    if (!order) return <Box p={10}>Đơn hàng không tồn tại</Box>;

    return (
        <Box minH="100vh" py={10}>
            <Container maxW="container.xl">
                <Button as={Link} to="/user/orders" leftIcon={<ArrowBackIcon />} mb={6} variant="link" color={textColor}>
                    Quay lại danh sách
                </Button>

                <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
                    <Heading size="lg" color={textColor}>Chi tiết đơn hàng #{order.orderCode}</Heading>
                    <Badge fontSize="1em" colorScheme={order.status === 'CANCELLED' ? 'red' : 'green'} p={2} borderRadius="md">
                        {order.status === 'CANCELLED' ? 'ĐÃ HỦY' : order.statusName || order.status}
                    </Badge>
                </Flex>

                <OrderTracker status={order.status} />

                <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
                    <OrderItemList items={order.orderItems} />
                    
                    <VStack align="stretch" spacing={6}>
                        <OrderShippingAddress address={order.address} />
                        <OrderPaymentSummary order={order} onCancel={onOpen} />
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