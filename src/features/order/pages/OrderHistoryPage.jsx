// src/features/order/pages/OrderHistoryPage.jsx
import React, { useEffect, useState } from 'react';
import { Box, Container, Heading, Spinner, Flex, useColorModeValue, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import OrderService from '../../../services/order.service';
import OrderHistoryTable from '../components/OrderHistoryTable';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Theme
    const pageBg = useColorModeValue("gray.50", "vntech.darkBg");
    const textColor = useColorModeValue("gray.800", "white");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await OrderService.getMyOrders();
                if (res.success) setOrders(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <Flex justify="center" align="center" h="100vh" bg={pageBg}><Spinner size="xl" color="blue.500" /></Flex>;

    return (
        <Box bg={pageBg} minH="100vh" py={10}>
            <Container maxW="container.xl">
                <Flex justify="space-between" align="center" mb={8}>
                    <Heading size="lg" color={textColor}>Lịch sử đơn hàng</Heading>
                    <Button as={Link} to="/" variant="outline" colorScheme="blue" size="sm">Tiếp tục mua sắm</Button>
                </Flex>

                {orders.length === 0 ? (
                    <Box textAlign="center" py={20} bg={useColorModeValue("white", "vntech.cardBg")} borderRadius="2xl">
                        <Text color="gray.500" mb={4}>Bạn chưa có đơn hàng nào.</Text>
                        <Button as={Link} to="/" variant="brand">Mua ngay</Button>
                    </Box>
                ) : (
                    <OrderHistoryTable orders={orders} />
                )}
            </Container>
        </Box>
    );
};

export default OrderHistoryPage;