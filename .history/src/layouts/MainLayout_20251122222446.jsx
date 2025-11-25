import React from 'react';
import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';

const MainLayout = () => {
  // --- LOG KIỂM TRA 2 ---
  console.log("2. MainLayout đã được gọi!");
  console.log("   - Header:", Header);
  // ----------------------

  return (
    <Box minH="100vh" bg="apple.bg">
      <Header />
      <Box as="main">
        <Outlet />
      </Box>
      <Box py={10} textAlign="center" color="gray.500" fontSize="sm" mt={20}>
        <p>Footer Test</p>
      </Box>
    </Box>
  );
};

export default MainLayout;