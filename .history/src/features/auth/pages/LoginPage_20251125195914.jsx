// src/features/auth/pages/LoginPage.jsx
import React, { useState } from "react";
import { Flex, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/auth.service";
import LoginForm from "../components/LoginForm";
import { useCart } from '../../../context/CartContext'; // 1. Mở comment

const LoginPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { fetchCartCount } = useCart(); // 2. Lấy hàm fetchCartCount từ Context

  const handleLogin = async (formData) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(formData);

      // 3. Destructuring chuẩn từ response backend: { success, message, data }
      const { message, data } = response; 
      const { accessToken, refreshToken, role, id } = data; // Lấy ID ở đây

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", id);

      toast({
        title: "Đăng nhập thành công",
        description: message || "Chào mừng bạn quay trở lại!", // message giờ đã có giá trị
        status: "success",
        duration: 2000,
      });

      // 4. Cập nhật số lượng giỏ hàng ngay lập tức
      await fetchCartCount();

      if (role === "ADMIN" || role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
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