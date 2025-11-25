import React from 'react';
import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
// Lưu ý: Header nằm ở ../components/layout/Header
import Header from '../components/layout/Header'; 

const MainLayout = () => {
  return (
    <Box minH="100vh" bg="apple.bg">
      <Header />
      <Box as="main">
        <Outlet />
      </Box>
      <Box py={10} textAlign="center" color="gray.500" fontSize="sm" mt={20}>
        <p>&copy; 2025 VNTech Store.</p>
      </Box>
    </Box>
  );
};

export default MainLayout;