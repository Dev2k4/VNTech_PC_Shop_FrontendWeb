import React, { useState, useEffect } from 'react';
import {
    Box, Button, FormControl, FormLabel, Input, VStack, Text, HStack
} from '@chakra-ui/react';

const OtpForm = ({ onSubmit, onResend, email, isLoading }) => {
    const [otp, setOtp] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(intervalId);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(otp);
    };

    const handleResendClick = () => {
        if (onResend) {
            setTimeLeft(30);
            onResend();
        }
    };

    return (
        <Box bg="white" p={8} rounded="lg" shadow="lg" w={{ base: "90%", md: "400px" }} borderWidth="1px">
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                <Text fontSize="xl" fontWeight="bold" color="green.600">Xác thực tài khoản</Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                    Mã OTP đã gửi đến: <br/><b>{email}</b>
                </Text>

                <FormControl isRequired>
                    <FormLabel>Nhập mã OTP</FormLabel>
                    <Input 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        placeholder="******" 
                        textAlign="center"
                        fontSize="2xl"
                        letterSpacing="4px"
                        maxLength={6}
                        autoFocus
                    />
                </FormControl>

                <Button type="submit" colorScheme="green" w="full" isLoading={isLoading}>
                    Xác thực ngay
                </Button>

                <HStack justify="center" w="full" pt={2}>
                    <Button 
                        size="sm" 
                        variant="link" 
                        colorScheme="blue"
                        isDisabled={timeLeft > 0 || isLoading} 
                        onClick={handleResendClick}
                        fontWeight="normal"
                    >
                        {timeLeft > 0 ? `Gửi lại sau (${timeLeft}s)` : "Gửi lại mã mới"}
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default OtpForm;