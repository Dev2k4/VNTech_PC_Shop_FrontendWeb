import React from 'react';
import { Box, Heading, Flex, Text, Divider, Button, useColorModeValue } from '@chakra-ui/react';
import { formatCurrency } from '../../../utils/format';

const OrderPaymentSummary = ({ order, onCancel }) => {
    const bg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");

    return (
        <Box bg={bg} p={6} borderRadius="lg" shadow="sm" border="1px" borderColor={borderColor}>
            <Heading size="md" mb={4} color={textColor}>Thanh toán</Heading>
            
            <Flex justify="space-between" mb={2}>
                <Text>Phương thức</Text>
                <Text fontWeight="bold">{order.payment?.paymentMethod || "COD"}</Text>
            </Flex>
            
            <Flex justify="space-between" mb={2}>
                <Text>Trạng thái</Text>
                <Text color={order.payment?.status === 'PAID' ? "green.500" : "orange.500"} fontWeight="bold">
                    {order.payment?.status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </Text>
            </Flex>
            
            <Divider my={3} />
            
            <Flex justify="space-between" mb={2}>
                <Text>Tổng tiền hàng</Text>
                <Text>{formatCurrency(order.totalPrice)}</Text>
            </Flex>
            <Flex justify="space-between" mb={2}>
                <Text>Phí vận chuyển</Text>
                <Text>{formatCurrency(order.shippingFee)}</Text>
            </Flex>
            <Flex justify="space-between" mt={4}>
                <Heading size="md">Tổng cộng</Heading>
                <Heading size="md" color="blue.500">{formatCurrency(order.finalPrice)}</Heading>
            </Flex>

            {order.canBeCancelled && (
                <Button colorScheme="red" size="lg" w="full" mt={6} onClick={onCancel}>
                    Hủy đơn hàng
                </Button>
            )}
        </Box>
    );
};

export default OrderPaymentSummary;