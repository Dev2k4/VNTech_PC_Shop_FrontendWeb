import React, { useState, useEffect } from 'react';
import {
    Box, Button, FormControl, FormLabel, Input, VStack, Text, HStack
} from '@chakra-ui/react';

const OtpForm = ({ onSubmit, onResend, email, isLoading }) => {
    const [otp, setOtp] = useState('');
    // State đếm ngược (Mặc định 30s)
    const [timeLeft, setTimeLeft] = useState(30);

    // Logic đếm ngược
    useEffect(() => {
        if (timeLeft === 0) return; // Hết giờ thì dừng

        const intervalId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        // Dọn dẹp timer khi component unmount hoặc hết giờ
        return () => clearInterval(intervalId);
    }, [timeLeft]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(otp);
    };

    // Xử lý khi bấm Gửi lại
    const handleResendClick = () => {
        setTimeLeft(30); // Reset lại 30s
        onResend();      // Gọi hàm gửi lại từ trang cha
    };

    return (
        <Box bg="white" p={8} rounded="lg" shadow="lg" w={{ base: "90%", md: "400px" }} borderWidth="1px">
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                <Text fontSize="xl" fontWeight="bold" color="green.600">Xác thực tài khoản</Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                    Mã OTP đã được gửi đến email: <br/><b>{email}</b>
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
                        maxLength={6}
                    />
                </FormControl>

                <Button type="submit" colorScheme="green" w="full" isLoading={isLoading}>
                    Xác thực
                </Button>

                {/* Khu vực gửi lại OTP */}
                <HStack justify="center" w="full" pt={2}>
                    <Text fontSize="sm" color="gray.500">Chưa nhận được mã?</Text>
                    <Button 
                        size="sm" 
                        variant="link" 
                        colorScheme="blue"
                        isDisabled={timeLeft > 0 || isLoading} // Disable khi còn thời gian
                        onClick={handleResendClick}
                    >
                        {timeLeft > 0 ? `Gửi lại sau ${timeLeft}s` : "Gửi lại OTP"}
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default OtpForm;