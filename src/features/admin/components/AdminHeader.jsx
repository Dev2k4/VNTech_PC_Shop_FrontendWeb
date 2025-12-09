import React from 'react';
import { Flex, IconButton, Text, HStack, Avatar, Menu, MenuButton, MenuList, MenuItem, useColorModeValue, Box } from '@chakra-ui/react';
import { FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ onOpen }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Admin';
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("auth-change"));
    navigate('/login');
  };

  return (
    <Flex
      px={{ base: 4, md: 6 }}
      height="16"
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
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="xl"
        fontWeight="bold"
      >
        VNTech Admin
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar size={'sm'} name={userName} bg="blue.500" color="white" />
                <Box display={{ base: 'none', md: 'block' }} textAlign="left" ml="2">
                  <Text fontSize="sm" fontWeight="bold">{userName}</Text>
                  <Text fontSize="xs" color="gray.500">Administrator</Text>
                </Box>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleLogout} color="red.500">Đăng xuất</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default AdminHeader;