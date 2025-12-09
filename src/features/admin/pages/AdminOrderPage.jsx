import React, { useEffect, useState } from 'react';
import {
    Box, Button, Table, Thead, Tbody, Tr, Th, Td, IconButton, useDisclosure,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Select, useToast, Heading, Badge, Text, VStack
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import AdminService from '../../../services/admin.service';
import { formatCurrency, formatDate } from '../../../utils/format';

const AdminOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const ORDER_STATUSES = [
        { value: 'PENDING', label: 'Chờ xác nhận', color: 'yellow' },
        { value: 'CONFIRMED', label: 'Đã xác nhận', color: 'blue' },
        { value: 'SHIPPING', label: 'Đang giao', color: 'cyan' },
        { value: 'DELIVERED', label: 'Đã giao', color: 'green' },
        { value: 'CANCELLED', label: 'Đã hủy', color: 'red' },
    ];

    const fetchOrders = async () => {
        try {
            const res = await AdminService.getAllOrders({ page: 0, size: 50 });
            if (res.success) setOrders(res.data.content || []); 
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        onOpen();
    };

    const handleUpdateStatus = async (newStatus) => {
        if (!selectedOrder) return;
        try {
            await AdminService.updateOrderStatus(selectedOrder.id, newStatus);
            toast({ title: 'Cập nhật trạng thái thành công', status: 'success' });
            fetchOrders();
            onClose();
        } catch (error) {
            toast({ title: 'Lỗi cập nhật', description: error.response?.data?.message, status: 'error' });
        }
    };

    const getStatusBadge = (status) => {
        const s = ORDER_STATUSES.find(item => item.value === status) || { label: status, color: 'gray' };
        return <Badge colorScheme={s.color}>{s.label}</Badge>;
    };

    return (
        <Box bg="white" p={6} borderRadius="lg" shadow="sm">
            <Heading size="md" mb={6}>Quản lý Đơn hàng</Heading>
            
            <Box overflowX="auto">
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Mã đơn</Th>
                            <Th>Khách hàng</Th>
                            <Th>Ngày đặt</Th>
                            <Th>Tổng tiền</Th>
                            <Th>Trạng thái</Th>
                            <Th>Chi tiết</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {orders.map((order) => (
                            <Tr key={order.id}>
                                <Td fontWeight="bold">#{order.orderCode}</Td>
                                <Td>{order.user?.fullName || order.user?.email}</Td>
                                <Td>{formatDate(order.createdAt)}</Td>
                                <Td fontWeight="bold">{formatCurrency(order.finalPrice)}</Td>
                                <Td>{getStatusBadge(order.status)}</Td>
                                <Td>
                                    <IconButton icon={<ViewIcon />} size="sm" onClick={() => handleViewOrder(order)} />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* Modal Chi tiết đơn hàng */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Chi tiết đơn hàng #{selectedOrder?.orderCode}</ModalHeader>
                    <ModalBody>
                        {selectedOrder && (
                            <VStack align="stretch" spacing={4}>
                                <Box>
                                    <Text fontWeight="bold">Thông tin nhận hàng:</Text>
                                    <Text>{selectedOrder.address?.recipientName} - {selectedOrder.address?.phoneNumber}</Text>
                                    <Text fontSize="sm" color="gray.600">
                                        {selectedOrder.address?.addressDetail}, {selectedOrder.address?.ward}, {selectedOrder.address?.district}, {selectedOrder.address?.province}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontWeight="bold">Sản phẩm:</Text>
                                    {selectedOrder.orderItems?.map(item => (
                                        <Text key={item.id} fontSize="sm">
                                            - {item.product?.productName} x {item.quantity} 
                                            <span style={{float:'right'}}>{formatCurrency(item.totalPrice)}</span>
                                        </Text>
                                    ))}
                                </Box>
                                <Box borderTop="1px solid #eee" pt={2}>
                                    <Text fontWeight="bold">Tổng cộng: {formatCurrency(selectedOrder.finalPrice)}</Text>
                                </Box>
                                
                                <FormControl>
                                    <FormLabel fontWeight="bold">Cập nhật trạng thái:</FormLabel>
                                    <Select 
                                        defaultValue={selectedOrder.status} 
                                        onChange={(e) => handleUpdateStatus(e.target.value)}
                                    >
                                        {ORDER_STATUSES.map(s => (
                                            <option key={s.value} value={s.value} disabled={s.value === selectedOrder.status}>
                                                {s.label}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>
                            </VStack>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Đóng</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default AdminOrderPage;