import React, { useEffect, useState } from 'react';
import {
    Box, Button, Table, Thead, Tbody, Tr, Th, Td, IconButton, useDisclosure,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    FormControl, FormLabel, Input, useToast, Heading, Flex, useColorModeValue,
    Select, Textarea, Image, HStack, Text
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import ProductService from '../../../services/product.service';
import AdminService from '../../../services/admin.service';
import { formatCurrency } from '../../../utils/format';

const AdminProductPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [currentProduct, setCurrentProduct] = useState(null);
    const toast = useToast();

    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        originalPrice: '',
        salePrice: '',
        stock: '',
        brand: '',
        model: '',
        origin: '',
        categoryId: ''
    });

    const bg = useColorModeValue('white', 'gray.800');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                ProductService.getAll({ size: 100 }),  
                ProductService.getCategories()
            ]);
            
            if (prodRes.success) setProducts(prodRes.data.content || []);
            if (catRes.success) setCategories(catRes.data);
        } catch (error) {
            toast({ title: 'Lỗi tải dữ liệu', status: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (product = null) => {
        if (product) {
            setCurrentProduct(product);
            setFormData({
                productName: product.productName,
                description: product.description || '',
                originalPrice: product.originalPrice,
                salePrice: product.salePrice,
                stock: product.stock,
                brand: product.brand || '',
                model: product.model || '',
                origin: product.origin || '',
                categoryId: product.category?.id || ''
            });
        } else {
            setCurrentProduct(null);
            setFormData({
                productName: '', description: '', originalPrice: '', salePrice: '',
                stock: '', brand: '', model: '', origin: '', categoryId: ''
            });
        }
        onOpen();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (!formData.productName || !formData.salePrice || !formData.categoryId) {
                toast({ title: 'Vui lòng điền các trường bắt buộc (*)', status: 'warning' });
                return;
            }

            const payload = {
                ...formData,
                originalPrice: parseInt(formData.originalPrice),
                salePrice: parseInt(formData.salePrice),
                stock: parseInt(formData.stock),
                categoryId: parseInt(formData.categoryId)
            };

            if (currentProduct) {
                await AdminService.updateProduct(currentProduct.id, payload);
                toast({ title: 'Cập nhật thành công', status: 'success' });
            } else {
                await AdminService.createProduct(payload);
                toast({ title: 'Tạo sản phẩm thành công', status: 'success' });
            }
            fetchData();
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
        if (!window.confirm('Xóa sản phẩm này?')) return;
        try {
            await AdminService.deleteProduct(id);
            toast({ title: 'Đã xóa', status: 'success' });
            fetchData();
        } catch (error) {
            toast({ title: 'Lỗi xóa', status: 'error' });
        }
    };

    return (
        <Box bg={bg} p={6} borderRadius="lg" shadow="sm">
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="md">Quản lý Sản phẩm</Heading>
                <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={() => handleOpenModal()}>
                    Thêm sản phẩm
                </Button>
            </Flex>

            <Box overflowX="auto">
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Ảnh</Th>
                            <Th>Tên sản phẩm</Th>
                            <Th>Giá bán</Th>
                            <Th>Tồn kho</Th>
                            <Th>Danh mục</Th>
                            <Th>Hành động</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {products.map((p) => (
                            <Tr key={p.id}>
                                <Td>{p.id}</Td>
                                <Td>
                                    <Image 
                                        src={p.images?.[0]?.imageUrl || 'https://via.placeholder.com/50'} 
                                        boxSize="50px" objectFit="cover" borderRadius="md"
                                    />
                                </Td>
                                <Td maxW="200px" isTruncated title={p.productName} fontWeight="bold">
                                    {p.productName}
                                </Td>
                                <Td color="blue.500" fontWeight="bold">{formatCurrency(p.salePrice)}</Td>
                                <Td>{p.stock}</Td>
                                <Td>{p.category?.categoryName}</Td>
                                <Td>
                                    <HStack spacing={2}>
                                        <IconButton icon={<EditIcon />} size="sm" onClick={() => handleOpenModal(p)} />
                                        <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => handleDelete(p.id)} />
                                    </HStack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* Modal Form */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{currentProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</ModalHeader>
                    <ModalBody>
                        <Flex direction="column" gap={4}>
                            <FormControl isRequired>
                                <FormLabel>Tên sản phẩm</FormLabel>
                                <Input name="productName" value={formData.productName} onChange={handleChange} />
                            </FormControl>
                            
                            <Flex gap={4}>
                                <FormControl isRequired>
                                    <FormLabel>Danh mục</FormLabel>
                                    <Select name="categoryId" value={formData.categoryId} onChange={handleChange} placeholder="Chọn danh mục">
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.categoryName}</option>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Thương hiệu</FormLabel>
                                    <Input name="brand" value={formData.brand} onChange={handleChange} />
                                </FormControl>
                            </Flex>

                            <Flex gap={4}>
                                <FormControl isRequired>
                                    <FormLabel>Giá gốc</FormLabel>
                                    <Input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Giá bán</FormLabel>
                                    <Input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Kho</FormLabel>
                                    <Input type="number" name="stock" value={formData.stock} onChange={handleChange} />
                                </FormControl>
                            </Flex>

                            <FormControl>
                                <FormLabel>Mô tả</FormLabel>
                                <Textarea name="description" value={formData.description} onChange={handleChange} />
                            </FormControl>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>Hủy</Button>
                        <Button colorScheme="blue" onClick={handleSubmit}>Lưu</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default AdminProductPage;