import React, { useState, useEffect } from 'react';
import {
    Menu, MenuButton, MenuList, Button, Text, Icon,
    useColorModeValue, SimpleGrid, Box, Flex, Popover, PopoverTrigger, PopoverContent, PopoverBody
} from '@chakra-ui/react';
import { FaBars, FaChevronRight, FaMicrochip, FaMemory, FaHdd, FaDesktop, FaPlug, FaFan } from 'react-icons/fa';
import { BsGpuCard, BsMotherboard } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import ProductService from '../../services/product.service';

// --- CẤU HÌNH NHÓM DANH MỤC (Định nghĩa các nhóm cha và từ khóa tìm kiếm) ---
const MENU_GROUPS = [
    { 
        name: 'Vi xử lý (CPU)', 
        keywords: ['cpu', 'vi xử lý'], // Tìm danh mục có tên chứa "cpu" hoặc "vi xử lý"
        icon: FaMicrochip 
    },
    { 
        name: 'Bo mạch chủ', 
        keywords: ['mainboard', 'bo mạch'], 
        icon: BsMotherboard 
    },
    { 
        name: 'RAM', 
        keywords: ['ram', 'bộ nhớ'], 
        icon: FaMemory 
    },
    { 
        name: 'VGA - Card màn hình', 
        keywords: ['vga', 'card', 'gpu'], 
        icon: BsGpuCard 
    },
    { 
        name: 'Ổ cứng (SSD/HDD)', 
        keywords: ['ssd', 'hdd', 'ổ cứng'], 
        icon: FaHdd 
    },
    { 
        name: 'Nguồn (PSU)', 
        keywords: ['nguồn', 'psu'], 
        icon: FaPlug 
    },
    { 
        name: 'Vỏ máy tính', 
        keywords: ['case', 'vỏ'], 
        icon: FaDesktop 
    },
    { 
        name: 'Tản nhiệt', 
        keywords: ['tản', 'fan', 'cooler'], 
        icon: FaFan 
    }
];

const CategoryMenu = () => {
    // --- STATE ---
    const [groupedData, setGroupedData] = useState([]);
    
    // --- STYLES ---
    const menuBg = useColorModeValue('white', 'gray.800');
    const hoverBg = useColorModeValue('gray.100', 'whiteAlpha.200');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    // 1. Load danh mục và gom nhóm khi Component được tạo
    useEffect(() => {
        const fetchAndGroupCategories = async () => {
            try {
                // Gọi API lấy toàn bộ danh mục từ Backend
                const res = await ProductService.getCategories();
                
                if (res.success && res.data) {
                    const allCategories = res.data;

                    // Duyệt qua cấu hình MENU_GROUPS để nhặt danh mục con tương ứng
                    const processedGroups = MENU_GROUPS.map(group => {
                        // Lọc các category có tên chứa từ khóa của nhóm (không phân biệt hoa thường)
                        const matchedChildren = allCategories.filter(cat => 
                            group.keywords.some(k => cat.categoryName.toLowerCase().includes(k.toLowerCase()))
                        );
                        
                        return {
                            ...group,
                            children: matchedChildren
                        };
                    });

                    setGroupedData(processedGroups);
                }
            } catch (error) {
                console.error("Lỗi tải danh mục:", error);
            }
        };

        fetchAndGroupCategories();
    }, []);

    return (
        <Menu autoSelect={false} isLazy>
            <MenuButton 
                as={Button} 
                leftIcon={<FaBars />} 
                variant="solid" 
                colorScheme="blue" 
                size="md"
            >
                Danh mục sản phẩm
            </MenuButton>
            <MenuList 
                bg={menuBg} 
                borderColor={borderColor} 
                boxShadow="xl" 
                p={2}
                minW="280px"
                zIndex={999}
            >
                {groupedData.map((group, index) => (
                    <Popover key={index} placement="right-start" trigger="hover" openDelay={0} closeDelay={100}>
                        <PopoverTrigger>
                            <Box 
                                role="group"
                                display="block" 
                                p={3} 
                                borderRadius="md" 
                                cursor="pointer"
                                _hover={{ bg: hoverBg, color: 'blue.500' }}
                                transition="all 0.2s"
                            >
                                <Flex align="center" justify="space-between">
                                    <Flex align="center" gap={3}>
                                        <Icon as={group.icon} boxSize={5} color="gray.500" _groupHover={{ color: 'blue.500' }} />
                                        <Text fontWeight="medium">{group.name}</Text>
                                    </Flex>
                                    <Icon as={FaChevronRight} fontSize="xs" color="gray.400" />
                                </Flex>
                            </Box>
                        </PopoverTrigger>
                        
                        {/* Menu con xổ ra bên phải */}
                        <PopoverContent 
                            bg={menuBg} 
                            borderColor={borderColor} 
                            boxShadow="xl" 
                            width="300px"
                        >
                            <PopoverBody p={4}>
                                <Text fontWeight="bold" mb={3} color="blue.500" borderBottom="1px solid" borderColor={borderColor} pb={2}>
                                    {group.name}
                                </Text>
                                
                                {group.children.length > 0 ? (
                                    <SimpleGrid columns={1} spacing={2}>
                                        {group.children.map((sub) => (
                                            <Link key={sub.id} to={`/products?categoryId=${sub.id}`}>
                                                <Box 
                                                    p={2} 
                                                    borderRadius="md" 
                                                    _hover={{ bg: hoverBg, transform: 'translateX(5px)' }}
                                                    transition="all 0.2s"
                                                >
                                                    <Text fontSize="sm">{sub.categoryName}</Text>
                                                </Box>
                                            </Link>
                                        ))}
                                        {/* Link xem tất cả của nhóm này */}
                                        <Link to={`/products?productName=${group.keywords[0]}`}>
                                            <Text fontSize="sm" color="blue.500" mt={2} fontStyle="italic" _hover={{ textDecoration: 'underline' }}>
                                                Xem tất cả {group.name} &rarr;
                                            </Text>
                                        </Link>
                                    </SimpleGrid>
                                ) : (
                                    <Text fontSize="sm" color="gray.500" fontStyle="italic">
                                        Đang cập nhật sản phẩm...
                                    </Text>
                                )}
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                ))}
            </MenuList>
        </Menu>
    );
};

export default CategoryMenu;