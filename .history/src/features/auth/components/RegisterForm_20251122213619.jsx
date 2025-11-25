import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const RegisterPage = () => {
    console.log("RegisterPage rendered"); // Check log xem có bị chạy liên tục không
    return (
        <Box p={10} textAlign="center">
            <Heading>Trang Đăng Ký Test</Heading>
            <Text>Nếu bạn nhìn thấy dòng này, nghĩa là Router không bị lỗi.</Text>
        </Box>
    );
};

export default RegisterPage;