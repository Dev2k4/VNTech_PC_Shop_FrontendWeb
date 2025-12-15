// src/features/admin/pages/AdminCategoryPage.jsx
import React, { useEffect, useState } from 'react';
import {
    Box, Button, Table, Thead, Tbody, Tr, Th, Td, IconButton, useDisclosure,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    FormControl, FormLabel, Input, useToast, Heading, Flex, useColorModeValue,
    ModalCloseButton
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import ProductService from '../../../services/product.service';
import AdminService from '../../../services/admin.service';

const AdminCategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formData, setFormData] = useState({ categoryName: '' });
    const toast = useToast();

    // Theme Colors
    const bg = useColorModeValue('white', '#111');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const headerBg = useColorModeValue('gray.50', '#1a1a1a');
    const textColor = useColorModeValue('gray.800', 'white');
    const inputBg = useColorModeValue('white', '#222');

    const fetchCategories = async () => {
        try {
            const res = await ProductService.getCategories();
            if (res.success) setCategories(res.data);
        } catch (error) {
            toast({ title: 'Lỗi tải danh mục', status: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleOpenModal = (category = null) => {
        if (category) {
            setCurrentCategory(category);
            setFormData({ categoryName: category.categoryName });
        } else {
            setCurrentCategory(null);
            setFormData({ categoryName: '' });
        }
        onOpen();
    };

    const handleSubmit = async () => {
        if (!formData.categoryName.trim()) {
            toast({ title: 'Vui lòng nhập tên danh mục', status: 'warning' });
            return;
        }
        try {
            if (currentCategory) {
                await AdminService.updateCategory(currentCategory.id, formData);
                toast({ title: 'Cập nhật thành công', status: 'success' });
            } else {
                await AdminService.createCategory(formData);
                toast({ title: 'Tạo mới thành công', status: 'success' });
            }
            fetchCategories(); onClose();
        } catch (error) {
            toast({ title: 'Thất bại', description: error.response?.data?.message, status: 'error' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;
        try {
            await AdminService.deleteCategory(id);
            toast({ title: 'Xóa thành công', status: 'success' });
            fetchCategories();
        } catch (error) {
            toast({ title: 'Xóa thất bại', description: 'Danh mục đang được sử dụng', status: 'error' });
        }
    };

    return (
        <Box bg={bg} p={6} borderRadius="2xl" border="1px solid" borderColor={borderColor} shadow="lg">
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="md" color={textColor}>Quản lý Danh mục</Heading>
                <Button leftIcon={<AddIcon />} colorScheme="blue" size="sm" onClick={() => handleOpenModal()}>
                    Tạo mới
                </Button>
            </Flex>

            <Table variant="simple">
                <Thead bg={headerBg}>
                    <Tr>
                        <Th color="gray.400">ID</Th>
                        <Th color="gray.400">Tên danh mục</Th>
                        <Th color="gray.400">Ngày tạo</Th>
                        <Th color="gray.400" isNumeric>Hành động</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {categories.map((cat) => (
                        <Tr key={cat.id} _hover={{ bg: "whiteAlpha.50" }}>
                            <Td borderBottomColor={borderColor} color={textColor}>{cat.id}</Td>
                            <Td borderBottomColor={borderColor} fontWeight="bold" color={textColor}>{cat.categoryName}</Td>
                            <Td borderBottomColor={borderColor} color="gray.500">{cat.createdDate ? new Date(cat.createdDate).toLocaleDateString('vi-VN') : 'N/A'}</Td>
                            <Td borderBottomColor={borderColor} isNumeric>
                                <IconButton icon={<EditIcon />} mr={2} colorScheme="blue" variant="ghost" size="sm" onClick={() => handleOpenModal(cat)} />
                                <IconButton icon={<DeleteIcon />} colorScheme="red" variant="ghost" size="sm" onClick={() => handleDelete(cat.id)} />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay backdropFilter="blur(5px)" />
                <ModalContent bg={bg} color={textColor} border="1px solid" borderColor={borderColor}>
                    <ModalHeader borderBottom="1px solid" borderColor={borderColor}>{currentCategory ? 'Sửa danh mục' : 'Tạo danh mục mới'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={6}>
                        <FormControl isRequired>
                            <FormLabel>Tên danh mục</FormLabel>
                            <Input 
                                value={formData.categoryName} 
                                onChange={(e) => setFormData({ categoryName: e.target.value })} 
                                bg={inputBg} borderColor={borderColor}
                                autoFocus
                            />
                        </FormControl>
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

export default AdminCategoryPage;