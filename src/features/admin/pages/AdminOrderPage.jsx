// src/features/admin/pages/AdminOrderPage.jsx
import React, { useEffect, useState } from 'react';
import {
    Box, Button, Table, Thead, Tbody, Tr, Th, Td, IconButton, useDisclosure,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Select, useToast, Heading, Badge, Text, VStack, useColorModeValue, Flex, Divider, ModalCloseButton
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import AdminService from '../../../services/admin.service';
import { formatCurrency, formatDate } from '../../../utils/format';

const AdminOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    // Theme Colors
    const bg = useColorModeValue('white', '#111');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const headerBg = useColorModeValue('gray.50', '#1a1a1a');
    const textColor = useColorModeValue('gray.800', 'white');
    const modalBg = useColorModeValue('white', '#1a1a1a');

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

    useEffect(() => { fetchOrders(); }, []);

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        onOpen();
    };

    const handleUpdateStatus = async (newStatus) => {
        if (!selectedOrder) return;
        try {
            await AdminService.updateOrderStatus(selectedOrder.id, newStatus);
            toast({ title: 'Cập nhật thành công', status: 'success' });
            fetchOrders();
            onClose();
        } catch (error) {
            toast({ title: 'Lỗi cập nhật', description: error.response?.data?.message, status: 'error' });
        }
    };

    const getStatusBadge = (status) => {
        const s = ORDER_STATUSES.find(item => item.value === status) || { label: status, color: 'gray' };
        return <Badge colorScheme={s.color} variant="solid" borderRadius="md">{s.label}</Badge>;
    };

    return (
        <Box bg={bg} p={6} borderRadius="2xl" border="1px solid" borderColor={borderColor} shadow="lg">
            <Heading size="md" mb={6} color={textColor}>Quản lý Đơn hàng</Heading>
            
            <Box overflowX="auto">
                <Table variant="simple">
                    <Thead bg={headerBg}>
                        <Tr>
                            <Th color="gray.400">Mã đơn</Th>
                            <Th color="gray.400">Khách hàng</Th>
                            <Th color="gray.400">Ngày đặt</Th>
                            <Th color="gray.400" isNumeric>Tổng tiền</Th>
                            <Th color="gray.400">Trạng thái</Th>
                            <Th color="gray.400">Chi tiết</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {orders.map((order) => (
                            <Tr key={order.id} _hover={{ bg: "whiteAlpha.50" }}>
                                <Td fontWeight="bold" color={textColor}>#{order.orderCode}</Td>
                                <Td color={textColor}>{order.user?.fullName || order.user?.email}</Td>
                                <Td color="gray.500">{formatDate(order.createdAt)}</Td>
                                <Td fontWeight="bold" color="blue.400" isNumeric>{formatCurrency(order.finalPrice)}</Td>
                                <Td>{getStatusBadge(order.status)}</Td>
                                <Td>
                                    <IconButton 
                                        icon={<ViewIcon />} size="sm" variant="ghost" color="blue.400" 
                                        onClick={() => handleViewOrder(order)} 
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* Modal Chi tiết đơn hàng */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay backdropFilter="blur(5px)" />
                <ModalContent bg={modalBg} color={textColor} border="1px solid" borderColor={borderColor}>
                    <ModalHeader borderBottom="1px solid" borderColor={borderColor}>
                        Chi tiết đơn hàng #{selectedOrder?.orderCode}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={6}>
                        {selectedOrder && (
                            <VStack align="stretch" spacing={6}>
                                <Box>
                                    <Text fontWeight="bold" color="blue.400" mb={2}>Thông tin nhận hàng</Text>
                                    <Box p={3} bg="whiteAlpha.50" borderRadius="md">
                                        <Text fontWeight="bold">{selectedOrder.address?.recipientName} - {selectedOrder.address?.phoneNumber}</Text>
                                        <Text fontSize="sm" color="gray.400">
                                            {selectedOrder.address?.addressDetail}, {selectedOrder.address?.ward}, {selectedOrder.address?.district}, {selectedOrder.address?.province}
                                        </Text>
                                    </Box>
                                </Box>
                                
                                <Box>
                                    <Text fontWeight="bold" color="blue.400" mb={2}>Sản phẩm</Text>
                                    <VStack align="stretch" spacing={2}>
                                        {selectedOrder.orderItems?.map(item => (
                                            <Flex key={item.id} justify="space-between" p={2} bg="whiteAlpha.50" borderRadius="md">
                                                <Text fontSize="sm" noOfLines={1} maxW="70%">
                                                    {item.product?.productName} <Text as="span" color="gray.500">x{item.quantity}</Text>
                                                </Text>
                                                <Text fontWeight="bold" fontSize="sm">{formatCurrency(item.totalPrice)}</Text>
                                            </Flex>
                                        ))}
                                    </VStack>
                                </Box>

                                <Divider borderColor={borderColor} />
                                
                                <Flex justify="space-between" align="center">
                                    <Text fontWeight="bold">Tổng cộng:</Text>
                                    <Text fontSize="xl" fontWeight="bold" color="blue.400">{formatCurrency(selectedOrder.finalPrice)}</Text>
                                </Flex>
                                
                                <Box>
                                    <Text fontWeight="bold" mb={2}>Cập nhật trạng thái:</Text>
                                    <Select 
                                        defaultValue={selectedOrder.status} 
                                        onChange={(e) => handleUpdateStatus(e.target.value)}
                                        bg="whiteAlpha.100" borderColor={borderColor}
                                        color={textColor}
                                        sx={{ option: { color: 'black' } }} // Fix màu option trên nền đen
                                    >
                                        {ORDER_STATUSES.map(s => (
                                            <option key={s.value} value={s.value} disabled={s.value === selectedOrder.status}>
                                                {s.label}
                                            </option>
                                        ))}
                                    </Select>
                                </Box>
                            </VStack>
                        )}
                    </ModalBody>
                    <ModalFooter borderTop="1px solid" borderColor={borderColor}>
                        <Button variant="ghost" onClick={onClose} color="gray.400">Đóng</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default AdminOrderPage;