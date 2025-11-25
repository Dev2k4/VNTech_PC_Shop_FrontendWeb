import React, { useState } from 'react';
import { Flex, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../services/auth.service';
import LoginForm from '../components/LoginForm';
// import { useCart } from '../../../context/CartContext'; // Mở comment dòng này khi bạn đã làm xong CartContext

const LoginPage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    // const { fetchCart } = useCart(); // Mở comment khi xong CartContext

    const handleLogin = async (formData) => {
        setIsLoading(true);
        try {
            // 1. Gọi API Login
            const response = await AuthService.login(formData);
            
            // 2. Lấy dữ liệu từ Backend trả về
            // Backend trả về: { success: true, data: { accessToken, refreshToken, role, ... } }
            const { accessToken, refreshToken, role, message } = response.data;

            // 3. Lưu vào LocalStorage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('role', role);

            toast({
                title: "Đăng nhập thành công",
                description: message || "Chào mừng bạn quay trở lại!",
                status: "success",
                duration: 2000,
            });

            // 4. Gọi load giỏ hàng (Để cập nhật số lượng trên header ngay lập tức)
            // await fetchCart(); 

            // 5. Điều hướng dựa trên Role (Use Case 4b & 4c)
            if (role === 'ADMIN' || role === 'ROLE_ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }

        } catch (error) {
            // Xử lý lỗi (Sai mật khẩu, chưa xác thực OTP...)
            const errorMsg = error.response?.data?.message || "Đăng nhập thất bại";
            toast({
                title: "Lỗi đăng nhập",
                description: errorMsg,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Flex minH="100vh" align="center" justify="center" bg="gray.50">
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        </Flex>
    );
};

export default LoginPage;