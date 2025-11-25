import React, { useState } from 'react';
import { Flex, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../services/auth.service';
import RegisterForm from '../components/RegisterForm';
import OtpForm from '../components/OtpForm';

const RegisterPage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    
    // Step 1: Form Đăng ký. Step 2: Form OTP
    const [step, setStep] = useState(1); 
    const [isLoading, setIsLoading] = useState(false);
    
    // Lưu data để gửi lại OTP
    const [savedFormData, setSavedFormData] = useState(null); 
    const [registeredEmail, setRegisteredEmail] = useState('');

    const handleRegister = async (formData) => {
        setIsLoading(true);
        try {
            await AuthService.register(formData);
            
            setRegisteredEmail(formData.email);
            setSavedFormData(formData); 
            setStep(2); // Chuyển sang bước nhập OTP (Use Case Step 4)

            toast({ title: "Đăng ký thành công", description: "Mã OTP đã được gửi vào email của bạn.", status: "success", duration: 5000 });
        } catch (error) {
            // Xử lý lỗi (Tài khoản đã tồn tại, thông tin không hợp lệ - Use Case 4a, 4c)
            const errorMsg = error.response?.data?.message || "Đăng ký thất bại";
            toast({ title: "Lỗi", description: errorMsg, status: "error", duration: 3000 });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!savedFormData) return; // Bảo vệ: Không gửi nếu chưa có data
        
        try {
            // Gọi lại API Register để Backend tự gửi OTP mới
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
            
            // Use Case Step 6: Chuyển sang trang đăng nhập
            navigate('/login');

        } catch (error) {
            // Use Case 6a: Mã OTP không hợp lệ
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
                    onResend={handleResendOtp} 
                    email={registeredEmail} 
                    isLoading={isLoading} 
                />
            )}
        </Flex>
    );
};

export default RegisterPage;