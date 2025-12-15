import React from 'react';
import { Box, Flex, Icon, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaList, FaShoppingCart, FaUsers, FaChartPie, FaMicrochip } from 'react-icons/fa';

const NavItem = ({ icon, children, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} style={{ textDecoration: 'none', width: '100%' }}>
      <Flex
        align="center" p="3" mx="4" my="1" borderRadius="xl" role="group" cursor="pointer"
        bg={isActive ? "linear-gradient(to r, blue.600, blue.400)" : 'transparent'}
        bgGradient={isActive ? "linear(to-r, blue.600, purple.600)" : "none"}
        color={isActive ? 'white' : 'gray.400'}
        fontWeight={isActive ? 'bold' : 'medium'}
        transition="all 0.2s"
        _hover={{
          bg: isActive ? "linear(to-r, blue.600, purple.600)" : 'whiteAlpha.100',
          color: 'white',
          transform: "translateX(5px)"
        }}
      >
        {icon && <Icon mr="4" fontSize="18" as={icon} color={isActive ? "white" : "blue.500"} />}
        {children}
      </Flex>
    </Link>
  );
};

const Sidebar = (props) => {
  const bg = useColorModeValue('white', '#0a0a0a'); // Darker sidebar
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  return (
    <Box
      bg={bg} borderRight="1px" borderRightColor={borderColor}
      w={{ base: 'full', md: 64 }} pos="relative" h="full" py={6}
      {...props}
    >
      <Flex h="10" alignItems="center" mx="8" mb={10} gap={3}>
        <Icon as={FaMicrochip} w={8} h={8} color="blue.500" />
        <Text fontSize="2xl" fontWeight="900" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
          VNTech
        </Text>
      </Flex>
      <VStack spacing={2} align="stretch">
        <NavItem icon={FaChartPie} to="/admin">Dashboard</NavItem>
        <Text px={8} pt={4} pb={2} fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">Quản lý</Text>
        <NavItem icon={FaBox} to="/admin/products">Sản phẩm</NavItem>
        <NavItem icon={FaList} to="/admin/categories">Danh mục</NavItem>
        <NavItem icon={FaShoppingCart} to="/admin/orders">Đơn hàng</NavItem>
        <NavItem icon={FaUsers} to="/admin/users">Người dùng</NavItem>
        
        <Box my={4} mx={8} borderTop="1px" borderColor={borderColor} />
        <NavItem icon={FaHome} to="/">Về trang chủ</NavItem>
      </VStack>
    </Box>
  );
};

export default Sidebar;