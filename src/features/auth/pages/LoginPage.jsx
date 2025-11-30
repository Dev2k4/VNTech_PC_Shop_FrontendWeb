import React, { useState } from "react";
import { Flex, useToast, useColorModeValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/auth.service";
import LoginForm from "../components/LoginForm";
import { useCart } from '../../../context/CartContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { fetchCartCount } = useCart();

  // --- FIX DARK MODE BACKGROUND ---
  const bg = useColorModeValue("gray.50", "gray.900");
  // --------------------------------

  const handleLogin = async (formData) => {
    setIsLoading(true);
    try {
      const loginRes = await AuthService.login(formData);
      
      if (loginRes.success || loginRes.data) {
        const { accessToken, refreshToken, role } = loginRes.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("role", role);

        try {
            const profileRes = await AuthService.getProfile();
            const userInfo = profileRes.data || profileRes; 
            if (userInfo) {
                localStorage.setItem("userId", userInfo.id);
                localStorage.setItem("userName", userInfo.username || userInfo.fullName || userInfo.email);
            }
        } catch (profileErr) {
            console.error("Lỗi lấy thông tin user:", profileErr);
        }

        window.dispatchEvent(new Event("storage"));
        await fetchCartCount();

        toast({ title: "Đăng nhập thành công", status: "success", duration: 2000, isClosable: true });

        if (role === "ADMIN" || role === "ROLE_ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        throw new Error(loginRes.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Email hoặc mật khẩu không đúng";
      toast({ title: "Lỗi đăng nhập", description: errorMsg, status: "error", duration: 3000, isClosable: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg={bg}>
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
    </Flex>
  );
};

export default LoginPage;