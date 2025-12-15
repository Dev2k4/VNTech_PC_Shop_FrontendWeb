import React from 'react';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../features/admin/components/Sidebar';
import AdminHeader from '../features/admin/components/AdminHeader';

const AdminLayout = () => {
  const role = localStorage.getItem('role');
  // Admin dùng màu nền cực tối để tập trung
  const bg = useColorModeValue('gray.50', '#000000'); 
  
  if (role !== 'ADMIN' && role !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />;
  }
  return (
    <Flex h="100vh" bg={bg} overflow="hidden">
      <Sidebar display={{ base: 'none', md: 'block' }} w="260px" />
      <Flex direction="column" flex="1" overflow="auto">
        <AdminHeader />
        <Box p={6} flex="1">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default AdminLayout;