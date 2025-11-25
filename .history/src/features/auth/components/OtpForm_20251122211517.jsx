import React, { useState, useEffect } from 'react';
import {
    Box, Button, FormControl, FormLabel, Input, VStack, Text, HStack
} from '@chakra-ui/react';

const OtpForm = ({ onSubmit, onResend, email, isLoading }) => {
    const [otp, setOtp] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);

    // --- LOGIC ĐẾM NGƯỢC AN TOÀN (Dùng setTimeout) ---
    useEffect(() => {
        // 1. Nếu hết giờ thì dừng, không làm gì cả
        if (timeLeft <= 0) return;

        // 2. Đặt hẹn giờ: 1 giây sau thì giảm 1 đơn vị
        const timerId = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        // 3. Dọn dẹp nếu component bị hủy
        return () => clearTimeout(timerId);
    }, [timeLeft]); 
    // ------------------------------------------------

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(otp);
    };

    const handleResendClick = () => {
        if (onResend) {
            setTimeLeft(30); // Reset lại 30s để kích hoạt lại useEffect
            onResend();
        }
    };

    return (
        <Box bg="white" p={8} rounded="lg" shadow="lg" w={{ base: "90%", md: "400px" }} borderWidth="1px">
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                <Text fontSize="xl" fontWeight="bold" color="green.600">Xác thực tài khoản</Text>
                
                <Text fontSize="sm" color="gray.600" textAlign="center">
                    Mã OTP đã gửi đến: <br/>
                    <Text as="span" fontWeight="bold" color="blue.600">{email || "Email của bạn"}</Text>
                </Text>

                <FormControl isRequired>
                    <FormLabel>Nhập mã OTP</FormLabel>
                    <Input 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        placeholder="6 số OTP" 
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
                    loadingText="Đang xác thực..."
                >
                    Xác thực ngay
                </Button>

                <HStack justify="center" w="full" pt={2}>
                    <Text fontSize="sm" color="gray.500">Chưa nhận được mã?</Text>
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