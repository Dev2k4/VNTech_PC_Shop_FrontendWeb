import React from 'react';
import { Box, Flex, Icon, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaList, FaShoppingCart, FaUsers, FaChartBar } from 'react-icons/fa';

const NavItem = ({ icon, children, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));
  
  const activeBg = useColorModeValue('blue.500', 'blue.200');
  const activeColor = 'white';
  const inactiveColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Link to={to} style={{ textDecoration: 'none', width: '100%' }}>
      <Flex
        align="center"
        p="3"
        mx="4"
        my="1"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? activeBg : 'transparent'}
        color={isActive ? activeColor : inactiveColor}
        fontWeight={isActive ? 'bold' : 'normal'}
        _hover={{
          bg: isActive ? activeBg : hoverBg,
        }}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const Sidebar = (props) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bg}
      borderRight="1px"
      borderRightColor={borderColor}
      w={{ base: 'full', md: 60 }}
      pos="relative"
      h="full"
      py={5}
      {...props}
    >
      <Flex h="10" alignItems="center" mx="8" mb={8} justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="blue.500">
          VNTech
        </Text>
      </Flex>
      <VStack spacing={1} align="stretch">
        <NavItem icon={FaChartBar} to="/admin">Dashboard</NavItem>
        <NavItem icon={FaList} to="/admin/categories">Danh mục</NavItem>
        <NavItem icon={FaBox} to="/admin/products">Sản phẩm</NavItem>
        <NavItem icon={FaShoppingCart} to="/admin/orders">Đơn hàng</NavItem>
        <NavItem icon={FaUsers} to="/admin/users">Người dùng</NavItem>
        <Box my={4} borderTop="1px" borderColor={borderColor} />
        <NavItem icon={FaHome} to="/">Về trang chủ</NavItem>
      </VStack>
    </Box>
  );
};

export default Sidebar;