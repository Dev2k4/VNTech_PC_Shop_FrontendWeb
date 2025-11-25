import React from 'react';
import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header'; // Đảm bảo file Header.jsx tồn tại ở đường dẫn này

const MainLayout = () => {
  return (
    <Box minH="100vh" bg="apple.bg">
      <Header /> 
      <Box as="main">
        <Outlet />
      </Box>

      {/* Footer */}
      <Box py={10} textAlign="center" color="gray.500" fontSize="sm" borderTop="1px solid" borderColor="whiteAlpha.200" mt={20}>
        <p>&copy; 2025 VNTech Store.</p>
      </Box>
    </Box>
  );
};

export default MainLayout;