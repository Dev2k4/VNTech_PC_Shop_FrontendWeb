import React from 'react';
import { Box, useColorModeValue, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer'; // Import Footer vừa tạo

const MainLayout = () => {
  const bgColor = useColorModeValue("apple.lightBg", "apple.bg");

  return (
    <Flex direction="column" minH="100vh" bg={bgColor}>
      {/* Header cố định */}
      <Header />
      
      {/* Nội dung chính sẽ giãn ra để đẩy Footer xuống đáy nếu nội dung ngắn */}
      <Box as="main" flex="1">
        <Outlet />
      </Box>

      {/* Footer mới */}
      <Footer />
    </Flex>
  );
};

export default MainLayout;