import React, { useState } from 'react';
import {
    Box, Button, FormControl, FormLabel, Input, VStack, Text, Link as ChakraLink, useToast, useColorModeValue
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const RegisterForm = ({ onSubmit, isLoading, isTransparent }) => {
    const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
    const toast = useToast();

    // Style xử lý trong suốt nếu cần
    const bg = isTransparent ? "transparent" : useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const inputBg = useColorModeValue("gray.50", "whiteAlpha.100");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast({ title: "Lỗi", description: "Mật khẩu xác nhận không khớp", status: "error", position: 'top' });
            return;
        }
        // Chỉ gửi email và password đúng theo Swagger
        onSubmit({ email: formData.email, password: formData.password });
    };

    return (
        <Box w="full" bg={bg}>
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                <FormControl isRequired>
                    <FormLabel color={textColor}>Email</FormLabel>
                    <Input 
                        name="email" type="email" value={formData.email} onChange={handleChange} 
                        placeholder="email@example.com" 
                        bg={inputBg} borderColor={borderColor} color={textColor} 
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel color={textColor}>Mật khẩu</FormLabel>
                    <Input 
                        name="password" type="password" value={formData.password} onChange={handleChange} 
                        placeholder="Tối thiểu 6 ký tự" 
                        bg={inputBg} borderColor={borderColor} color={textColor} 
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel color={textColor}>Nhập lại mật khẩu</FormLabel>
                    <Input 
                        name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} 
                        placeholder="Xác nhận" 
                        bg={inputBg} borderColor={borderColor} color={textColor} 
                    />
                </FormControl>

                <Button 
                    type="submit" w="full" size="lg" 
                    bgGradient="linear(to-r, blue.500, purple.600)" 
                    _hover={{ bgGradient: "linear(to-r, blue.600, purple.700)" }} 
                    color="white" isLoading={isLoading}
                >
                    Đăng ký
                </Button>

                <Text fontSize="sm" color="gray.400">
                    Đã có tài khoản? <ChakraLink as={Link} to="/login" color="blue.400" fontWeight="bold">Đăng nhập</ChakraLink>
                </Text>
            </VStack>
        </Box>
    );
};

export default RegisterForm;