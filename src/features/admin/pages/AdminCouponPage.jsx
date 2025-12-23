import React, { useEffect, useState } from 'react';
import {
    Box, Button, Table, Thead, Tbody, Tr, Th, Td, IconButton, useDisclosure,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    FormControl, FormLabel, Input, useToast, Heading, Flex, useColorModeValue,
    ModalCloseButton, Select, NumberInput, NumberInputField, Text, Badge,
    VStack, SimpleGrid, Tooltip, Tag
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon, InfoIcon } from '@chakra-ui/icons';
import { FaTicketAlt } from 'react-icons/fa';
import CouponService from '../../../services/couponService';

const AdminCouponPage = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [currentCoupon, setCurrentCoupon] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: 0,
        minOrderValue: 0,
        maxDiscountAmount: 0,
        startDate: '',
        endDate: '',
        usageLimit: 100,
        description: ''
    });
    const toast = useToast();

    // Theme Colors
    const bg = useColorModeValue('white', '#111');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const headerBg = useColorModeValue('gray.50', '#1a1a1a');
    const textColor = useColorModeValue('gray.800', 'white');
    const inputBg = useColorModeValue('white', '#222');

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await CouponService.getAllCoupons();
            // Res should be a list based on controller return type
            setCoupons(res);
        } catch (error) {
            toast({ title: 'Lỗi tải danh sách coupon', status: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCoupons(); }, []);

    const handleOpenModal = (coupon = null) => {
        if (coupon) {
            setCurrentCoupon(coupon);
            setFormData({
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                minOrderValue: coupon.minOrderValue || 0,
                maxDiscountAmount: coupon.maxDiscountAmount || 0,
                startDate: coupon.startDate ? coupon.startDate.substring(0, 16) : '',
                endDate: coupon.endDate ? coupon.endDate.substring(0, 16) : '',
                usageLimit: coupon.usageLimit || 0,
                description: coupon.description || ''
            });
        } else {
            setCurrentCoupon(null);
            setFormData({
                code: '',
                discountType: 'PERCENTAGE',
                discountValue: 0,
                minOrderValue: 0,
                maxDiscountAmount: 0,
                startDate: '',
                endDate: '',
                usageLimit: 100,
                description: ''
            });
        }
        onOpen();
    };

    const handleSubmit = async () => {
        if (!formData.code.trim()) {
            toast({ title: 'Vui lòng nhập mã coupon', status: 'warning' });
            return;
        }
        try {
            if (currentCoupon) {
                await CouponService.updateCoupon(currentCoupon.id, formData);
                toast({ title: 'Cập nhật thành công', status: 'success' });
            } else {
                await CouponService.createCoupon(formData);
                toast({ title: 'Tạo mới thành công', status: 'success' });
            }
            fetchCoupons(); onClose();
        } catch (error) {
            toast({ title: 'Thất bại', description: error.response?.data?.message || 'Có lỗi xảy ra', status: 'error' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn vô hiệu hóa mã này?')) return;
        try {
            await CouponService.deactivateCoupon(id);
            toast({ title: 'Vô hiệu hóa thành công', status: 'success' });
            fetchCoupons();
        } catch (error) {
            toast({ title: 'Thất bại', status: 'error' });
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const getDiscountLabel = (coupon) => {
        if (coupon.discountType === 'PERCENTAGE') return `${coupon.discountValue}%`;
        if (coupon.discountType === 'FIXED_AMOUNT') return formatCurrency(coupon.discountValue);
        if (coupon.discountType === 'FREE_SHIPPING') return 'Free Ship';
        return coupon.discountValue;
    };

    return (
        <Box bg={bg} p={6} borderRadius="2xl" border="1px solid" borderColor={borderColor} shadow="lg">
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="md" color={textColor} display="flex" alignItems="center">
                    <FaTicketAlt style={{ marginRight: '8px' }} /> Quản lý Mã giảm giá
                </Heading>
                <Button leftIcon={<AddIcon />} colorScheme="blue" size="sm" onClick={() => handleOpenModal()}>
                    Tạo mã mới
                </Button>
            </Flex>

            <Box overflowX="auto">
                <Table variant="simple">
                    <Thead bg={headerBg}>
                        <Tr>
                            <Th color="gray.400">Code</Th>
                            <Th color="gray.400">Loại</Th>
                            <Th color="gray.400">Giá trị</Th>
                            <Th color="gray.400">Đơn tối thiểu</Th>
                            <Th color="gray.400">Sử dụng</Th>
                            <Th color="gray.400">Thời hạn</Th>
                            <Th color="gray.400" isNumeric>Thao tác</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {coupons.map((coupon) => (
                            <Tr key={coupon.id} _hover={{ bg: "whiteAlpha.50" }}>
                                <Td borderBottomColor={borderColor}>
                                    <Badge colorScheme="purple" fontSize="0.9em" p={1} borderRadius="md">
                                        {coupon.code}
                                    </Badge>
                                </Td>
                                <Td borderBottomColor={borderColor}>
                                    <Tag size="sm" variant="subtle" colorScheme="blue">
                                        {coupon.discountType}
                                    </Tag>
                                </Td>
                                <Td borderBottomColor={borderColor} fontWeight="bold" color="green.500">
                                    {getDiscountLabel(coupon)}
                                </Td>
                                <Td borderBottomColor={borderColor} color={textColor}>
                                    {formatCurrency(coupon.minOrderValue)}
                                </Td>
                                <Td borderBottomColor={borderColor} color={textColor}>
                                    {coupon.remainingUsage !== null ? `${coupon.remainingUsage} lượt` : 'Vô hạn'}
                                </Td>
                                <Td borderBottomColor={borderColor} fontSize="xs" color="gray.500">
                                    <Text>Từ: {new Date(coupon.startDate).toLocaleString('vi-VN')}</Text>
                                    <Text>Đến: {new Date(coupon.endDate).toLocaleString('vi-VN')}</Text>
                                </Td>
                                <Td borderBottomColor={borderColor} isNumeric>
                                    <IconButton icon={<EditIcon />} mr={2} colorScheme="blue" variant="ghost" size="sm" onClick={() => handleOpenModal(coupon)} />
                                    <IconButton icon={<DeleteIcon />} colorScheme="red" variant="ghost" size="sm" onClick={() => handleDelete(coupon.id)} />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay backdropFilter="blur(5px)" />
                <ModalContent bg={bg} color={textColor} border="1px solid" borderColor={borderColor}>
                    <ModalHeader borderBottom="1px solid" borderColor={borderColor}>
                        {currentCoupon ? 'Cập nhật mã giảm giá' : 'Tạo mã giảm giá mới'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={6}>
                        <VStack spacing={4}>
                            <SimpleGrid columns={2} spacing={4} w="full">
                                <FormControl isRequired>
                                    <FormLabel>Mã Coupon</FormLabel>
                                    <Input
                                        placeholder="VÍ DỤ: GIAM30K"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        bg={inputBg} borderColor={borderColor}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Loại giảm giá</FormLabel>
                                    <Select
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                        bg={inputBg} borderColor={borderColor}
                                    >
                                        <option value="PERCENTAGE">Phần trăm (%)</option>
                                        <option value="FIXED_AMOUNT">Số tiền cố định (VND)</option>
                                        <option value="FREE_SHIPPING">Miễn phí vận chuyển</option>
                                    </Select>
                                </FormControl>
                            </SimpleGrid>

                            <SimpleGrid columns={2} spacing={4} w="full">
                                <FormControl isRequired={formData.discountType !== 'FREE_SHIPPING'}>
                                    <FormLabel>Giá trị giảm</FormLabel>
                                    <NumberInput
                                        min={0}
                                        value={formData.discountValue}
                                        onChange={(val) => setFormData({ ...formData, discountValue: parseInt(val) || 0 })}
                                    >
                                        <NumberInputField bg={inputBg} borderColor={borderColor} />
                                    </NumberInput>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Đơn hàng tối thiểu</FormLabel>
                                    <NumberInput
                                        min={0}
                                        value={formData.minOrderValue}
                                        onChange={(val) => setFormData({ ...formData, minOrderValue: parseInt(val) || 0 })}
                                    >
                                        <NumberInputField bg={inputBg} borderColor={borderColor} />
                                    </NumberInput>
                                </FormControl>
                            </SimpleGrid>

                            <SimpleGrid columns={2} spacing={4} w="full">
                                <FormControl>
                                    <FormLabel>Giảm tối đa (Cho %)</FormLabel>
                                    <NumberInput
                                        min={0}
                                        value={formData.maxDiscountAmount}
                                        onChange={(val) => setFormData({ ...formData, maxDiscountAmount: parseInt(val) || 0 })}
                                    >
                                        <NumberInputField bg={inputBg} borderColor={borderColor} />
                                    </NumberInput>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Giới hạn lượt dùng</FormLabel>
                                    <NumberInput
                                        min={0}
                                        value={formData.usageLimit}
                                        onChange={(val) => setFormData({ ...formData, usageLimit: parseInt(val) || 0 })}
                                    >
                                        <NumberInputField bg={inputBg} borderColor={borderColor} />
                                    </NumberInput>
                                </FormControl>
                            </SimpleGrid>

                            <SimpleGrid columns={2} spacing={4} w="full">
                                <FormControl isRequired>
                                    <FormLabel>Ngày bắt đầu</FormLabel>
                                    <Input
                                        type="datetime-local"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        bg={inputBg} borderColor={borderColor}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Ngày kết thúc</FormLabel>
                                    <Input
                                        type="datetime-local"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        bg={inputBg} borderColor={borderColor}
                                    />
                                </FormControl>
                            </SimpleGrid>

                            <FormControl>
                                <FormLabel>Mô tả</FormLabel>
                                <Input
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    bg={inputBg} borderColor={borderColor}
                                    placeholder="Mô tả ngắn gọn về chương trình"
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter borderTop="1px solid" borderColor={borderColor}>
                        <Button variant="ghost" mr={3} onClick={onClose} color="gray.400">Hủy</Button>
                        <Button colorScheme="blue" onClick={handleSubmit}>Lưu</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default AdminCouponPage;
