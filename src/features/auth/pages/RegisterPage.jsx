import React, { useState } from 'react';
import { Flex, useToast, useColorModeValue } from '@chakra-ui/react';
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

    // --- FIX DARK MODE BACKGROUND ---
    const bg = useColorModeValue("gray.50", "gray.900");
    // --------------------------------

    const handleRegister = async (formData) => {
        setIsLoading(true);
        try {
            await AuthService.register(formData);
            
            setRegisteredEmail(formData.email);
            setSavedFormData(formData); 
            setStep(2); 

            toast({ title: "Đăng ký thành công", description: "Mã OTP đã được gửi vào email của bạn.", status: "success", duration: 5000 });
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Đăng ký thất bại";
            toast({ title: "Lỗi", description: errorMsg, status: "error", duration: 3000 });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!savedFormData) return;
        try {
            await AuthService.register(savedFormData); 
            toast({ title: "Đã gửi lại", description: "Mã OTP mới đã được gửi vào email.", status: "info", duration: 3000 });
        } catch (error) {
            toast({ title: "Gửi lại thất bại", description: "Lỗi hệ thống", status: "error" });
        }
    };

    const handleVerifyOtp = async (otp) => {
        setIsLoading(true);
        try {
            await AuthService.verifyOtp(otp);
            toast({ title: "Xác thực thành công", description: "Tài khoản đã kích hoạt.", status: "success" });
            navigate('/login');
        } catch (error) {
            toast({ title: "Xác thực thất bại", description: error.response?.data?.message || "OTP không đúng", status: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Flex minH="100vh" align="center" justify="center" bg={bg}>
            {step === 1 ? (
                <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
            ) : (
                <OtpForm 
                    onSubmit={handleVerifyOtp} 
                    onResend={handleResendOtp} 
                    email={registeredEmail} 
                    isLoading={isLoading} 
                />
            )}
        </Flex>
    );
};

export default RegisterPage;