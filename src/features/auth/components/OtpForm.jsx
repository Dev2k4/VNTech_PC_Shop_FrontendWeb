import React, { useState } from 'react';
import {
    Box, Button, FormControl, FormLabel, Input, VStack, Text, HStack, useColorModeValue
} from '@chakra-ui/react';

const OtpForm = ({ onSubmit, onResend, email, isLoading }) => {
    const [otp, setOtp] = useState('');

    const bg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(otp);
    };

    return (
        <Box 
            bg={bg} 
            p={8} 
            rounded="lg" 
            shadow="lg" 
            w={{ base: "90%", md: "400px" }} 
            borderWidth="1px"
            borderColor={borderColor}
        >
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                <Text fontSize="xl" fontWeight="bold" color="green.500">Xác thực tài khoản</Text>
                
                <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.300")} textAlign="center">
                    Mã OTP đã gửi đến: <br/>
                    <Text as="span" fontWeight="bold" color="blue.500">{email || "Email của bạn"}</Text>
                </Text>

                <FormControl isRequired>
                    <FormLabel color={textColor}>Nhập mã OTP</FormLabel>
                    <Input 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        placeholder="Nhập 6 số OTP" 
                        textAlign="center"
                        fontSize="2xl"
                        letterSpacing="4px"
                        maxLength={6}
                        autoFocus
                        color={textColor}
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
                    <Button 
                        size="sm" 
                        variant="link" 
                        colorScheme="blue"
                        onClick={onResend} 
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