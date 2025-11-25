import React, { useState } from 'react';
import { Flex, useToast } from '@chakra-ui/react';
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
    const handleRegister = async (formData) => {
        setIsLoading(true);
        try {
            await AuthService.register(formData);
            setSavedFormData(formData);
            setStep(2);

            toast({
                title: "Đăng ký thành công",
                description: "Mã OTP đã được gửi vào email của bạn.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Đăng ký thất bại";
            toast({
                title: "Lỗi",
                description: errorMsg,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };
    const handleResendOtp = async () => {
        if (!savedFormData) return;
        try {
            await AuthService.register(savedFormData);
            toast({
                title: "Đã gửi lại",
                description: "Mã OTP mới đã được gửi vào email.",
                status: "info",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        } catch (error) {
            toast({
                title: "Gửi lại thất bại",
                description: error.response?.data?.message || "Lỗi hệ thống",
                status: "error",
                duration: 3000,
            });
        }
    };

    // Xử lý Xác thực OTP (Bước 2 -> Hoàn tất)
    const handleVerifyOtp = async (otp) => {
        setIsLoading(true);
        try {
            await AuthService.verifyOtp(otp);

            toast({
                title: "Xác thực thành công",
                description: "Tài khoản đã kích hoạt. Vui lòng đăng nhập.",
                status: "success",
                duration: 3000,
            });
            
            navigate('/login');

        } catch (error) {
            toast({
                title: "Xác thực thất bại",
                description: error.response?.data?.message || "OTP không đúng",
                status: "error",
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Flex minH="100vh" align="center" justify="center" bg="gray.50">
            {step === 1 ? (
                <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
            ) : (
                <OtpForm 
                    onSubmit={handleVerifyOtp} 
                    onResend={handleResendOtp} // Truyền hàm gửi lại xuống
                    email={savedFormData?.email} 
                    isLoading={isLoading} 
                />
            )}
        </Flex>
    );
};

export default RegisterPage;