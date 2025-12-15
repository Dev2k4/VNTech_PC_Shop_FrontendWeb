import React, { useState } from 'react';
import {
    Box, Button, FormControl, FormLabel, Input, VStack, Text, HStack, useColorModeValue
} from '@chakra-ui/react';

const OtpForm = ({ onSubmit, onResend, email, isLoading, isTransparent }) => {
    const [otp, setOtp] = useState('');
    const bg = isTransparent ? "transparent" : useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const inputBg = useColorModeValue("gray.50", "whiteAlpha.100");

    return (
        <Box w="full" bg={bg}>
            <VStack spacing={6} as="form" onSubmit={(e) => { e.preventDefault(); onSubmit(otp); }}>
                <FormControl isRequired>
                    <FormLabel color={textColor} textAlign="center">Nhập mã 6 số</FormLabel>
                    <Input 
                        value={otp} onChange={(e) => setOtp(e.target.value)} 
                        placeholder="000000" textAlign="center" fontSize="3xl" letterSpacing="widest" maxLength={6}
                        bg={inputBg} border="2px solid" borderColor="blue.500" color={textColor} h="60px"
                    />
                </FormControl>

                <Button type="submit" w="full" size="lg" colorScheme="green" isLoading={isLoading}>Xác thực</Button>

                <Button size="sm" variant="link" color="blue.400" onClick={onResend} isDisabled={isLoading}>
                    Gửi lại mã mới
                </Button>
            </VStack>
        </Box>
    );
};

export default OtpForm;