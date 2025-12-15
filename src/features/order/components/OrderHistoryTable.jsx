import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Badge, IconButton, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../../utils/format';

const OrderHistoryTable = ({ orders }) => {
    const bg = useColorModeValue("white", "vntech.cardBg"); // Nền card tối
    const headerBg = useColorModeValue("gray.50", "whiteAlpha.100");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    const textColor = useColorModeValue("gray.800", "white");

    const getStatusColor = (status) => {
        const colors = { 'PENDING': 'yellow', 'CONFIRMED': 'blue', 'SHIPPING': 'cyan', 'DELIVERED': 'green', 'CANCELLED': 'red' };
        return colors[status] || 'gray';
    };

    return (
        <Box overflowX="auto" bg={bg} borderRadius="2xl" border="1px solid" borderColor={borderColor} shadow="lg">
            <Table variant="simple">
                <Thead bg={headerBg}>
                    <Tr>
                        <Th color="gray.400">Mã đơn</Th>
                        <Th color="gray.400">Ngày đặt</Th>
                        <Th color="gray.400">Sản phẩm</Th>
                        <Th color="gray.400">Tổng tiền</Th>
                        <Th color="gray.400">Trạng thái</Th>
                        <Th color="gray.400">Chi tiết</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {orders.map((order) => (
                        <Tr key={order.orderId} _hover={{ bg: "whiteAlpha.50" }}>
                            <Td fontWeight="bold" color={textColor}>#{order.orderCode}</Td>
                            <Td color="gray.500">{formatDate(order.createdAt)}</Td>
                            <Td color={textColor}>{order.itemCount} sản phẩm</Td>
                            <Td fontWeight="bold" color="blue.400">{formatCurrency(order.finalPrice)}</Td>
                            <Td><Badge colorScheme={getStatusColor(order.status)} borderRadius="md">{order.status}</Badge></Td>
                            <Td>
                                <Tooltip label="Xem chi tiết">
                                    <IconButton as={Link} to={`/user/orders/${order.orderId}`} icon={<ViewIcon />} size="sm" variant="ghost" color="blue.400" />
                                </Tooltip>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default OrderHistoryTable;