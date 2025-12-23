// src/features/admin/pages/AdminOrderPage.jsx
import React, { useEffect, useState } from 'react';
import {
    Box, Button, Table, Thead, Tbody, Tr, Th, Td, IconButton, useDisclosure,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Select, useToast, Heading, Badge, Text, VStack, useColorModeValue, Flex, Divider, ModalCloseButton, Spinner
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import AdminService from '../../../services/admin.service';
import { formatCurrency, formatDate } from '../../../utils/format';

const AdminOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true); // Thêm state loading
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
        { value: 'PROCESSING', label: 'Đang xử lý', color: 'purple' },
        { value: 'SHIPPING', label: 'Đang giao', color: 'cyan' },
        { value: 'DELIVERED', label: 'Đã giao', color: 'green' },
        { value: 'CANCELLED', label: 'Đã hủy', color: 'red' },
        { value: 'RETURNED', label: 'Trả hàng', color: 'orange' },
    ];

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Lưu ý: Param page/size gửi lên nhưng nếu BE trả về List thì vẫn nhận List
            const res = await AdminService.getAllOrders({ page: 0, size: 100 });
            
            if (res.success) {
                // --- FIX LOGIC LẤY DATA ---
                // Kiểm tra nếu có .content (dạng Page) thì lấy .content
                // Nếu không có (dạng List) thì lấy trực tiếp res.data
                const orderData = res.data.content ? res.data.content : res.data;
                
                if (Array.isArray(orderData)) {
                    setOrders(orderData);
                } else {
                    setOrders([]);
                }
            }
        } catch (error) {
            console.error("Lỗi fetch orders:", error);
            toast({ title: 'Không thể tải danh sách đơn hàng', status: 'error' });
        } finally {
            setLoading(false);
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
            toast({ title: 'Cập nhật trạng thái thành công', status: 'success' });
            
            // Cập nhật lại list bên ngoài
            fetchOrders();
            
            // Cập nhật lại state trong modal để UI đổi ngay lập tức
            setSelectedOrder(prev => ({ ...prev, status: newStatus }));
            
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
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="md" color={textColor}>Quản lý Đơn hàng</Heading>
                <Button size="sm" onClick={fetchOrders} isLoading={loading}>Làm mới</Button>
            </Flex>
            
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
                        {loading ? (
                            <Tr>
                                <Td colSpan={6} textAlign="center"><Spinner /></Td>
                            </Tr>
                        ) : orders.length === 0 ? (
                            <Tr>
                                <Td colSpan={6} textAlign="center" py={4} color="gray.500">Chưa có đơn hàng nào</Td>
                            </Tr>
                        ) : (
                            orders.map((order) => (
                                <Tr key={order.id} _hover={{ bg: "whiteAlpha.50" }}>
                                    <Td fontWeight="bold" color={textColor}>#{order.orderCode}</Td>
                                    <Td color={textColor}>
                                        <Text fontWeight="bold" fontSize="sm">{order.user?.fullName || "Khách lẻ"}</Text>
                                        <Text fontSize="xs" color="gray.500">{order.user?.email}</Text>
                                    </Td>
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
                            ))
                        )}
                    </Tbody>
                </Table>
            </Box>

            {/* Modal Chi tiết đơn hàng */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
                <ModalOverlay backdropFilter="blur(5px)" />
                <ModalContent bg={modalBg} color={textColor} border="1px solid" borderColor={borderColor}>
                    <ModalHeader borderBottom="1px solid" borderColor={borderColor}>
                        Chi tiết đơn hàng #{selectedOrder?.orderCode}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={6}>
                        {selectedOrder && (
                            <VStack align="stretch" spacing={6}>
                                {/* 1. Thông tin người nhận & Trạng thái */}
                                <Flex justify="space-between" align="start" gap={4} direction={{ base: "column", md: "row" }}>
                                    <Box flex="1">
                                        <Text fontWeight="bold" color="blue.400" mb={2}>Người nhận</Text>
                                        <Box p={3} bg="whiteAlpha.100" borderRadius="md">
                                            <Text fontWeight="bold">{selectedOrder.address?.recipientName}</Text>
                                            <Text fontSize="sm">{selectedOrder.address?.phoneNumber}</Text>
                                            <Divider my={2} borderColor="whiteAlpha.300"/>
                                            <Text fontSize="sm" color="gray.400">
                                                {selectedOrder.address?.addressDetail}, {selectedOrder.address?.ward}, {selectedOrder.address?.district}, {selectedOrder.address?.province}
                                            </Text>
                                        </Box>
                                    </Box>
                                    
                                    <Box w={{ base: "100%", md: "250px" }}>
                                        <Text fontWeight="bold" color="blue.400" mb={2}>Cập nhật trạng thái</Text>
                                        <Select 
                                            value={selectedOrder.status} 
                                            onChange={(e) => handleUpdateStatus(e.target.value)}
                                            bg="whiteAlpha.100" borderColor={borderColor}
                                            color={textColor}
                                            sx={{ option: { color: 'black' } }}
                                        >
                                            {ORDER_STATUSES.map(s => (
                                                <option key={s.value} value={s.value}>
                                                    {s.label}
                                                </option>
                                            ))}
                                        </Select>
                                        {/* Hiển thị payment method */}
                                        <Badge mt={3} colorScheme={selectedOrder.paymentMethod === 'VNPAY' ? 'purple' : 'orange'}>
                                            {selectedOrder.paymentMethod}
                                        </Badge>
                                    </Box>
                                </Flex>
                                
                                {/* 2. Danh sách sản phẩm */}
                                <Box>
                                    <Text fontWeight="bold" color="blue.400" mb={2}>Sản phẩm ({selectedOrder.orderItems?.length})</Text>
                                    <VStack align="stretch" spacing={3} maxH="300px" overflowY="auto" pr={2}>
                                        {selectedOrder.orderItems?.map(item => (
                                            <Flex key={item.id} justify="space-between" align="center" p={3} bg="whiteAlpha.50" borderRadius="md" border="1px solid" borderColor={borderColor}>
                                                <Flex align="center" gap={3}>
                                                    {/* Ảnh nhỏ */}
                                                    <Box w="40px" h="40px" bg="white" borderRadius="md" overflow="hidden">
                                                        <img src={item.product?.mainImage} alt="" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                                                    </Box>
                                                    <Box>
                                                        <Text fontSize="sm" fontWeight="bold" noOfLines={1}>{item.product?.productName}</Text>
                                                        <Text fontSize="xs" color="gray.500">SL: {item.quantity} x {formatCurrency(item.price)}</Text>
                                                    </Box>
                                                </Flex>
                                                <Text fontWeight="bold" fontSize="sm">{formatCurrency(item.totalPrice)}</Text>
                                            </Flex>
                                        ))}
                                    </VStack>
                                </Box>

                                <Divider borderColor={borderColor} />
                                
                                {/* 3. Tổng tiền */}
                                <VStack align="stretch" spacing={1}>
                                    <Flex justify="space-between">
                                        <Text color="gray.500">Tiền hàng:</Text>
                                        <Text>{formatCurrency(selectedOrder.totalPrice)}</Text>
                                    </Flex>
                                    <Flex justify="space-between">
                                        <Text color="gray.500">Phí ship:</Text>
                                        <Text>{formatCurrency(selectedOrder.shippingFee)}</Text>
                                    </Flex>
                                    <Flex justify="space-between" pt={2} borderTop="1px dashed" borderColor="whiteAlpha.300">
                                        <Text fontWeight="bold" fontSize="lg">Tổng cộng:</Text>
                                        <Text fontSize="xl" fontWeight="bold" color="blue.400">{formatCurrency(selectedOrder.finalPrice)}</Text>
                                    </Flex>
                                </VStack>
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