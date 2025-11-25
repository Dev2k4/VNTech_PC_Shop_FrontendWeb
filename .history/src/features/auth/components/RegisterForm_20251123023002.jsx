import React, { useState } from 'react';
import {
    Box, Button, FormControl, FormLabel, Input, VStack, Text, Link as ChakraLink, useToast
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const RegisterForm = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const toast = useToast();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Use Case 4b: Kiểm tra mật khẩu trùng khớp
        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Lỗi",
                description: "Mật khẩu nhập lại không khớp",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        onSubmit(formData);
    };

    return (
        <Box bg="white" p={8} rounded="lg" shadow="lg" w={{ base: "90%", md: "450px" }} borderWidth="1px">
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">Đăng Ký</Text>

                <FormControl isRequired>
                    <FormLabel>Họ và tên</FormLabel>
                    <Input name="username" value={formData.username} onChange={handleChange} placeholder="Nguyễn Văn A"/>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@example.com"/>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Mật khẩu</FormLabel>
                    <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="******"/>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Nhập lại mật khẩu</FormLabel>
                    <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="******"/>
                </FormControl>

                <Button type="submit" colorScheme="blue" w="full" isLoading={isLoading} loadingText="Đang xử lý">
                    Đăng ký tài khoản
                </Button>

                <Text fontSize="sm">
                    Đã có tài khoản? <ChakraLink as={Link} to="/login" color="blue.500">Đăng nhập</ChakraLink>
                </Text>
            </VStack>
        </Box>
    );
};

export default RegisterForm;