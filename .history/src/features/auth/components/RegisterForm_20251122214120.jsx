import React from 'react';
import { Flex, Heading } from '@chakra-ui/react'; 

// KHÔNG CÓ useState, useToast, useNavigate, RegisterForm, OtpForm
// Code này KHÔNG THỂ bị treo nếu Routing đúng.

const RegisterPage = () => {
    return (
        <Flex minH="100vh" align="center" justify="center" bg="red.50">
            <Heading color="white">TEST: NẾU THẤY CHỮ NÀY THÌ LOGIC ĐÚNG</Heading>
        </Flex>
    );
};

export default RegisterPage;