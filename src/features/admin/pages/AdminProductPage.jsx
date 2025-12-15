// src/features/admin/pages/AdminProductPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Heading,
  Flex,
  useColorModeValue,
  Select,
  Textarea,
  Image,
  HStack,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import ProductService from "../../../services/product.service";
import AdminTableSkeleton from "../../../components/common/AdminTableSkeleton";
import AdminService from "../../../services/admin.service";
import { formatCurrency } from "../../../utils/format";

const AdminProductPage = () => {
  // ... (Giữ nguyên logic State, useEffect, handlers như cũ) ...
  // Chỉ thay đổi phần RETURN UI bên dưới
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentProduct, setCurrentProduct] = useState(null);
  const toast = useToast();
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    originalPrice: "",
    salePrice: "",
    stock: "",
    brand: "",
    model: "",
    origin: "",
    categoryId: "",
  });

  // Theme Colors
  const bg = useColorModeValue("white", "#111");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const headerBg = useColorModeValue("gray.50", "#1a1a1a");
  const textColor = useColorModeValue("gray.800", "white");
  const inputBg = useColorModeValue("white", "#222");

  // ... (Giữ nguyên functions: fetchData, handleOpenModal, handleChange, handleSubmit, handleDelete) ...
  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        ProductService.getAll({ size: 100 }),
        ProductService.getCategories(),
      ]);
      if (prodRes.success) setProducts(prodRes.data.content || []);
      if (catRes.success) setCategories(catRes.data);
    } catch (error) {
      toast({ title: "Lỗi tải dữ liệu", status: "error" });
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
        description: product.description || "",
        originalPrice: product.originalPrice,
        salePrice: product.salePrice,
        stock: product.stock,
        brand: product.brand || "",
        model: product.model || "",
        origin: product.origin || "",
        categoryId: product.category?.id || "",
      });
    } else {
      setCurrentProduct(null);
      setFormData({
        productName: "",
        description: "",
        originalPrice: "",
        salePrice: "",
        stock: "",
        brand: "",
        model: "",
        origin: "",
        categoryId: "",
      });
    }
    onOpen();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (
        !formData.productName ||
        !formData.salePrice ||
        !formData.categoryId
      ) {
        toast({ title: "Thiếu thông tin bắt buộc", status: "warning" });
        return;
      }
      const payload = {
        ...formData,
        originalPrice: parseInt(formData.originalPrice),
        salePrice: parseInt(formData.salePrice),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId),
      };
      if (currentProduct) {
        await AdminService.updateProduct(currentProduct.id, payload);
        toast({ title: "Đã cập nhật", status: "success" });
      } else {
        await AdminService.createProduct(payload);
        toast({ title: "Đã tạo mới", status: "success" });
      }
      fetchData();
      onClose();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message,
        status: "error",
      });
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

  return (
    <Box
      bg={bg}
      p={6}
      borderRadius="2xl"
      border="1px solid"
      borderColor={borderColor}
    >
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="md" color={textColor}>
          Quản lý Sản phẩm
        </Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          size="sm"
          onClick={() => handleOpenModal()}
        >
          Thêm mới
        </Button>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead bg={headerBg}>
            <Tr>
              <Th color="gray.400">ID</Th>
              <Th color="gray.400">Ảnh</Th>
              <Th color="gray.400">Tên sản phẩm</Th>
              <Th color="gray.400" isNumeric>
                Giá bán
              </Th>
              <Th color="gray.400" isNumeric>
                Kho
              </Th>
              <Th color="gray.400">Danh mục</Th>
              <Th color="gray.400">Thao tác</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              // 7 cột tương ứng với header
              <AdminTableSkeleton rowCount={8} columnCount={7} />
            ) : (
              products.map((p) => (
                <Tr key={p.id} _hover={{ bg: "whiteAlpha.50" }}>
                  <Td borderBottomColor={borderColor}>{p.id}</Td>
                  <Td borderBottomColor={borderColor}>
                    <Image
                      src={
                        p.images?.[0]?.imageUrl ||
                        "https://via.placeholder.com/50"
                      }
                      boxSize="40px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  </Td>
                  <Td
                    borderBottomColor={borderColor}
                    maxW="250px"
                    isTruncated
                    fontWeight="medium"
                    color={textColor}
                  >
                    {p.productName}
                  </Td>
                  <Td
                    borderBottomColor={borderColor}
                    isNumeric
                    color="blue.400"
                    fontWeight="bold"
                  >
                    {formatCurrency(p.salePrice)}
                  </Td>
                  <Td borderBottomColor={borderColor} isNumeric>
                    {p.stock}
                  </Td>
                  <Td borderBottomColor={borderColor}>
                    <Text
                      fontSize="sm"
                      bg="whiteAlpha.100"
                      px={2}
                      py={1}
                      borderRadius="md"
                      textAlign="center"
                    >
                      {p.category?.categoryName}
                    </Text>
                  </Td>
                  <Td borderBottomColor={borderColor}>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<EditIcon />}
                        size="sm"
                        variant="ghost"
                        color="blue.400"
                        onClick={() => handleOpenModal(p)}
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        variant="ghost"
                        color="red.400"
                        onClick={() => handleDelete(p.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
        {/* <Table variant="simple">
                    <Thead bg={headerBg}>
                        <Tr>
                            <Th color="gray.400">ID</Th>
                            <Th color="gray.400">Ảnh</Th>
                            <Th color="gray.400">Tên sản phẩm</Th>
                            <Th color="gray.400" isNumeric>Giá bán</Th>
                            <Th color="gray.400" isNumeric>Kho</Th>
                            <Th color="gray.400">Danh mục</Th>
                            <Th color="gray.400">Thao tác</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {products.map((p) => (
                            <Tr key={p.id} _hover={{ bg: "whiteAlpha.50" }}>
                                <Td borderBottomColor={borderColor}>{p.id}</Td>
                                <Td borderBottomColor={borderColor}>
                                    <Image 
                                        src={p.images?.[0]?.imageUrl || 'https://via.placeholder.com/50'} 
                                        boxSize="40px" objectFit="cover" borderRadius="md"
                                    />
                                </Td>
                                <Td borderBottomColor={borderColor} maxW="250px" isTruncated fontWeight="medium" color={textColor}>
                                    {p.productName}
                                </Td>
                                <Td borderBottomColor={borderColor} isNumeric color="blue.400" fontWeight="bold">{formatCurrency(p.salePrice)}</Td>
                                <Td borderBottomColor={borderColor} isNumeric>{p.stock}</Td>
                                <Td borderBottomColor={borderColor}><Text fontSize="sm" bg="whiteAlpha.100" px={2} py={1} borderRadius="md" textAlign="center">{p.category?.categoryName}</Text></Td>
                                <Td borderBottomColor={borderColor}>
                                    <HStack spacing={2}>
                                        <IconButton icon={<EditIcon />} size="sm" variant="ghost" color="blue.400" onClick={() => handleOpenModal(p)} />
                                        <IconButton icon={<DeleteIcon />} size="sm" variant="ghost" color="red.400" onClick={() => handleDelete(p.id)} />
                                    </HStack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table> */}
      </Box>

      {/* Modal - Dark Mode Compatible */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent
          bg={bg}
          color={textColor}
          border="1px solid"
          borderColor={borderColor}
        >
          <ModalHeader borderBottom="1px solid" borderColor={borderColor}>
            {currentProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex direction="column" gap={4}>
              <FormControl isRequired>
                <FormLabel>Tên sản phẩm</FormLabel>
                <Input
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  bg={inputBg}
                  borderColor={borderColor}
                />
              </FormControl>

              <Flex gap={4}>
                <FormControl isRequired>
                  <FormLabel>Danh mục</FormLabel>
                  <Select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    placeholder="Chọn danh mục"
                    bg={inputBg}
                    borderColor={borderColor}
                  >
                    {categories.map((c) => (
                      <option
                        key={c.id}
                        value={c.id}
                        style={{ color: "black" }}
                      >
                        {c.categoryName}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Thương hiệu</FormLabel>
                  <Input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    bg={inputBg}
                    borderColor={borderColor}
                  />
                </FormControl>
              </Flex>

              <Flex gap={4}>
                <FormControl isRequired>
                  <FormLabel>Giá gốc</FormLabel>
                  <Input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    bg={inputBg}
                    borderColor={borderColor}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Giá bán</FormLabel>
                  <Input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleChange}
                    bg={inputBg}
                    borderColor={borderColor}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Kho</FormLabel>
                  <Input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    bg={inputBg}
                    borderColor={borderColor}
                  />
                </FormControl>
              </Flex>

              <FormControl>
                <FormLabel>Mô tả</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  bg={inputBg}
                  borderColor={borderColor}
                  rows={4}
                />
              </FormControl>
            </Flex>
          </ModalBody>
          <ModalFooter borderTop="1px solid" borderColor={borderColor}>
            <Button variant="ghost" mr={3} onClick={onClose} color="gray.400">
              Hủy
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Lưu dữ liệu
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminProductPage;
