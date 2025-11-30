import React, { useState } from 'react';
import {
    Box, Button, FormControl, FormLabel, Input, VStack, Text, Link as ChakraLink, useToast, useColorModeValue
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const RegisterForm = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const toast = useToast();

    // --- FIX DARK MODE ---
    const bg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    // ---------------------

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast({ title: "Lỗi", description: "Mật khẩu nhập lại không khớp", status: "error", duration: 3000 });
            return;
        }
        onSubmit(formData);
    };

    return (
        <Box 
            bg={bg} 
            p={8} 
            rounded="lg" 
            shadow="lg" 
            w={{ base: "90%", md: "450px" }} 
            borderWidth="1px"
            borderColor={borderColor}
        >
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">Đăng Ký</Text>
                
                <FormControl isRequired>
                    <FormLabel color={textColor}>Họ và tên (Username)</FormLabel>
                    <Input name="username" value={formData.username} onChange={handleChange} placeholder="Nguyễn Văn A" color={textColor} />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel color={textColor}>Email</FormLabel>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" color={textColor} />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel color={textColor}>Mật khẩu</FormLabel>
                    <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Tối thiểu 6 ký tự" color={textColor} />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel color={textColor}>Nhập lại mật khẩu</FormLabel>
                    <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Xác nhận mật khẩu" color={textColor} />
                </FormControl>

                <Button type="submit" colorScheme="blue" w="full" isLoading={isLoading} loadingText="Đang xử lý">
                    Đăng ký tài khoản
                </Button>

                <Text fontSize="sm" color={textColor}>
                    Đã có tài khoản? <ChakraLink as={Link} to="/login" color="blue.500">Đăng nhập</ChakraLink>
                </Text>
            </VStack>
        </Box>
    );
};

export default RegisterForm;