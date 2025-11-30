import React from 'react';
import { Box, Avatar, Heading, Text, FormLabel, Input, useColorModeValue } from '@chakra-ui/react';

const UserInfoCard = ({ user, onAvatarChange }) => {
    const cardBg = useColorModeValue('white', 'gray.700');

    return (
        <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm" textAlign="center">
            <Box position="relative" display="inline-block">
                <Avatar 
                    size="2xl" 
                    name={user?.fullName || user?.username} 
                    src={user?.avatar} 
                    mb={4} 
                    border="2px solid white"
                    boxShadow="md"
                />
                <FormLabel 
                    htmlFor="avatar-upload" 
                    position="absolute" 
                    bottom="0" 
                    right="0" 
                    bg="blue.500" 
                    color="white" 
                    rounded="full" 
                    p={2} 
                    cursor="pointer"
                    _hover={{ bg: "blue.600" }}
                    boxShadow="md"
                >
                    <small style={{ fontWeight: 'bold' }}>Sửa</small>
                </FormLabel>
                <Input 
                    id="avatar-upload" 
                    type="file" 
                    display="none" 
                    accept="image/*" 
                    onChange={onAvatarChange} 
                />
            </Box>
            <Heading size="md" mt={2}>{user?.fullName || user?.username}</Heading>
            <Text color="gray.500" fontSize="sm">{user?.email}</Text>
            <Text mt={2} fontSize="xs" fontWeight="bold" color="blue.500" textTransform="uppercase" letterSpacing="1px">
                {user?.roleName}
            </Text>
        </Box>
    );
};

export default UserInfoCard;