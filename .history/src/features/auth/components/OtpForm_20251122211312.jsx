import React, { useState } from 'react';
import {
    Box, Button, FormControl, FormLabel, Input, VStack, Text
} from '@chakra-ui/react';

const OtpForm = ({ onSubmit, email, isLoading }) => {
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
                    Mã OTP đã được gửi đến email: <b>{email}</b>
                </Text>

                <FormControl isRequired>
                    <FormLabel>Nhập mã OTP</FormLabel>
                    <Input 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        placeholder="Nhập 6 số OTP" 
                        textAlign="center"
                        fontSize="lg"
                        letterSpacing="2px"
                    />
                </FormControl>

                <Button type="submit" colorScheme="green" w="full" isLoading={isLoading}>
                    Xác thực
                </Button>
            </VStack>
        </Box>
    );
};

export default OtpForm;