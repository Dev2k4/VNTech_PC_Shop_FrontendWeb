import React, { useEffect, useState } from 'react';
import { 
    Box, Button, Heading, VStack, Text, useDisclosure, HStack, 
    Badge, useColorModeValue, IconButton, useToast, Spinner, Flex 
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { FaMapMarkerAlt } from 'react-icons/fa';
import AddressService from '../../../services/address.service';
import AddressModal from './AddressModal';

const AddressBook = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    // Màu sắc
    const cardBg = useColorModeValue("white", "whiteAlpha.100");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const res = await AddressService.getMyAddresses();
            if (res.success) setAddresses(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAddresses(); }, []);

    const handleDelete = async (id) => {
        if(!window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;
        try {
            // Giả định service có hàm delete (bạn cần check lại address.service.js)
            // Nếu chưa có, hãy thêm: deleteAddress: (id) => axiosClient.delete(`/user/addresses/${id}`)
            await AddressService.deleteAddress(id); 
            toast({ title: "Đã xóa địa chỉ", status: "success" });
            fetchAddresses();
        } catch (error) {
            toast({ title: "Lỗi xóa địa chỉ", status: "error" });
        }
    };

    const handleSetDefault = async (id) => {
        try {
            // Giả định service có hàm setDefault
            // Nếu chưa có, thêm: setDefault: (id) => axiosClient.put(`/user/addresses/${id}/default`)
            await AddressService.setDefault(id);
            toast({ title: "Đã đặt làm mặc định", status: "success" });
            fetchAddresses();
        } catch (error) {
            toast({ title: "Lỗi cập nhật", status: "error" });
        }
    };

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="md">Sổ địa chỉ của tôi</Heading>
                <Button leftIcon={<AddIcon />} colorScheme="blue" size="sm" onClick={onOpen}>Thêm địa chỉ mới</Button>
            </Flex>

            {loading ? (
                <Flex justify="center"><Spinner /></Flex>
            ) : addresses.length === 0 ? (
                <Text color="gray.500" textAlign="center">Bạn chưa lưu địa chỉ nào.</Text>
            ) : (
                <VStack spacing={4} align="stretch">
                    {addresses.map(addr => (
                        <Box key={addr.id} p={4} bg={cardBg} border="1px solid" borderColor={addr.isDefault ? "blue.400" : borderColor} borderRadius="lg" position="relative">
                            <HStack justify="space-between" align="start">
                                <VStack align="start" spacing={1}>
                                    <HStack>
                                        <Text fontWeight="bold">{addr.recipientName}</Text>
                                        <Text color="gray.500">| {addr.phoneNumber}</Text>
                                        {addr.isDefault && <Badge colorScheme="green">Mặc định</Badge>}
                                    </HStack>
                                    <Text color="gray.600" fontSize="sm">
                                        {addr.addressDetail}, {addr.ward}, {addr.district}, {addr.province}
                                    </Text>
                                </VStack>
                                
                                <HStack>
                                    {!addr.isDefault && (
                                        <Button size="xs" variant="ghost" colorScheme="blue" onClick={() => handleSetDefault(addr.id)}>
                                            Đặt mặc định
                                        </Button>
                                    )}
                                    <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" variant="ghost" onClick={() => handleDelete(addr.id)} />
                                </HStack>
                            </HStack>
                        </Box>
                    ))}
                </VStack>
            )}

            <AddressModal isOpen={isOpen} onClose={onClose} onSuccess={fetchAddresses} />
        </Box>
    );
};

export default AddressBook;