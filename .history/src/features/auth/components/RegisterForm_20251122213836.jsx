import React, { useState } from 'react';
import { Flex, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../services/auth.service';
import RegisterForm from '../components/RegisterForm';
import OtpForm from '../components/OtpForm'; // Đảm bảo OtpForm đã là bản "Không Timer"

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
            setStep(2); // Chuyển sang bước 2
            toast({ title: "Thành công", status: "success" });
        } catch (error) {
            toast({ title: "Lỗi", description: "Đăng ký thất bại", status: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (otp) => {
        setIsLoading(true);
        try {
            await AuthService.verifyOtp(otp);
            toast({ title: "Xác thực thành công", status: "success" });
            navigate('/login');
        } catch (error) {
            toast({ title: "Lỗi OTP", status: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm gửi lại rỗng (tạm thời để tránh lỗi logic)
    const handleResendOtp = async () => {
        console.log("Resend clicked");
    };

    console.log("Render Step:", step); // Debug log

    return (
        <Flex minH="100vh" align="center" justify="center" bg="gray.50">
            {step === 1 && (
                <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
            )}
            {step === 2 && (
                <OtpForm 
                    onSubmit={handleVerifyOtp} 
                    onResend={handleResendOtp}
                    email={savedFormData?.email} 
                    isLoading={isLoading} 
                />
            )}
        </Flex>
    );
};

export default RegisterPage;