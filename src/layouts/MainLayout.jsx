import React from 'react';
import { Box, useColorModeValue, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';  
import FacebookMessenger from '../components/common/FacebookMessenger';
import MessengerButton from "../components/common/MessengerButton";
import ChatBot from "../components/common/ChatBot";

const MainLayout = () => {
  const bgColor = useColorModeValue("apple.lightBg", "apple.bg");

  return (
    <Flex direction="column" minH="100vh" bg={bgColor}>
      <Header />
      
      <Box as="main" flex="1">
        <Outlet />
      </Box>

      <Footer />
      <FacebookMessenger />
      <MessengerButton />
      <ChatBot />
    </Flex>
  );
};

export default MainLayout;