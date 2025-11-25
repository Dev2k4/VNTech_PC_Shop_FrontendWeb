import React, { useState } from 'react';
import {
    Box, Button, FormControl, FormLabel, Input, VStack, Text, HStack
} from '@chakra-ui/react';

const OtpForm = ({ onSubmit, onResend, email, isLoading }) => {
    // Chỉ giữ lại state nhập liệu cơ bản
    const [otp, setOtp] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(otp);
    };

    return (
        <Box bg="white" p={8} rounded="lg" shadow="lg" w={{ base: "90%", md: "400px" }} borderWidth="1px">
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                <Text fontSize="xl" fontWeight="bold" color="green.600">Xác thực tài khoản</Text>
                
                <Text fontSize="sm" color="gray.600" textAlign="center">
                    OTP đã gửi đến: <b>{email}</b>
                </Text>

                <FormControl isRequired>
                    <FormLabel>Nhập mã OTP</FormLabel>
                    <Input 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        placeholder="Nhập 6 số" 
                        textAlign="center"
                        fontSize="2xl"
                        letterSpacing="4px"
                        maxLength={6}
                        autoFocus
                    />
                </FormControl>

                <Button 
                    type="submit" 
                    colorScheme="green" 
                    w="full" 
                    isLoading={isLoading}
                >
                    Xác thực
                </Button>

                <HStack justify="center" w="full" pt={2}>
                    <Button 
                        size="sm" 
                        variant="link" 
                        colorScheme="blue"
                        onClick={onResend} // Gọi hàm gửi lại
                        isDisabled={isLoading}
                        fontWeight="normal"
                    >
                        Gửi lại mã mới
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default OtpForm;