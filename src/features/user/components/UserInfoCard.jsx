import React from 'react';
import { Box, Avatar, Heading, Text, FormLabel, Input, useColorModeValue, Badge } from '@chakra-ui/react';
import { FaCamera } from 'react-icons/fa'; // Nhớ import Icon

const UserInfoCard = ({ user, onAvatarChange }) => {
    // --- FIX COLOR ---
    const cardBg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.800', 'white');
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
    // -----------------

    return (
        <Box 
            bg={cardBg} p={6} borderRadius="lg" shadow="sm" textAlign="center"
            border="1px solid" borderColor={borderColor}
        >
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
                    position="absolute" bottom="0" right="0" 
                    bg="blue.500" color="white" rounded="full" p={2} 
                    cursor="pointer" _hover={{ bg: "blue.600" }} boxShadow="md"
                >
                   {/* Dùng icon thay vì text 'Sửa' cho đẹp */}
                   <Box as={FaCamera} />
                </FormLabel>
                <Input 
                    id="avatar-upload" type="file" display="none" accept="image/*" onChange={onAvatarChange} 
                />
            </Box>
            <Heading size="md" mt={2} color={textColor}>{user?.fullName || user?.username}</Heading>
            <Text color="gray.500" fontSize="sm">{user?.email}</Text>
            
            <Badge mt={3} colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
                {user?.roleName || "MEMBER"}
            </Badge>
        </Box>
    );
};

export default UserInfoCard;