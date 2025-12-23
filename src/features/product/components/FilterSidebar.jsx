import React from 'react';
import {
    Box, VStack, Heading, Text, Checkbox, Stack,
    RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb,
    Button, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
    useColorModeValue, Divider, Radio, RadioGroup
} from '@chakra-ui/react';
import { formatCurrency } from '../../../utils/format';

const FilterSidebar = ({ filters, setFilters, onApply, categories = [] }) => {
    // Màu sắc giao diện
    const bg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");

    // Danh sách Brand cứng (Nếu backend có API getBrands thì thay vào đây)
    const BRANDS = ["ASUS", "MSI", "GIGABYTE", "DELL", "HP", "APPLE", "SAMSUNG", "LG", "ACER", "LENOVO"];

    // Xử lý thay đổi khoảng giá (Dùng onChangeEnd để tránh gọi API liên tục khi đang kéo)
    const handlePriceChange = (val) => {
        setFilters(prev => ({ ...prev, minPrice: val[0], maxPrice: val[1] }));
    };

    // Xử lý chọn Thương hiệu (Chỉ chọn 1 hãng tại 1 thời điểm theo Swagger hiện tại)
    const handleBrandChange = (brand) => {
        setFilters(prev => ({ ...prev, brand: prev.brand === brand ? "" : brand }));
    };

    // Xử lý chọn Danh mục
    const handleCategoryChange = (catId) => {
        // Nếu click lại cái đang chọn thì bỏ chọn (toggle)
        setFilters(prev => ({ ...prev, categoryId: prev.categoryId === catId ? "" : catId }));
    };

    return (
        <Box w="full" bg={bg} p={5} borderRadius="lg" border="1px solid" borderColor={borderColor}>
            <Heading size="sm" mb={4} textTransform="uppercase" letterSpacing="wide">Bộ lọc tìm kiếm</Heading>
            <Divider mb={4} />

            <Accordion defaultIndex={[0, 1, 2]} allowMultiple>
                
                {/* 1. DANH MỤC (Dùng Radio style nhưng logic toggle) */}
                <AccordionItem border="none" mb={2}>
                    <AccordionButton px={0} _hover={{ bg: 'none' }}>
                        <Box flex="1" textAlign="left" fontWeight="bold">Danh mục</Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel px={0} pb={4}>
                        <Stack spacing={2} maxH="200px" overflowY="auto">
                            {categories.map(cat => (
                                <Checkbox 
                                    key={cat.id} 
                                    isChecked={parseInt(filters.categoryId) === cat.id}
                                    onChange={() => handleCategoryChange(cat.id)}
                                    colorScheme="blue"
                                >
                                    {cat.categoryName}
                                </Checkbox>
                            ))}
                        </Stack>
                    </AccordionPanel>
                </AccordionItem>

                {/* 2. KHOẢNG GIÁ */}
                <AccordionItem border="none" mb={2}>
                    <AccordionButton px={0} _hover={{ bg: 'none' }}>
                        <Box flex="1" textAlign="left" fontWeight="bold">Khoảng giá</Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel px={0} pb={4}>
                        <VStack spacing={4}>
                            <RangeSlider 
                                aria-label={['min', 'max']} 
                                min={0} max={50000000} step={500000}
                                value={[filters.minPrice || 0, filters.maxPrice || 50000000]}
                                onChangeEnd={handlePriceChange} 
                                colorScheme="blue"
                            >
                                <RangeSliderTrack bg="gray.200">
                                    <RangeSliderFilledTrack bg="blue.500" />
                                </RangeSliderTrack>
                                <RangeSliderThumb index={0} boxSize={4} shadow="md" />
                                <RangeSliderThumb index={1} boxSize={4} shadow="md" />
                            </RangeSlider>
                            <Stack direction="row" w="full" justify="space-between" fontSize="xs" fontWeight="bold">
                                <Text>{formatCurrency(filters.minPrice || 0)}</Text>
                                <Text>{formatCurrency(filters.maxPrice || 50000000)}</Text>
                            </Stack>
                        </VStack>
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
                                >
                                    {brand}
                                </Checkbox>
                            ))}
                        </Stack>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>

            <Button mt={6} w="full" colorScheme="blue" onClick={onApply} shadow="md">
                Áp dụng bộ lọc
            </Button>
            <Button mt={2} w="full" variant="ghost" size="sm" onClick={() => setFilters({ minPrice: 0, maxPrice: 50000000, brand: "", categoryId: "" })}>
                Xóa bộ lọc
            </Button>
        </Box>
    );
};

export default FilterSidebar;