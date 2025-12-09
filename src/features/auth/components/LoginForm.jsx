import React, { useState } from 'react';
import {
    Box, Button, FormControl, FormLabel, Input, VStack, Text, Link as ChakraLink, useColorModeValue
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const LoginForm = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const bg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Box 
            bg={bg} 
            p={8} 
            rounded="lg" 
            shadow="lg" 
            w={{ base: "90%", md: "400px" }} 
            borderWidth="1px"
            borderColor={borderColor}
        >
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">Đăng Nhập</Text>
                
                <FormControl isRequired>
                    <FormLabel color={textColor}>Email</FormLabel>
                    <Input 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="email@example.com" 
                        color={textColor}
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel color={textColor}>Mật khẩu</FormLabel>
                    <Input 
                        name="password" 
                        type="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        placeholder="******" 
                        color={textColor}
                    />
                </FormControl>

                <Button type="submit" colorScheme="blue" w="full" isLoading={isLoading} loadingText="Đang đăng nhập">
                    Đăng nhập
                </Button>

                <Text fontSize="sm" color={textColor}>
                    Chưa có tài khoản? <ChakraLink as={Link} to="/register" color="blue.500">Đăng ký ngay</ChakraLink>
                </Text>
            </VStack>
        </Box>
    );
};

export default LoginForm;