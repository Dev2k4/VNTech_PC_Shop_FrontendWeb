import React from 'react';
import {
    Box, VStack, Heading, Text, Checkbox, Stack,
    Button, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
    useColorModeValue, Input, HStack, FormControl, FormLabel
} from '@chakra-ui/react';
import { formatCurrency } from '../../../utils/format';

const FilterSidebar = ({ filters, setFilters, onApply, categories = [] }) => {
    // Màu sắc giao diện
    const bg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");

    // Danh sách Brand cứng (để demo)
    const BRANDS = ["ASUS", "MSI", "GIGABYTE", "DELL", "HP", "APPLE", "SAMSUNG", "LG", "ACER", "LENOVO"];

    // Xử lý nhập giá tiền
    const handleMinPriceChange = (e) => {
        setFilters(prev => ({ ...prev, minPrice: e.target.value }));
    };

    const handleMaxPriceChange = (e) => {
        setFilters(prev => ({ ...prev, maxPrice: e.target.value }));
    };

    // Xử lý chọn Thương hiệu
    const handleBrandChange = (brand) => {
        setFilters(prev => ({ ...prev, brand: prev.brand === brand ? "" : brand }));
    };

    // Xử lý chọn Danh mục
    const handleCategoryChange = (catId) => {
        setFilters(prev => ({ 
            ...prev, 
            // Nếu đang chọn cái này rồi thì bỏ chọn (toggle), ngược lại thì chọn cái mới
            categoryId: prev.categoryId == catId ? "" : catId 
        }));
    };

    return (
        <Box 
            bg={bg} p={5} borderRadius="lg" 
            border="1px solid" borderColor={borderColor} 
            shadow="sm" h="fit-content"
        >
            <Heading size="md" mb={4} color="blue.500">Bộ lọc</Heading>
            
            <Accordion defaultIndex={[0, 1, 2]} allowMultiple>
                
                {/* 1. KHOẢNG GIÁ (Dùng Input thay Slider) */}
                <AccordionItem border="none" mb={4}>
                    <AccordionButton px={0} _hover={{ bg: 'none' }}>
                        <Box flex="1" textAlign="left" fontWeight="bold">Khoảng giá</Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel px={0}>
                        <VStack spacing={3}>
                            <HStack>
                                <FormControl>
                                    <FormLabel fontSize="xs" color="gray.500" mb={1}>Từ</FormLabel>
                                    <Input 
                                        type="number" 
                                        size="sm" 
                                        value={filters.minPrice} 
                                        onChange={handleMinPriceChange}
                                        placeholder="0"
                                    />
                                </FormControl>
                                <Text mt={6}>-</Text>
                                <FormControl>
                                    <FormLabel fontSize="xs" color="gray.500" mb={1}>Đến</FormLabel>
                                    <Input 
                                        type="number" 
                                        size="sm" 
                                        value={filters.maxPrice} 
                                        onChange={handleMaxPriceChange}
                                        placeholder="Max"
                                    />
                                </FormControl>
                            </HStack>
                            <Text fontSize="xs" color="gray.500">
                                {formatCurrency(filters.minPrice || 0)} - {formatCurrency(filters.maxPrice || 0)}
                            </Text>
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>

                {/* 2. DANH MỤC */}
                <AccordionItem border="none" mb={4}>
                    <AccordionButton px={0} _hover={{ bg: 'none' }}>
                        <Box flex="1" textAlign="left" fontWeight="bold">Danh mục</Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel px={0}>
                        <Stack spacing={2} maxH="300px" overflowY="auto" css={{ '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { background: '#CBD5E0', borderRadius: '24px' } }}>
                            {categories.map(cat => (
                                <Checkbox 
                                    key={cat.id} 
                                    // Dùng == để so sánh lỏng (string "52" == number 52) -> FIX LỖI TÍCH
                                    isChecked={filters.categoryId == cat.id} 
                                    onChange={() => handleCategoryChange(cat.id)}
                                    colorScheme="blue"
                                    size="sm"
                                >
                                    {cat.categoryName}
                                </Checkbox>
                            ))}
                        </Stack>
                    </AccordionPanel>
                </AccordionItem>

                {/* 3. THƯƠNG HIỆU */}
                <AccordionItem border="none">
                    <AccordionButton px={0} _hover={{ bg: 'none' }}>
                        <Box flex="1" textAlign="left" fontWeight="bold">Thương hiệu</Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel px={0}>
                        <Stack spacing={2} maxH="200px" overflowY="auto">
                            {BRANDS.map(brand => (
                                <Checkbox 
                                    key={brand} 
                                    isChecked={filters.brand === brand}
                                    onChange={() => handleBrandChange(brand)}
                                    colorScheme="blue"
                                    size="sm"
                                >
                                    {brand}
                                </Checkbox>
                            ))}
                        </Stack>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>

            <Button mt={6} w="full" colorScheme="blue" onClick={onApply} shadow="md">
                Áp dụng
            </Button>
            <Button 
                mt={2} w="full" variant="ghost" size="sm" 
                onClick={() => setFilters({ minPrice: 0, maxPrice: 50000000, brand: "", categoryId: "", productName: "" })}
            >
                Xóa bộ lọc
            </Button>
        </Box>
    );
};

export default FilterSidebar;