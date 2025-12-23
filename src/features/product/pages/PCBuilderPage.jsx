import React, { useState, useEffect } from 'react';
import {
    Box, Container, Grid, VStack, HStack, Heading, Text, Button, Image, 
    IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, 
    ModalHeader, ModalBody, ModalCloseButton, useToast, Flex, Badge, 
    Input, InputGroup, InputRightElement, Spinner, useColorModeValue, Divider,
    Alert, AlertIcon, AlertTitle, AlertDescription, ModalFooter
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import { FaShoppingCart, FaSave, FaTrash } from 'react-icons/fa';

import ProductService from '../../../services/product.service';
import { useCart } from '../../../context/CartContext';
import { formatCurrency } from '../../../utils/format';
import { BUILD_SLOTS } from '../../../constants/pc-builder.config';

const PCBuilderPage = () => {
    // --- STATE ---
    const [build, setBuild] = useState({}); 
    const [totalPrice, setTotalPrice] = useState(0);
    const [warnings, setWarnings] = useState([]);
    
    // Modal Selector (Chọn linh kiện)
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    // --- MỚI: Modal Reset (Xác nhận làm mới) ---
    const { 
        isOpen: isResetOpen, 
        onOpen: onResetOpen, 
        onClose: onResetClose 
    } = useDisclosure();

    const [activeSlot, setActiveSlot] = useState(null); 
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const toast = useToast();
    const { addToCart } = useCart(); 

    // Theme Colors
    const bg = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
    const textColor = useColorModeValue("gray.800", "white");

    // --- EFFECT ---
    useEffect(() => {
        const total = Object.values(build).reduce((sum, item) => sum + (item?.salePrice || 0), 0);
        setTotalPrice(total);

        const newWarnings = [];
        const cpu = build['cpu'];
        const main = build['mainboard'];

        if (cpu && main) {
            const getSpecValue = (prod, key) => prod.specifications?.find(s => s.keyName.toLowerCase().includes(key.toLowerCase()))?.value;
            const cpuSocket = getSpecValue(cpu, 'Socket');
            const mainSocket = getSpecValue(main, 'Socket');

            if (cpuSocket && mainSocket) {
                const normalize = (str) => str.replace(/\s/g, '').toLowerCase();
                if (!normalize(mainSocket).includes(normalize(cpuSocket))) {
                    newWarnings.push(`Cảnh báo: CPU Socket (${cpuSocket}) có thể không khớp với Mainboard (${mainSocket})`);
                }
            }
        }
        setWarnings(newWarnings);
    }, [build]);

    // --- HANDLERS ---

    const handleOpenSelect = (slot) => {
        setActiveSlot(slot);
        setSearchTerm("");
        setProducts([]);
        fetchProductsForSlot(slot.categoryId);
        onOpen();
    };

    const fetchProductsForSlot = async (categoryId, search = "") => {
        setLoadingProducts(true);
        try {
            const res = await ProductService.getAll({ 
                page: 0, size: 20, categoryId: categoryId, productName: search 
            });
            if (res.success) setProducts(res.data.content || []);
        } catch (error) {
            toast({ title: "Lỗi tải dữ liệu", status: "error" });
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleSelectProduct = (product) => {
        setBuild(prev => ({ ...prev, [activeSlot.key]: product }));
        onClose();
        toast({ title: `Đã thêm ${product.productName}`, status: "success", duration: 1000 });
    };

    const handleRemoveItem = (key) => {
        const newBuild = { ...build };
        delete newBuild[key];
        setBuild(newBuild);
    };

    // --- MỚI: Xử lý nút Reset ---
    const handleResetClick = () => {
        if (Object.keys(build).length === 0) {
            toast({ title: "Cấu hình đang trống", status: "info" });
            return;
        }
        onResetOpen(); // Mở Modal thay vì window.confirm
    };

    const confirmReset = () => {
        setBuild({});
        onResetClose();
        toast({ title: "Đã làm mới cấu hình", status: "success" });
    };

    const handleAddAllToCart = async () => {
        const items = Object.values(build);
        if (items.length === 0) {
            toast({ title: "Cấu hình trống", status: "warning" });
            return;
        }
        try {
            let successCount = 0;
            for (const item of items) {
                const res = await addToCart(item, 1);
                if(res) successCount++;
            }
            if(successCount > 0) toast({ title: `Đã thêm ${successCount} linh kiện vào giỏ hàng!`, status: "success" });
        } catch (error) {
            toast({ title: "Lỗi thêm vào giỏ", status: "error" });
        }
    };

    return (
        <Box bg={bg} minH="100vh" py={10}>
            <Container maxW="container.xl">
                <VStack spacing={2} align="start" mb={8}>
                    <Heading color={textColor}>Xây Dựng Cấu Hình PC</Heading>
                    <Text color="gray.500">Tự chọn linh kiện, hệ thống sẽ giúp bạn kiểm tra tương thích.</Text>
                </VStack>

                <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={8}>
                    {/* LEFT: LIST CÁC SLOT */}
                    <VStack spacing={4} align="stretch">
                        {warnings.length > 0 && (
                            <Alert status="warning" borderRadius="md">
                                <AlertIcon />
                                <Box>
                                    <AlertTitle>Lưu ý tương thích!</AlertTitle>
                                    <AlertDescription fontSize="sm">
                                        {warnings.map((w, i) => <Text key={i}>{w}</Text>)}
                                    </AlertDescription>
                                </Box>
                            </Alert>
                        )}

                        {BUILD_SLOTS.map((slot) => {
                            const selected = build[slot.key];
                            return (
                                <Box key={slot.key} bg={cardBg} p={4} borderRadius="xl" border="1px solid" borderColor={borderColor} shadow="sm">
                                    <Flex align="center" justify="space-between" direction={{ base: "column", md: "row" }} gap={4}>
                                        <Flex align="center" minW="220px" gap={3}>
                                            <Flex justify="center" align="center" w={12} h={12} bg={useColorModeValue("blue.50", "whiteAlpha.100")} borderRadius="lg" color="blue.500">
                                                <slot.icon size={24} />
                                            </Flex>
                                            <Box>
                                                <Text fontWeight="bold" color={textColor}>{slot.name}</Text>
                                                {slot.required && <Badge colorScheme="red" fontSize="0.6em">Bắt buộc</Badge>}
                                            </Box>
                                        </Flex>

                                        <Box flex="1" w="full">
                                            {selected ? (
                                                <Flex align="center" gap={4} bg={useColorModeValue("gray.50", "whiteAlpha.50")} p={2} borderRadius="lg">
                                                    <Image src={selected.mainImage} boxSize="50px" objectFit="contain" bg="white" borderRadius="md" />
                                                    <Box flex="1">
                                                        <Text fontWeight="bold" noOfLines={1} color={textColor}>{selected.productName}</Text>
                                                        <Text color="blue.500" fontWeight="bold">{formatCurrency(selected.salePrice)}</Text>
                                                    </Box>
                                                    <HStack>
                                                        <IconButton icon={<SearchIcon />} size="sm" onClick={() => handleOpenSelect(slot)} aria-label="Change" />
                                                        <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => handleRemoveItem(slot.key)} aria-label="Remove" />
                                                    </HStack>
                                                </Flex>
                                            ) : (
                                                <Button 
                                                    leftIcon={<AddIcon />} w="full" variant="outline" borderStyle="dashed" h="60px"
                                                    onClick={() => handleOpenSelect(slot)} color="gray.500"
                                                >
                                                    Chọn {slot.name}
                                                </Button>
                                            )}
                                        </Box>
                                    </Flex>
                                </Box>
                            );
                        })}
                    </VStack>

                    {/* RIGHT: SUMMARY STICKY */}
                    <Box>
                        <Box bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderColor} position="sticky" top="20px" shadow="lg">
                            <Heading size="md" mb={6} color={textColor}>Tổng quan cấu hình</Heading>
                            <VStack align="stretch" spacing={4}>
                                <Flex justify="space-between">
                                    <Text color="gray.500">Số lượng:</Text>
                                    <Text fontWeight="bold" color={textColor}>{Object.keys(build).length} linh kiện</Text>
                                </Flex>
                                <Divider borderColor={borderColor} />
                                <Flex justify="space-between" align="center">
                                    <Text fontSize="lg" fontWeight="bold" color={textColor}>Tạm tính:</Text>
                                    <Text fontSize="2xl" fontWeight="bold" color="blue.500">{formatCurrency(totalPrice)}</Text>
                                </Flex>
                                
                                <Button 
                                    colorScheme="blue" size="lg" w="full" 
                                    leftIcon={<FaShoppingCart />}
                                    onClick={handleAddAllToCart}
                                    isDisabled={Object.keys(build).length === 0}
                                >
                                    Thêm vào giỏ hàng
                                </Button>
                                <Button leftIcon={<FaSave />} variant="outline">Lưu cấu hình (Sắp có)</Button>
                                
                                {/* Nút Làm mới gọi Modal */}
                                <Button leftIcon={<FaTrash />} colorScheme="red" variant="ghost" onClick={handleResetClick}>
                                    Làm mới
                                </Button>
                            </VStack>
                        </Box>
                    </Box>
                </Grid>

                {/* MODAL 1: SELECT PRODUCT */}
                <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
                    <ModalOverlay backdropFilter="blur(5px)" />
                    <ModalContent bg={cardBg} color={textColor} border="1px solid" borderColor={borderColor}>
                        <ModalHeader>Chọn {activeSlot?.name}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <InputGroup mb={4}>
                                <Input 
                                    placeholder="Tìm tên linh kiện..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && fetchProductsForSlot(activeSlot.categoryId, searchTerm)}
                                    bg={useColorModeValue("gray.100", "whiteAlpha.100")} border="none"
                                />
                                <InputRightElement>
                                    <IconButton icon={<SearchIcon />} size="sm" onClick={() => fetchProductsForSlot(activeSlot.categoryId, searchTerm)} variant="ghost" />
                                </InputRightElement>
                            </InputGroup>

                            {loadingProducts ? (
                                <Flex justify="center" py={10}><Spinner color="blue.500" /></Flex>
                            ) : (
                                <VStack align="stretch" spacing={3}>
                                    {products.map(product => (
                                        <Flex 
                                            key={product.id} p={3} borderRadius="lg" align="center" gap={4} 
                                            border="1px solid" borderColor={borderColor}
                                            cursor="pointer" _hover={{ borderColor: "blue.500", bg: useColorModeValue("blue.50", "whiteAlpha.100") }} 
                                            onClick={() => handleSelectProduct(product)}
                                        >
                                            <Image src={product.mainImage} boxSize="60px" objectFit="contain" bg="white" borderRadius="md" />
                                            <Box flex="1">
                                                <Text fontWeight="bold" noOfLines={1}>{product.productName}</Text>
                                                <HStack fontSize="sm" color="gray.500" mt={1}>
                                                    <Text fontWeight="bold" color="blue.500">{formatCurrency(product.salePrice)}</Text>
                                                    <Text>• Kho: {product.stock}</Text>
                                                </HStack>
                                                {activeSlot?.checkKey && (
                                                    <Badge mt={1} colorScheme="green" fontSize="0.7em">
                                                        {activeSlot.checkKey}: {product.specifications?.find(s => s.keyName.includes(activeSlot.checkKey))?.value || "N/A"}
                                                    </Badge>
                                                )}
                                            </Box>
                                            <Button size="sm" colorScheme="blue" leftIcon={<AddIcon />}>Thêm</Button>
                                        </Flex>
                                    ))}
                                    {products.length === 0 && <Text textAlign="center" color="gray.500" py={10}>Không tìm thấy sản phẩm nào.</Text>}
                                </VStack>
                            )}
                        </ModalBody>
                    </ModalContent>
                </Modal>

                {/* MODAL 2: CONFIRM RESET (MỚI) */}
                <Modal isOpen={isResetOpen} onClose={onResetClose} isCentered>
                    <ModalOverlay backdropFilter="blur(5px)" />
                    <ModalContent bg={cardBg} color={textColor} border="1px solid" borderColor={borderColor}>
                        <ModalHeader>Xác nhận làm mới</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            Bạn có chắc chắn muốn xóa toàn bộ linh kiện đã chọn? <br/>
                            Hành động này sẽ đưa cấu hình về trạng thái trống.
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="ghost" mr={3} onClick={onResetClose}>Hủy</Button>
                            <Button colorScheme="red" onClick={confirmReset}>Xóa hết</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

            </Container>
        </Box>
    );
};

export default PCBuilderPage;