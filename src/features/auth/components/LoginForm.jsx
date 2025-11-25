import React, { useState } from 'react';
import {
    Box, Button, FormControl, FormLabel, Input, VStack, Text, Link as ChakraLink
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const LoginForm = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Box bg="white" p={8} rounded="lg" shadow="lg" w={{ base: "90%", md: "400px" }} borderWidth="1px">
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">Đăng Nhập</Text>
                
                <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="email@example.com" 
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Mật khẩu</FormLabel>
                    <Input 
                        name="password" 
                        type="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        placeholder="******" 
                    />
                </FormControl>

                <Button type="submit" colorScheme="blue" w="full" isLoading={isLoading} loadingText="Đang đăng nhập">
                    Đăng nhập
                </Button>

                <Text fontSize="sm">
                    Chưa có tài khoản? <ChakraLink as={Link} to="/register" color="blue.500">Đăng ký ngay</ChakraLink>
                </Text>
            </VStack>
        </Box>
    );
};

export default LoginForm;