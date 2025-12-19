import React, { useState } from 'react';
import {
    Box, Button, FormControl, FormLabel, Input, VStack, Text, Link as ChakraLink, useColorModeValue, Flex
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const LoginForm = ({ onSubmit, isLoading, isTransparent }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const bg = isTransparent ? "transparent" : useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const inputBg = isTransparent ? useColorModeValue("gray.50", "whiteAlpha.200") : useColorModeValue("gray.50", "whiteAlpha.100");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

    return (
        <Box w="full" bg={bg}>
            <VStack spacing={5} as="form" onSubmit={handleSubmit}>
                <FormControl isRequired>
                    <FormLabel color={textColor}>Email</FormLabel>
                    <Input 
                        name="email" type="email" value={formData.email} onChange={handleChange} 
                        placeholder="email@example.com" 
                        bg={inputBg} border="1px solid" borderColor={borderColor} color={textColor}
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel color={textColor}>Mật khẩu</FormLabel>
                    <Input 
                        name="password" type="password" value={formData.password} onChange={handleChange} 
                        placeholder="******" 
                        bg={inputBg} border="1px solid" borderColor={borderColor} color={textColor}
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                    />
                </FormControl>
                <Flex w="full" justify="flex-end">
                    <ChakraLink as={Link} to="/forgot-password" color="blue.400" fontSize="sm" fontWeight="medium">
                        Quên mật khẩu?
                    </ChakraLink>
                </Flex>

                <Button 
                    type="submit" w="full" size="lg" 
                    bgGradient="linear(to-r, blue.500, purple.600)" 
                    _hover={{ bgGradient: "linear(to-r, blue.600, purple.700)" }}
                    color="white" isLoading={isLoading} loadingText="Đang đăng nhập"
                >
                    Đăng nhập
                </Button>

                <Text fontSize="sm" color="gray.400">
                    Chưa có tài khoản? <ChakraLink as={Link} to="/register" color="blue.400" fontWeight="bold">Đăng ký ngay</ChakraLink>
                </Text>
            </VStack>
        </Box>
    );
};

export default LoginForm;