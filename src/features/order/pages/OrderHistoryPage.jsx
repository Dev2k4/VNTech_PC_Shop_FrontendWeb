import React, { useEffect, useState } from 'react';
import { Box, Container, Heading, Spinner, Flex, useColorModeValue } from '@chakra-ui/react';
import OrderService from '../../../services/order.service';
import OrderHistoryTable from '../components/OrderHistoryTable';
import OrderEmpty from '../components/OrderEmpty';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const textColor = useColorModeValue("gray.800", "white");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await OrderService.getMyOrders();
                if (res.success) setOrders(res.data);
            } catch (error) {
                console.error("Lỗi tải đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <Flex justify="center" align="center" h="50vh"><Spinner size="xl" /></Flex>;

    return (
        <Box minH="80vh" py={10}>
            <Container maxW="container.xl">
                <Heading mb={6} size="lg" color={textColor}>Lịch sử đơn hàng</Heading>
                {orders.length === 0 ? <OrderEmpty /> : <OrderHistoryTable orders={orders} />}
            </Container>
        </Box>
    );
};

export default OrderHistoryPage;