import React, { useState } from "react";
import { Flex, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/auth.service";
import LoginForm from "../components/LoginForm";
import { useCart } from "../../../context/CartContext"; 

const LoginPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { fetchCartCount } = useCart(); // Lấy hàm cập nhật giỏ hàng

  const handleLogin = async (formData) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(formData);

      // Lấy data từ response
      const { accessToken, refreshToken, role, id } = response.data;
      const message = response.message; // Lấy message từ response gốc

      // Lưu vào Storage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", id);

      toast({
        title: "Đăng nhập thành công",
        description: message || "Chào mừng bạn quay trở lại!",
        status: "success",
        duration: 2000,
      });

      // Cập nhật giỏ hàng ngay lập tức sau khi có Token
      await fetchCartCount();

      // Điều hướng
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