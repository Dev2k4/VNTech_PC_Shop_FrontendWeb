import React, { useState } from 'react';
import {
    Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, useToast, 
    Container, useColorModeValue, Flex, Icon
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { FaKey, FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../services/auth.service';

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Pass
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    // UI Colors
    const bg = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");

    // BƯỚC 1: GỬI EMAIL
    const handleSendEmail = async () => {
        setLoading(true);
        try {
            await AuthService.forgotPassword(email);
            toast({ title: "Đã gửi OTP", description: "Kiểm tra email của bạn", status: "success" });
            setStep(2);
        } catch (error) {
            toast({ title: "Lỗi", description: "Email không tồn tại hoặc lỗi hệ thống", status: "error" });
        } finally { setLoading(false); }
    };

    // BƯỚC 2: VERIFY OTP
    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            await AuthService.verifyResetOtp(otp);
            toast({ title: "OTP Hợp lệ", status: "success" });
            setStep(3);
        } catch (error) {
            toast({ title: "Lỗi", description: "Mã OTP không đúng", status: "error" });
        } finally { setLoading(false); }
    };

    // BƯỚC 3: ĐỔI MẬT KHẨU
    const handleResetPassword = async () => {
        setLoading(true);
        try {
            await AuthService.resetPassword(email, password);
            toast({ title: "Thành công", description: "Mật khẩu đã được đổi. Vui lòng đăng nhập.", status: "success" });
            navigate('/login');
        } catch (error) {
            toast({ title: "Lỗi", description: "Không thể đổi mật khẩu", status: "error" });
        } finally { setLoading(false); }
    };

    return (
        <Flex minH="100vh" align="center" justify="center" bg={bg}>
            <Container maxW="md">
                <Box bg={cardBg} p={8} borderRadius="2xl" shadow="xl" border="1px solid" borderColor="whiteAlpha.200">
                    <VStack spacing={6}>
                        <Icon as={FaKey} w={12} h={12} color="blue.500" />
                        <Heading size="lg">Quên mật khẩu</Heading>
                        <Text color="gray.500" textAlign="center">
                            {step === 1 && "Nhập email đã đăng ký để nhận mã OTP."}
                            {step === 2 && "Nhập mã OTP 6 số vừa gửi tới email của bạn."}
                            {step === 3 && "Thiết lập mật khẩu mới cho tài khoản."}
                        </Text>

                        {step === 1 && (
                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" size="lg"/>
                                <Button mt={6} w="full" colorScheme="blue" onClick={handleSendEmail} isLoading={loading}>Gửi mã OTP</Button>
                            </FormControl>
                        )}

                        {step === 2 && (
                            <FormControl>
                                <FormLabel>Mã OTP</FormLabel>
                                <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="000000" textAlign="center" fontSize="2xl" letterSpacing="widest" size="lg"/>
                                <Button mt={6} w="full" colorScheme="green" onClick={handleVerifyOtp} isLoading={loading}>Xác thực</Button>
                            </FormControl>
                        )}

                        {step === 3 && (
                            <FormControl>
                                <FormLabel>Mật khẩu mới</FormLabel>
                                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nhập mật khẩu mới" size="lg"/>
                                <Button mt={6} w="full" colorScheme="purple" onClick={handleResetPassword} isLoading={loading}>Đổi mật khẩu</Button>
                            </FormControl>
                        )}
                        
                        <Button variant="link" size="sm" onClick={() => navigate('/login')}>Quay lại đăng nhập</Button>
                    </VStack>
                </Box>
            </Container>
        </Flex>
    );
};

export default ForgotPasswordPage;