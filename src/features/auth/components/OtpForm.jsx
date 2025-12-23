import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Text,
    useColorModeValue
} from '@chakra-ui/react';

const OTP_DURATION = 120; // 2 phút

const OtpForm = ({ onSubmit, onResend, email, isLoading, isTransparent }) => {
    const [otp, setOtp] = useState('');
    const [timeLeft, setTimeLeft] = useState(OTP_DURATION);

    const bg = isTransparent ? "transparent" : useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const inputBg = useColorModeValue("gray.50", "whiteAlpha.100");

    // ⏱ Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    const handleResend = () => {
        onResend();
        setTimeLeft(OTP_DURATION); // reset lại 2 phút
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <Box w="full" bg={bg}>
            <VStack
                spacing={6}
                as="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(otp);
                }}
            >
                <FormControl isRequired>
                    <FormLabel color={textColor} textAlign="center">
                        Nhập mã 6 số
                    </FormLabel>

                    <Input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        textAlign="center"
                        fontSize="3xl"
                        letterSpacing="widest"
                        maxLength={6}
                        bg={inputBg}
                        border="2px solid"
                        borderColor="blue.500"
                        color={textColor}
                        h="60px"
                    />
                </FormControl>

                <Button
                    type="submit"
                    w="full"
                    size="lg"
                    colorScheme="green"
                    isLoading={isLoading}
                    isDisabled={otp.length !== 6}
                >
                    Xác thực
                </Button>

                {timeLeft > 0 ? (
                    <Text fontSize="sm" color="gray.500">
                        Gửi lại mã sau <b>{formatTime(timeLeft)}</b>
                    </Text>
                ) : (
                    <Button
                        size="sm"
                        variant="link"
                        color="blue.400"
                        onClick={handleResend}
                        isDisabled={isLoading}
                    >
                        Gửi lại mã mới
                    </Button>
                )}
            </VStack>
        </Box>
    );
};

export default OtpForm;
