import React from 'react';
import { Box, useColorModeValue, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';  

const MainLayout = () => {
  const bgColor = useColorModeValue("apple.lightBg", "apple.bg");

  return (
    <Flex direction="column" minH="100vh" bg={bgColor}>
      <Header />
      
      <Box as="main" flex="1">
        <Outlet />
      </Box>

      <Footer />
    </Flex>
  );
};

export default MainLayout;