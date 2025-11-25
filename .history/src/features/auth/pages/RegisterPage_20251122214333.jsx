import React, { useState } from 'react';
import { Flex, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../services/auth.service';
import RegisterForm from '../components/RegisterForm';
import OtpForm from '../components/OtpForm';

const RegisterPage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    
    // State 1: Form Đăng ký; State 2: Form OTP
    const [step, setStep] = useState(1); 
    const [isLoading, setIsLoading] = useState(false);
    
    // ⚠️ LƯU Ý: Cần lưu data cũ để gửi lại OTP
    const [savedFormData, setSavedFormData] = useState(null); 
    const [registeredEmail, setRegisteredEmail] = useState('');

    // Xử lý sự kiện Đăng ký
    const handleRegister = async (formData) => {
        setIsLoading(true);
        try {
            await AuthService.register(formData);
            
            // Cập nhật state sau khi gọi API thành công
            setRegisteredEmail(formData.email);
            setSavedFormData(formData); // Lưu data để resend
            setStep(2); // Chuyển sang bước nhập OTP

            toast({
                title: "Đăng ký thành công",
                description: "Mã OTP đã được gửi vào email của bạn.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Đăng ký thất bại";
            toast({ title: "Lỗi", description: errorMsg, status: "error", duration: 3000 });
        } finally {
            setIsLoading(false);
        }
    };

    // Xử lý sự kiện Gửi lại OTP (Bắt buộc phải có để tránh lỗi)
    const handleResendOtp = async () => {
        if (!savedFormData) return; // Nếu chưa có data thì bỏ qua

        try {
            // Gọi API Register lại để Backend tự gửi OTP mới
            await AuthService.register(savedFormData); 
            toast({ title: "Đã gửi lại", description: "Mã OTP mới đã được gửi vào email.", status: "info", duration: 3000 });
        } catch (error) {
            toast({ title: "Gửi lại thất bại", description: "Lỗi hệ thống", status: "error" });
        }
    };

    // Xử lý sự kiện Xác thực OTP
    const handleVerifyOtp = async (otp) => {
        setIsLoading(true);
        try {
            await AuthService.verifyOtp(otp);

            toast({ title: "Xác thực thành công", status: "success" });
            navigate('/login');

        } catch (error) {
            toast({ title: "Xác thực thất bại", description: error.response?.data?.message || "OTP không đúng", status: "error" });
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
                    onResend={handleResendOtp} // TRUYỀN HÀM RESEND ĐÃ FIX
                    email={registeredEmail} 
                    isLoading={isLoading} 
                />
            )}
        </Flex>
    );
};

export default RegisterPage;