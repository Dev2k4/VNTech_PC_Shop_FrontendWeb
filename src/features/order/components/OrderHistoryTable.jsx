import React from 'react';
import {
    Box, Table, Thead, Tbody, Tr, Th, Td, Badge, IconButton, Tooltip, useColorModeValue
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../../utils/format';

const OrderHistoryTable = ({ orders }) => {
    const bg = useColorModeValue("white", "gray.800");
    const headerBg = useColorModeValue("gray.50", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    const getStatusColor = (status) => {
        const colors = {
            'PENDING': 'yellow', 'CONFIRMED': 'blue', 'PROCESSING': 'blue',
            'SHIPPING': 'cyan', 'DELIVERED': 'green', 'CANCELLED': 'red',
            'RETURNED': 'orange', 'REFUNDED': 'purple'
        };
        return colors[status] || 'gray';
    };

    const getStatusText = (status) => {
        const text = {
            'PENDING': 'Chờ xác nhận', 'CONFIRMED': 'Đã xác nhận', 'PROCESSING': 'Đang xử lý',
            'SHIPPING': 'Đang giao', 'DELIVERED': 'Đã giao', 'CANCELLED': 'Đã hủy',
            'RETURNED': 'Trả hàng', 'REFUNDED': 'Hoàn tiền'
        };
        return text[status] || status;
    };

    return (
        <Box overflowX="auto" bg={bg} borderRadius="lg" shadow="sm" border="1px" borderColor={borderColor}>
            <Table variant="simple">
                <Thead bg={headerBg}>
                    <Tr>
                        <Th>Mã đơn</Th>
                        <Th>Ngày đặt</Th>
                        <Th>Sản phẩm</Th>
                        <Th>Tổng tiền</Th>
                        <Th>Trạng thái</Th>
                        <Th>Chi tiết</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {orders.map((order) => (
                        <Tr key={order.orderId}>
                            <Td fontWeight="bold">#{order.orderCode}</Td>
                            <Td>{formatDate(order.createdAt)}</Td>
                            <Td>{order.itemCount} sản phẩm</Td>
                            <Td fontWeight="bold" color="blue.500">{formatCurrency(order.finalPrice)}</Td>
                            <Td>
                                <Badge colorScheme={getStatusColor(order.status)}>
                                    {getStatusText(order.status)}
                                </Badge>
                            </Td>
                            <Td>
                                <Tooltip label="Xem chi tiết">
                                    <IconButton 
                                        as={Link}
                                        to={`/user/orders/${order.orderId}`}
                                        icon={<ViewIcon />}
                                        size="sm"
                                        colorScheme="blue"
                                        variant="ghost"
                                    />
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