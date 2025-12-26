import React, { useState, useEffect } from 'react';
import {
    Box, Container, Grid, VStack, HStack, Heading, Text, Button, Image, 
    IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, 
    ModalHeader, ModalBody, ModalCloseButton, useToast, Flex, Badge, 
    Spinner, useColorModeValue, Divider, Alert, AlertIcon, ModalFooter, SimpleGrid
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';

import ProductService from '../../../services/product.service';
import { useCart } from '../../../context/CartContext';
import { formatCurrency } from '../../../utils/format';
import { BUILD_SLOTS } from '../../../constants/pc-builder.config';

const PCBuilderPage = () => {
    // --- STATE ---
    const [build, setBuild] = useState({}); 
    const [totalPrice, setTotalPrice] = useState(0);
    
    // State cho Modal chọn linh kiện
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [currentSlotKey, setCurrentSlotKey] = useState(null); // Lưu key của slot đang chọn (vd: 'cpu')
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    
    // Logic mới: Quản lý danh mục con trong Modal
    const [allCategories, setAllCategories] = useState([]); // Lưu toàn bộ danh mục từ DB
    const [relevantCategories, setRelevantCategories] = useState([]); // Các danh mục khớp từ khóa
    const [selectedCategoryId, setSelectedCategoryId] = useState(null); // ID danh mục đang được chọn trong Modal

    // State cho Cart & Toast
    const { addToCart } = useCart();
    const toast = useToast();
    
    // Colors
    const bg = useColorModeValue("gray.50", "vntech.darkBg");
    const cardBg = useColorModeValue("white", "vntech.cardBg");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
    const textColor = useColorModeValue("gray.800", "white");

    // 1. Load toàn bộ danh mục khi vào trang (để dùng lọc theo tên)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await ProductService.getCategories();
                if (res.success) setAllCategories(res.data);
            } catch (error) {
                console.error("Lỗi lấy danh mục:", error);
            }
        };
        fetchCategories();
    }, []);

    // 2. Tính tổng tiền khi build thay đổi
    useEffect(() => {
        const total = Object.values(build).reduce((sum, item) => sum + (item?.salePrice || 0), 0);
        setTotalPrice(total);
    }, [build]);

    // 3. Hàm mở Modal chọn linh kiện (LOGIC MỚI QUAN TRỌNG)
    const handleOpenModal = (slotKey) => {
        setCurrentSlotKey(slotKey);
        const slotConfig = BUILD_SLOTS.find(s => s.key === slotKey);
        
        if (slotConfig && allCategories.length > 0) {
            // Lọc ra các danh mục có tên chứa từ khóa (Ví dụ: "Mainboard" -> lấy Mainboard Intel, Mainboard AMD)
            // Sử dụng toLowerCase() để so sánh không phân biệt hoa thường
            const matched = allCategories.filter(c => 
                c.categoryName.toLowerCase().includes(slotConfig.categoryKeyword.toLowerCase())
            );
            setRelevantCategories(matched);

            // Mặc định chọn cái đầu tiên tìm được
            if (matched.length > 0) {
                setSelectedCategoryId(matched[0].id);
            } else {
                setSelectedCategoryId(null);
                setProducts([]); // Không tìm thấy danh mục nào khớp
            }
        }
        onOpen();
    };

    // 4. Fetch sản phẩm khi selectedCategoryId thay đổi (người dùng bấm chuyển Tab trong Modal)
    useEffect(() => {
        if (isOpen && selectedCategoryId) {
            const fetchProducts = async () => {
                setLoadingProducts(true);
                try {
                    // Gọi API lấy sản phẩm theo Category ID cụ thể
                    const res = await ProductService.getAll({ 
                        page: 0, 
                        size: 20, 
                        categoryId: selectedCategoryId 
                    });
                    if (res.success) {
                        setProducts(res.data.content);
                    }
                } catch (error) {
                    console.error(error);
                    setProducts([]);
                } finally {
                    setLoadingProducts(false);
                }
            };
            fetchProducts();
        }
    }, [selectedCategoryId, isOpen]);

    // 5. Chọn linh kiện đưa vào cấu hình
    const handleSelectProduct = (product) => {
        setBuild(prev => ({ ...prev, [currentSlotKey]: product }));
        onClose();
    };

    // 6. Xóa linh kiện khỏi cấu hình
    const handleRemoveItem = (key) => {
        setBuild(prev => {
            const newBuild = { ...prev };
            delete newBuild[key];
            return newBuild;
        });
    };

    // 7. Thêm toàn bộ vào giỏ hàng
    const handleAddAllToCart = async () => {
        const items = Object.values(build);
        if (items.length === 0) return;

        try {
            // Duyệt qua từng món và thêm vào giỏ (Vì API BE chưa hỗ trợ add bulk)
            // Sử dụng Promise.all để chạy song song cho nhanh
            await Promise.all(items.map(item => addToCart(item, 1)));
            
            toast({ title: "Đã thêm bộ PC vào giỏ hàng!", status: "success" });
        } catch (error) {
            toast({ title: "Có lỗi xảy ra", status: "error" });
        }
    };

    return (
        <Box bg={bg} minH="100vh" py={8}>
            <Container maxW="container.xl">
                <Heading mb={6} textAlign="center" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
                    Xây Dựng Cấu Hình PC
                </Heading>

                <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={8}>
                    {/* Cột Trái: Danh sách Slot */}
                    <VStack spacing={4} align="stretch">
                        {BUILD_SLOTS.map((slot) => {
                            const selectedItem = build[slot.key];
                            return (
                                <Box key={slot.key} bg={cardBg} p={4} borderRadius="xl" border="1px solid" borderColor={borderColor} shadow="sm">
                                    <Flex align="center" gap={4}>
                                        <Flex 
                                            w="60px" h="60px" bg={useColorModeValue("gray.100", "whiteAlpha.100")} 
                                            align="center" justify="center" borderRadius="lg"
                                        >
                                            {selectedItem ? (
                                                <Image src={selectedItem.mainImage} w="100%" h="100%" objectFit="contain" p={1} />
                                            ) : (
                                                <Box as={slot.icon} size="24px" color="gray.400" />
                                            )}
                                        </Flex>

                                        <Box flex="1">
                                            <Flex align="center" gap={2}>
                                                <Text fontWeight="bold">{slot.name}</Text>
                                                {slot.required && <Badge colorScheme="red" fontSize="0.6em">Bắt buộc</Badge>}
                                            </Flex>
                                            {selectedItem ? (
                                                <Text fontSize="sm" fontWeight="medium" color="blue.500" noOfLines={1}>
                                                    {selectedItem.productName}
                                                </Text>
                                            ) : (
                                                <Text fontSize="sm" color="gray.500">Chưa chọn linh kiện</Text>
                                            )}
                                        </Box>

                                        <Box textAlign="right">
                                            {selectedItem && (
                                                <Text fontWeight="bold" mb={1}>{formatCurrency(selectedItem.salePrice)}</Text>
                                            )}
                                            {selectedItem ? (
                                                <HStack justify="flex-end">
                                                    <IconButton 
                                                        icon={<DeleteIcon />} size="sm" colorScheme="red" variant="ghost" 
                                                        onClick={() => handleRemoveItem(slot.key)}
                                                    />
                                                    <Button size="sm" leftIcon={<SearchIcon />} onClick={() => handleOpenModal(slot.key)}>Đổi</Button>
                                                </HStack>
                                            ) : (
                                                <Button 
                                                    leftIcon={<AddIcon />} colorScheme="blue" size="sm" 
                                                    onClick={() => handleOpenModal(slot.key)}
                                                >
                                                    Thêm
                                                </Button>
                                            )}
                                        </Box>
                                    </Flex>
                                </Box>
                            );
                        })}
                    </VStack>

                    {/* Cột Phải: Tổng tiền & Action */}
                    <Box>
                        <Box position="sticky" top="100px" bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderColor} shadow="lg">
                            <Heading size="md" mb={4}>Tổng quan cấu hình</Heading>
                            
                            <HStack justify="space-between" mb={4}>
                                <Text color="gray.500">Số linh kiện:</Text>
                                <Text fontWeight="bold">{Object.keys(build).length} / {BUILD_SLOTS.length}</Text>
                            </HStack>
                            
                            <Divider mb={4} />
                            
                            <HStack justify="space-between" mb={6}>
                                <Text fontSize="lg" fontWeight="bold">Tổng tiền:</Text>
                                <Text fontSize="2xl" fontWeight="bold" color="blue.500">{formatCurrency(totalPrice)}</Text>
                            </HStack>

                            <VStack spacing={3}>
                                <Button 
                                    w="full" colorScheme="blue" size="lg" 
                                    leftIcon={<FaShoppingCart />} 
                                    onClick={handleAddAllToCart}
                                    isDisabled={Object.keys(build).length === 0}
                                >
                                    Thêm vào giỏ hàng
                                </Button>
                                <Button 
                                    w="full" variant="outline" colorScheme="red" 
                                    leftIcon={<FaTrash />}
                                    onClick={() => setBuild({})}
                                    isDisabled={Object.keys(build).length === 0}
                                >
                                    Làm mới
                                </Button>
                            </VStack>
                        </Box>
                    </Box>
                </Grid>

                {/* MODAL CHỌN LINH KIỆN */}
                <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
                    <ModalOverlay backdropFilter="blur(5px)" />
                    <ModalContent bg={cardBg} minH="600px">
                        <ModalHeader borderBottom="1px solid" borderColor={borderColor}>
                            Chọn {BUILD_SLOTS.find(s => s.key === currentSlotKey)?.name}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody p={6}>
                            
                            {/* PHẦN QUAN TRỌNG: CÁC TAB CHỌN DANH MỤC CON */}
                            {relevantCategories.length > 0 ? (
                                <Box mb={6} overflowX="auto" whiteSpace="nowrap" pb={2}>
                                    <HStack spacing={3}>
                                        {relevantCategories.map(cat => (
                                            <Button
                                                key={cat.id}
                                                size="sm"
                                                variant={selectedCategoryId === cat.id ? "solid" : "outline"}
                                                colorScheme="blue"
                                                onClick={() => setSelectedCategoryId(cat.id)}
                                                borderRadius="full"
                                                px={4}
                                            >
                                                {cat.categoryName}
                                            </Button>
                                        ))}
                                    </HStack>
                                </Box>
                            ) : (
                                <Alert status="warning" mb={4} borderRadius="md">
                                    <AlertIcon />
                                    Không tìm thấy danh mục nào phù hợp trong hệ thống (Từ khóa: {BUILD_SLOTS.find(s => s.key === currentSlotKey)?.categoryKeyword}).
                                </Alert>
                            )}

                            {/* DANH SÁCH SẢN PHẨM */}
                            {loadingProducts ? (
                                <Flex justify="center" py={10}><Spinner size="xl" /></Flex>
                            ) : (
                                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                                    {products.map(product => (
                                        <Box 
                                            key={product.id} 
                                            border="1px solid" borderColor={borderColor} p={4} borderRadius="lg"
                                            cursor="pointer"
                                            _hover={{ borderColor: "blue.500", transform: "translateY(-2px)", shadow: "md" }}
                                            transition="all 0.2s"
                                            onClick={() => handleSelectProduct(product)}
                                        >
                                            <Image 
                                                src={product.images?.[0]?.imageUrl || "https://via.placeholder.com/150"} 
                                                h="120px" w="full" objectFit="contain" mb={3}
                                            />
                                            <Text fontWeight="bold" noOfLines={2} fontSize="sm" mb={2} h="40px" color={textColor}>
                                                {product.productName}
                                            </Text>
                                            <HStack justify="space-between">
                                                <Text fontWeight="bold" color="blue.500">
                                                    {formatCurrency(product.salePrice)}
                                                </Text>
                                                <Button size="xs" colorScheme="blue">Chọn</Button>
                                            </HStack>
                                        </Box>
                                    ))}
                                </SimpleGrid>
                            )}
                            
                            {!loadingProducts && products.length === 0 && relevantCategories.length > 0 && (
                                <Flex direction="column" align="center" justify="center" py={10}>
                                    <Text color="gray.500">Không có sản phẩm nào trong danh mục này.</Text>
                                </Flex>
                            )}

                        </ModalBody>
                    </ModalContent>
                </Modal>

            </Container>
        </Box>
    );
};

export default PCBuilderPage;