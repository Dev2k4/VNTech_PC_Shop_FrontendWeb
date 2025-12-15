// src/features/admin/components/AdminHeader.jsx
import React from 'react';
import { Flex, IconButton, Text, HStack, Avatar, Menu, MenuButton, MenuList, MenuItem, useColorModeValue, Box } from '@chakra-ui/react';
import { FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ onOpen }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Admin';
  
  // Màu nền tối đồng bộ Sidebar
  const bg = useColorModeValue('white', '#0a0a0a'); 
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const textColor = useColorModeValue('gray.800', 'white');

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("auth-change"));
    navigate('/login');
  };

  return (
    <Flex
      px={{ base: 4, md: 6 }}
      height="20" // Cao hơn xíu cho thoáng
      alignItems="center"
      bg={bg}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FaBars />}
        color={textColor}
      />

      <Text display={{ base: 'flex', md: 'none' }} fontSize="xl" fontWeight="bold" color={textColor}>
        VNTech Admin
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Box textAlign="right" mr={3} display={{ base: 'none', md: 'block' }}>
                  <Text fontSize="sm" fontWeight="bold" color={textColor}>{userName}</Text>
                  <Text fontSize="xs" color="gray.500">Super Admin</Text>
                </Box>
                <Avatar size={'sm'} name={userName} bgGradient="linear(to-r, blue.400, purple.500)" color="white" />
              </HStack>
            </MenuButton>
            <MenuList bg={useColorModeValue('white', '#1a1a1a')} borderColor={borderColor}>
              <MenuItem onClick={handleLogout} color="red.400" _hover={{bg: 'whiteAlpha.100'}}>Đăng xuất</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default AdminHeader;