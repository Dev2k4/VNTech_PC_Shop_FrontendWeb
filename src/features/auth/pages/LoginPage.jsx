import React, { useState } from "react";
import { Flex, useToast, useColorModeValue, Box, Heading, Text, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/auth.service";
import LoginForm from "../components/LoginForm";
import { useCart } from '../../../context/CartContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { fetchCartCount } = useCart();

  // Background image công nghệ
  const bgImage = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"; 

  const handleLogin = async (formData) => {
    setIsLoading(true);
    try {
      const loginRes = await AuthService.login(formData);
      
      // Kiểm tra response thành công
      if (loginRes.success && loginRes.data) {
        const { accessToken, refreshToken } = loginRes.data;
        
        // 1. Lưu token
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // 2. Lấy thông tin User (để biết Role và Tên)
        try {
            const profileRes = await AuthService.getProfile();
            if (profileRes.success) {
                const user = profileRes.data;
                localStorage.setItem("role", user.roleName || "USER"); // Lưu role
                localStorage.setItem("userName", user.fullName || user.username); // Lưu tên hiển thị
            }
        } catch (e) {
            console.error("Không lấy được profile", e);
        }

        // 3. Cập nhật giỏ hàng và thông báo
        await fetchCartCount();
        
        // Dispatch event để Header cập nhật lại Avatar/Tên ngay lập tức
        window.dispatchEvent(new Event("auth-change"));

        toast({ title: "Đăng nhập thành công", status: "success", duration: 2000 });
        
        // 4. Điều hướng dựa trên Role
        const role = localStorage.getItem("role");
        if (role === "ADMIN" || role === "ROLE_ADMIN") {
            navigate("/admin");
        } else {
            navigate("/");
        }
      } else {
        throw new Error(loginRes.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      toast({ 
          title: "Lỗi đăng nhập", 
          description: error.response?.data?.message || "Email hoặc mật khẩu không đúng", 
          status: "error", 
          position: 'top' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" position="relative" overflow="hidden">
      {/* Background Image with Overlay */}
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

      {/* Login Card */}
      <Box 
        zIndex="1" 
        w={{ base: "90%", md: "450px" }}
        bg={useColorModeValue("whiteAlpha.900", "blackAlpha.800")}
        p={8} 
        borderRadius="2xl" 
        boxShadow="2xl"
        border="1px solid"
        borderColor="whiteAlpha.200"
      >
        <Box textAlign="center" mb={6}>
            <Heading size="xl" mb={2} bgGradient="linear(to-r, blue.400, purple.600)" bgClip="text">
                Chào mừng trở lại
            </Heading>
            <Text color="gray.500">Đăng nhập để tiếp tục mua sắm</Text>
        </Box>

        <LoginForm onSubmit={handleLogin} isLoading={isLoading} isTransparent={true} />
      </Box>
    </Flex>
  );
};

export default LoginPage;