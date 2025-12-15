import React from 'react';
import { Box, Heading, Flex, Text, Divider, Button, useColorModeValue } from '@chakra-ui/react';
import { formatCurrency } from '../../../utils/format';

const OrderPaymentSummary = ({ order, onCancel }) => {
    const textColor = useColorModeValue("gray.800", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");

    return (
        <Box>
            <Flex justify="space-between" mb={2}><Text color="gray.500">Phương thức</Text><Text fontWeight="bold" color={textColor}>{order.payment?.paymentMethod}</Text></Flex>
            <Flex justify="space-between" mb={2}><Text color="gray.500">Trạng thái</Text><Text color={order.payment?.status === 'PAID' ? "green.400" : "orange.400"} fontWeight="bold">{order.payment?.status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}</Text></Flex>
            <Divider my={4} borderColor={borderColor} />
            <Flex justify="space-between" mb={2}><Text color="gray.500">Tạm tính</Text><Text color={textColor}>{formatCurrency(order.totalPrice)}</Text></Flex>
            <Flex justify="space-between" mb={2}><Text color="gray.500">Vận chuyển</Text><Text color={textColor}>{formatCurrency(order.shippingFee)}</Text></Flex>
            <Flex justify="space-between" mt={4}><Heading size="md" color={textColor}>Tổng cộng</Heading><Heading size="md" color="blue.400">{formatCurrency(order.finalPrice)}</Heading></Flex>
            {order.canBeCancelled && <Button colorScheme="red" w="full" mt={6} onClick={onCancel}>Hủy đơn hàng</Button>}
        </Box>
    );
};

export default OrderPaymentSummary;