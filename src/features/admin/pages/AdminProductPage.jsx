import React, { useEffect, useState } from "react";
import {
  Box, Button, Table, Thead, Tbody, Tr, Th, Td, IconButton, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  FormControl, FormLabel, Input, useToast, Heading, Flex, useColorModeValue,
  Select, Textarea, Image, HStack, ModalCloseButton, Text, Tabs, TabList, TabPanels, Tab, TabPanel, VStack, SimpleGrid, Icon, Badge
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, AddIcon, StarIcon, CloseIcon } from "@chakra-ui/icons";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";

import ProductService from "../../../services/product.service";
import AdminService from "../../../services/admin.service";
import { formatCurrency } from "../../../utils/format";

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State quản lý Form
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentProduct, setCurrentProduct] = useState(null);
  
  // 1. Basic Info State
  const [formData, setFormData] = useState({
    productName: "", description: "", originalPrice: "", salePrice: "",
    stock: "", brand: "", model: "", origin: "", categoryId: ""
  });

  // 2. Specs State (Mảng động)
  const [specs, setSpecs] = useState([{ keyName: "", value: "" }]);

  // 3. Images State (File upload)
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]); // Ảnh preview khi chọn file
  const [existingImages, setExistingImages] = useState([]); // Ảnh cũ từ server

  const toast = useToast();

  // Theme Colors
  const bg = useColorModeValue('white', '#111');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const textColor = useColorModeValue('gray.800', 'white');
  const inputBg = useColorModeValue('white', '#222');

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        ProductService.getAll({ size: 100 }), // Lấy tạm 100 sp
        ProductService.getCategories()
      ]);
      if (prodRes.success) setProducts(prodRes.data.content);
      if (catRes.success) setCategories(catRes.data);
    } catch (error) {
      toast({ title: "Lỗi tải dữ liệu", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    setCurrentProduct(null);
    setFormData({
      productName: "", description: "", originalPrice: "", salePrice: "",
      stock: "", brand: "", model: "", origin: "", categoryId: ""
    });
    setSpecs([{ keyName: "", value: "" }]);
    setSelectedFiles([]);
    setPreviewImages([]);
    setExistingImages([]);
    onOpen();
  };

  const handleOpenEdit = async (product) => {
    setCurrentProduct(product);
    // Fetch chi tiết để lấy specs và images đầy đủ
    try {
        const res = await ProductService.getById(product.id);
        if(res.success) {
            const data = res.data;
            setFormData({
                productName: data.productName,
                description: data.description,
                originalPrice: data.originalPrice,
                salePrice: data.salePrice,
                stock: data.stock,
                brand: data.brand,
                model: data.model,
                origin: data.origin,
                categoryId: data.category?.id || ""
            });
            setSpecs(data.specifications.length > 0 ? data.specifications : [{ keyName: "", value: "" }]);
            setExistingImages(data.images || []);
            setSelectedFiles([]);
            setPreviewImages([]);
            onOpen();
        }
    } catch (e) {
        toast({ title: "Lỗi tải chi tiết", status: "error" });
    }
  };

  // Logic thêm/xóa dòng thông số
  const handleAddSpec = () => setSpecs([...specs, { keyName: "", value: "" }]);
  const handleRemoveSpec = (index) => {
    const newSpecs = [...specs];
    newSpecs.splice(index, 1);
    setSpecs(newSpecs);
  };
  const handleSpecChange = (index, field, val) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = val;
    setSpecs(newSpecs);
  };

  // Logic chọn ảnh upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    // Tạo preview
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // SUBMIT FORM
  const handleSubmit = async () => {
    // 1. Validate sơ bộ
    if (!formData.productName || !formData.salePrice || !formData.categoryId) {
        toast({ title: "Vui lòng nhập đủ thông tin cơ bản", status: "warning" });
        return;
    }

    const payload = {
        ...formData,
        specifications: specs.filter(s => s.keyName && s.value) // Lọc bỏ dòng trống
    };

    try {
        let productId;
        if (currentProduct) {
            // EDIT
            await AdminService.updateProduct(currentProduct.id, payload);
            productId = currentProduct.id;
            toast({ title: "Cập nhật thông tin thành công", status: "success" });
        } else {
            // CREATE
            const res = await AdminService.createProduct(payload);
            if (res.success) {
                productId = res.data.id;
                toast({ title: "Tạo sản phẩm thành công", status: "success" });
            }
        }

        // 2. Upload ảnh (nếu có file mới)
        if (productId && selectedFiles.length > 0) {
            await AdminService.uploadMultipleImages(productId, selectedFiles);
            toast({ title: "Đã upload ảnh", status: "success" });
        }

        fetchData();
        onClose();
    } catch (error) {
        toast({ title: "Lỗi xử lý", description: error.response?.data?.message || "Có lỗi xảy ra", status: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa sản phẩm này?")) return;
    try {
      await AdminService.deleteProduct(id);
      toast({ title: "Đã xóa", status: "success" });
      fetchData();
    } catch (error) {
      toast({ title: "Lỗi xóa", status: "error" });
    }
  };

  const handleSetMainImage = async (imgId) => {
      try {
          await AdminService.setMainImage(currentProduct.id, imgId);
          toast({ title: "Đã đặt làm ảnh chính", status: "success" });
          // Reload ảnh
          const res = await ProductService.getById(currentProduct.id);
          if(res.success) setExistingImages(res.data.images);
      } catch (e) {
          toast({ title: "Lỗi", status: "error" });
      }
  };

  const handleDeleteImage = async (imgId) => {
      if(!window.confirm("Xóa ảnh này?")) return;
      try {
        await AdminService.deleteImage(currentProduct.id, imgId);
        setExistingImages(existingImages.filter(img => img.id !== imgId));
      } catch (e) {
          toast({ title: "Lỗi xóa ảnh", status: "error" });
      }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color={textColor}>Quản lý Sản phẩm</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleOpenCreate}>Thêm mới</Button>
      </Flex>

      <Box overflowX="auto" bg={bg} borderRadius="xl" border="1px solid" borderColor={borderColor}>
        <Table variant="simple">
          <Thead bg={useColorModeValue('gray.50', 'whiteAlpha.50')}>
            <Tr>
              <Th>Ảnh</Th>
              <Th>Tên sản phẩm</Th>
              <Th>Giá bán</Th>
              <Th>Kho</Th>
              <Th>Danh mục</Th>
              <Th>Hành động</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product) => (
              <Tr key={product.id}>
                <Td>
                    <Image 
                        src={product.images?.[0]?.imageUrl || "https://via.placeholder.com/50"} 
                        boxSize="50px" objectFit="contain" borderRadius="md" bg="white"
                    />
                </Td>
                <Td fontWeight="bold" maxW="200px" isTruncated>{product.productName}</Td>
                <Td color="blue.500" fontWeight="bold">{formatCurrency(product.salePrice)}</Td>
                <Td>{product.stock}</Td>
                <Td><Badge>{product.category?.categoryName}</Badge></Td>
                <Td>
                  <HStack>
                    <IconButton icon={<EditIcon />} size="sm" onClick={() => handleOpenEdit(product)} />
                    <IconButton icon={<DeleteIcon />} colorScheme="red" size="sm" onClick={() => handleDelete(product.id)} />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* MODAL FORM SUPER VIP */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent bg={bg} color={textColor}>
          <ModalHeader>{currentProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs variant="enclosed" colorScheme="blue">
                <TabList mb={4}>
                    <Tab>Thông tin chung</Tab>
                    <Tab>Thông số kỹ thuật</Tab>
                    <Tab>Hình ảnh</Tab>
                </TabList>

                <TabPanels>
                    {/* TAB 1: INFO */}
                    <TabPanel>
                        <SimpleGrid columns={2} spacing={5}>
                            <FormControl isRequired>
                                <FormLabel>Tên sản phẩm</FormLabel>
                                <Input value={formData.productName} onChange={(e) => setFormData({...formData, productName: e.target.value})} bg={inputBg} />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Danh mục</FormLabel>
                                <Select value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} bg={inputBg}>
                                    <option value="">-- Chọn --</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.categoryName}</option>)}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Giá gốc</FormLabel>
                                <Input type="number" value={formData.originalPrice} onChange={(e) => setFormData({...formData, originalPrice: e.target.value})} bg={inputBg} />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Giá bán</FormLabel>
                                <Input type="number" value={formData.salePrice} onChange={(e) => setFormData({...formData, salePrice: e.target.value})} bg={inputBg} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Thương hiệu</FormLabel>
                                <Input value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} bg={inputBg} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Model</FormLabel>
                                <Input value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} bg={inputBg} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Tồn kho</FormLabel>
                                <Input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} bg={inputBg} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Xuất xứ</FormLabel>
                                <Input value={formData.origin} onChange={(e) => setFormData({...formData, origin: e.target.value})} bg={inputBg} />
                            </FormControl>
                        </SimpleGrid>
                        <FormControl mt={4}>
                            <FormLabel>Mô tả chi tiết</FormLabel>
                            <Textarea rows={6} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} bg={inputBg} />
                        </FormControl>
                    </TabPanel>

                    {/* TAB 2: SPECS */}
                    <TabPanel>
                        <VStack spacing={3} align="stretch">
                            {specs.map((spec, index) => (
                                <HStack key={index}>
                                    <Input placeholder="Tên thông số (VD: RAM)" value={spec.keyName} onChange={(e) => handleSpecChange(index, 'keyName', e.target.value)} bg={inputBg} />
                                    <Input placeholder="Giá trị (VD: 8GB)" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} bg={inputBg} />
                                    <IconButton icon={<DeleteIcon />} colorScheme="red" variant="ghost" onClick={() => handleRemoveSpec(index)} />
                                </HStack>
                            ))}
                            <Button leftIcon={<AddIcon />} onClick={handleAddSpec} variant="outline" borderStyle="dashed">Thêm dòng thông số</Button>
                        </VStack>
                    </TabPanel>

                    {/* TAB 3: IMAGES */}
                    <TabPanel>
                        <FormControl mb={6}>
                            <FormLabel>Tải ảnh mới (Chọn nhiều ảnh)</FormLabel>
                            <Box border="2px dashed" borderColor="gray.300" borderRadius="md" p={6} textAlign="center" cursor="pointer" _hover={{ borderColor: "blue.500" }} position="relative">
                                <Input type="file" multiple accept="image/*" position="absolute" top={0} left={0} w="full" h="full" opacity={0} cursor="pointer" onChange={handleFileChange} />
                                <Icon as={FaCloudUploadAlt} w={10} h={10} color="gray.400" />
                                <Text mt={2}>Kéo thả hoặc click để chọn ảnh</Text>
                            </Box>
                        </FormControl>

                        {/* Preview New Images */}
                        {previewImages.length > 0 && (
                            <Box mb={6}>
                                <Text fontWeight="bold" mb={2}>Ảnh chuẩn bị upload:</Text>
                                <HStack spacing={4} overflowX="auto">
                                    {previewImages.map((src, idx) => (
                                        <Image key={idx} src={src} boxSize="100px" objectFit="cover" borderRadius="md" />
                                    ))}
                                </HStack>
                            </Box>
                        )}

                        {/* Existing Images (Only in Edit Mode) */}
                        {currentProduct && existingImages.length > 0 && (
                            <Box>
                                <Text fontWeight="bold" mb={2}>Ảnh hiện có (Click ngôi sao để chọn ảnh chính):</Text>
                                <SimpleGrid columns={4} spacing={4}>
                                    {existingImages.map((img) => (
                                        <Box key={img.id} position="relative" border={img.main ? "2px solid" : "1px solid"} borderColor={img.main ? "blue.500" : "gray.600"} borderRadius="md" overflow="hidden">
                                            <Image src={img.imageUrl} w="full" h="100px" objectFit="cover" bg="white" />
                                            <Flex position="absolute" bottom={0} left={0} right={0} bg="rgba(0,0,0,0.6)" p={1} justify="space-between">
                                                <IconButton 
                                                    icon={<StarIcon />} size="xs" 
                                                    colorScheme={img.main ? "yellow" : "gray"} 
                                                    variant={img.main ? "solid" : "ghost"}
                                                    onClick={() => handleSetMainImage(img.id)}
                                                />
                                                <IconButton 
                                                    icon={<FaTrash />} size="xs" colorScheme="red" variant="ghost" 
                                                    onClick={() => handleDeleteImage(img.id)}
                                                />
                                            </Flex>
                                        </Box>
                                    ))}
                                </SimpleGrid>
                            </Box>
                        )}
                    </TabPanel>
                </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter borderTop="1px solid" borderColor={borderColor}>
            <Button variant="ghost" mr={3} onClick={onClose}>Hủy</Button>
            <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading}>
                {currentProduct ? "Cập nhật" : "Tạo mới"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminProductPage;