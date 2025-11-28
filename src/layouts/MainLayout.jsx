import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';

const MainLayout = () => {
  const bgColor = useColorModeValue("apple.lightBg", "apple.bg");
  const footerColor = useColorModeValue("gray.600", "gray.500");

  return (
    <Box minH="100vh" bg={bgColor}>
      <Header />
      <Box as="main">
        <Outlet />
      </Box>
      <Box py={10} textAlign="center" color={footerColor} fontSize="sm" mt={20}>
        <p>Footer Test</p>
      </Box>
    </Box>
  );
};

export default MainLayout;