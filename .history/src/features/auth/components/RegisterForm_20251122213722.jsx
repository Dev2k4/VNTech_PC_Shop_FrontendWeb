import React, { useState } from 'react';
import {
    Box, Button, FormControl, FormLabel, Input, VStack, Text, Link as ChakraLink, useToast
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const RegisterForm = ({ onSubmit, isLoading }) => {
    // State đơn giản
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const toast = useToast();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast({ title: "Lỗi", description: "Mật khẩu không khớp", status: "error", duration: 3000 });
            return;
        }
        onSubmit(formData);
    };

    return (
        <Box bg="white" p={8} rounded="lg" shadow="lg" w={{ base: "90%", md: "450px" }} borderWidth="1px">
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">Đăng Ký</Text>
                
                <FormControl>
                    <FormLabel>Họ tên</FormLabel>
                    <Input name="username" onChange={handleChange} />
                </FormControl>
                
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input name="email" onChange={handleChange} />
                </FormControl>

                <FormControl>
                    <FormLabel>Mật khẩu</FormLabel>
                    <Input name="password" type="password" onChange={handleChange} />
                </FormControl>

                <FormControl>
                    <FormLabel>Nhập lại MK</FormLabel>
                    <Input name="confirmPassword" type="password" onChange={handleChange} />
                </FormControl>

                <Button type="submit" colorScheme="blue" w="full" isLoading={isLoading}>
                    Đăng ký
                </Button>

                <Text fontSize="sm">
                    Đã có tài khoản? <ChakraLink as={Link} to="/login" color="blue.500">Đăng nhập</ChakraLink>
                </Text>
            </VStack>
        </Box>
    );
};

export default RegisterForm;