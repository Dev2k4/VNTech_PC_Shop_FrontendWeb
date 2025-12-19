import React, { useState } from 'react';
import { Flex, useToast, useColorModeValue, Box, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../services/auth.service';
import RegisterForm from '../components/RegisterForm';
import OtpForm from '../components/OtpForm';

const RegisterPage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [step, setStep] = useState(1); 
    const [isLoading, setIsLoading] = useState(false);
    const [savedFormData, setSavedFormData] = useState(null); 
    const [registeredEmail, setRegisteredEmail] = useState('');

    // --- ĐỒNG BỘ UI VỚI LOGIN PAGE ---
    // Sử dụng ảnh nền công nghệ tương tự (hoặc khác một chút để phân biệt nhưng cùng tông)
    const bgImage = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"; 
    
    // Màu nền card (Đồng bộ với Login)
    const cardBg = useColorModeValue("whiteAlpha.900", "blackAlpha.800");

    // BƯỚC 1: ĐĂNG KÝ
    const handleRegister = async (formData) => {
        setIsLoading(true);
        try {
            await AuthService.register(formData);
            
            setRegisteredEmail(formData.email);
            setSavedFormData(formData); 
            setStep(2); // Chuyển sang bước nhập OTP

            toast({ title: "Đăng ký thành công", description: "Mã OTP đã được gửi vào email.", status: "success", duration: 4000 });
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Đăng ký thất bại";
            toast({ title: "Lỗi", description: errorMsg, status: "error", position: 'top' });
        } finally {
            setIsLoading(false);
        }
    };

    // BƯỚC 2: GỬI LẠI OTP
    const handleResendOtp = async () => {
        if (!savedFormData) return;
        try {
            await AuthService.register(savedFormData); 
            toast({ title: "Đã gửi lại", description: "Mã OTP mới đã được gửi.", status: "info" });
        } catch (error) {
            toast({ title: "Gửi lại thất bại", status: "error" });
        }
    };

    // BƯỚC 3: XÁC THỰC OTP
    const handleVerifyOtp = async (otp) => {
        setIsLoading(true);
        try {
            await AuthService.verifyOtp(otp);
            toast({ title: "Xác thực thành công", description: "Tài khoản đã kích hoạt.", status: "success" });
            navigate('/login');
        } catch (error) {
            toast({ title: "Xác thực thất bại", description: "OTP không đúng hoặc hết hạn", status: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Flex minH="100vh" align="center" justify="center" position="relative" overflow="hidden">
             {/* --- BACKGROUND GIỐNG LOGIN PAGE --- */}
             <Box 
                position="absolute" top="0" left="0" w="100%" h="100%" 
                bgImage={`url(${bgImage})`} bgSize="cover" bgPosition="center" 
                zIndex="-2" 
             />
             <Box 
                position="absolute" top="0" left="0" w="100%" h="100%" 
                bg="rgba(0, 0, 0, 0.7)" backdropFilter="blur(8px)" 
                zIndex="-1" 
             />

            {/* --- CARD REGISTER (STYLE GIỐNG LOGIN) --- */}
            <Box 
                zIndex="1" 
                w={{ base: "90%", md: "450px" }}
                bg={cardBg}
                p={8} 
                borderRadius="2xl" 
                boxShadow="2xl"
                border="1px solid"
                borderColor="whiteAlpha.200"
            >
                <Box textAlign="center" mb={6}>
                    <Heading size="xl" mb={2} bgGradient="linear(to-r, blue.400, purple.600)" bgClip="text">
                        {step === 1 ? "Tạo tài khoản mới" : "Xác thực OTP"}
                    </Heading>
                    <Text color="gray.500">
                        {step === 1 ? "Gia nhập cộng đồng công nghệ VNTech" : `Nhập mã gửi tới ${registeredEmail}`}
                    </Text>
                </Box>

                {step === 1 ? (
                    <RegisterForm onSubmit={handleRegister} isLoading={isLoading} isTransparent={true} />
                ) : (
                    <OtpForm 
                        onSubmit={handleVerifyOtp} 
                        onResend={handleResendOtp} 
                        email={registeredEmail} 
                        isLoading={isLoading} 
                        isTransparent={true}
                    />
                )}
            </Box>
        </Flex>
    );
};

export default RegisterPage;