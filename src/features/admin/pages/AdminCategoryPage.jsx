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
    const [currentCategory, setCurrentCategory] = useState(null); // null = tạo mới
    const [formData, setFormData] = useState({ categoryName: '' });
    const toast = useToast();

    const bg = useColorModeValue('white', 'gray.800');

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

    useEffect(() => {
        fetchCategories();
    }, []);

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
            fetchCategories();
            onClose();
        } catch (error) {
            toast({ 
                title: 'Thất bại', 
                description: error.response?.data?.message || 'Có lỗi xảy ra', 
                status: 'error' 
            });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
        try {
            await AdminService.deleteCategory(id);
            toast({ title: 'Xóa thành công', status: 'success' });
            fetchCategories();
        } catch (error) {
            toast({ title: 'Xóa thất bại', description: 'Danh mục có thể đang chứa sản phẩm', status: 'error' });
        }
    };

    return (
        <Box bg={bg} p={6} borderRadius="lg" shadow="sm">
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="md">Quản lý Danh mục</Heading>
                <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={() => handleOpenModal()}>
                    Tạo mới
                </Button>
            </Flex>

            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Tên danh mục</Th>
                        <Th>Ngày tạo</Th>
                        <Th isNumeric>Hành động</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {categories.map((cat) => (
                        <Tr key={cat.id}>
                            <Td>{cat.id}</Td>
                            <Td fontWeight="bold">{cat.categoryName}</Td>
                            <Td>{cat.createdDate ? new Date(cat.createdDate).toLocaleDateString('vi-VN') : 'N/A'}</Td>
                            <Td isNumeric>
                                <IconButton
                                    icon={<EditIcon />}
                                    mr={2}
                                    colorScheme="blue"
                                    variant="ghost"
                                    onClick={() => handleOpenModal(cat)}
                                    aria-label="Sửa"
                                />
                                <IconButton
                                    icon={<DeleteIcon />}
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => handleDelete(cat.id)}
                                    aria-label="Xóa"
                                />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            {/* Modal Form */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{currentCategory ? 'Sửa danh mục' : 'Tạo danh mục mới'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired>
                            <FormLabel>Tên danh mục</FormLabel>
                            <Input 
                                value={formData.categoryName} 
                                onChange={(e) => setFormData({ categoryName: e.target.value })} 
                                placeholder="Nhập tên danh mục..."
                                autoFocus
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>Hủy</Button>
                        <Button colorScheme="blue" onClick={handleSubmit}>
                            {currentCategory ? 'Lưu thay đổi' : 'Tạo mới'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default AdminCategoryPage;