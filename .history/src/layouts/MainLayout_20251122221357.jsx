import React from 'react';
import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header'; // Đường dẫn chuẩn theo cây thư mục của bạn

const MainLayout = () => {
  return (
    <Box minH="100vh" bg="apple.bg">
      {/* Header luôn hiển thị ở trên cùng */}
      <Header /> 
      
      {/* Outlet là nơi nội dung các trang con (Home, Login...) sẽ được hiển thị */}
      <Box as="main">
        <Outlet />
      </Box>

      {/* Footer đơn giản */}
      <Box py={10} textAlign="center" color="gray.500" fontSize="sm" borderTop="1px solid" borderColor="whiteAlpha.200" mt={20}>
        <p>&copy; 2025 VNTech Store. Designed by Nhom 16.</p>
      </Box>
    </Box>
  );
};

export default MainLayout;