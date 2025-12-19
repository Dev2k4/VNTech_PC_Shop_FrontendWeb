// src/features/auth/pages/LoginPage.jsx
import React, { useState } from "react";
import { Flex, useToast, useColorModeValue, Box, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/auth.service";
import LoginForm from "../components/LoginForm";
import { useCart } from '../../../context/CartContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { fetchCartCount } = useCart();

  const bgImage = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"; 

  // --- HÀM MỚI: GIẢI MÃ TOKEN ĐỂ LẤY ROLE ---
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const handleLogin = async (formData) => {
    setIsLoading(true);
    try {
      const loginRes = await AuthService.login(formData);
      
      if (loginRes.success && loginRes.data) {
        // Backend thường trả về: { accessToken, refreshToken, role, ... }
        // Hoặc role nằm trong accessToken
        const { accessToken, refreshToken } = loginRes.data;
        
        // 1. Lưu Token
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // 2. XỬ LÝ LẤY ROLE (QUAN TRỌNG)
        let userRole = "USER"; // Mặc định
        
        // Cách 1: Lấy trực tiếp từ response nếu có
        if (loginRes.data.role || loginRes.data.roleName) {
            userRole = loginRes.data.role || loginRes.data.roleName;
        } 
        // Cách 2: Nếu không có, giải mã Token để lấy (Chuẩn JWT)
        else {
            const decoded = parseJwt(accessToken);
            if (decoded) {
                // Các key thường gặp trong JWT: "role", "roles", "scope", "authorities"
                userRole = decoded.role || decoded.roles || decoded.scope || decoded.authorities || "USER";
                
                // Nếu role là mảng (ví dụ ["ROLE_ADMIN"]), lấy phần tử đầu
                if (Array.isArray(userRole)) userRole = userRole[0];
            }
        }
        
        // Lưu Role chuẩn vào LocalStorage
        localStorage.setItem("role", userRole);

        // 3. Lấy thông tin User (Chỉ để lấy Tên & Avatar, không lấy Role từ đây nữa)
        try {
            const profileRes = await AuthService.getProfile();
            if (profileRes.success) {
                const user = profileRes.data;
                localStorage.setItem("userName", user.fullName || user.username);
                localStorage.setItem("userEmail", user.email);
            }
        } catch (e) {
            console.error("Lỗi lấy profile", e);
        }

        // 4. Update UI
        await fetchCartCount();
        window.dispatchEvent(new Event("auth-change"));
        
        toast({ title: "Đăng nhập thành công", status: "success", duration: 1500 });
        
        // 5. Điều hướng theo Role
        if (userRole === "ADMIN" || userRole === "ROLE_ADMIN") {
            navigate("/admin");
        } else {
            navigate("/");
        }

      } else {
        throw new Error(loginRes.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error(error);
      toast({ 
          title: "Lỗi đăng nhập", 
          description: error.response?.data?.message || "Kiểm tra lại email/mật khẩu", 
          status: "error", 
          position: 'top' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" position="relative" overflow="hidden">
      <Box position="absolute" top="0" left="0" w="100%" h="100%" bgImage={`url(${bgImage})`} bgSize="cover" bgPosition="center" zIndex="-2"/>
      <Box position="absolute" top="0" left="0" w="100%" h="100%" bg="rgba(0, 0, 0, 0.7)" backdropFilter="blur(8px)" zIndex="-1"/>

      <Box 
        zIndex="1" w={{ base: "90%", md: "450px" }}
        bg={useColorModeValue("whiteAlpha.900", "blackAlpha.800")}
        p={8} borderRadius="2xl" boxShadow="2xl" border="1px solid" borderColor="whiteAlpha.200"
      >
        <Box textAlign="center" mb={6}>
            <Heading size="xl" mb={2} bgGradient="linear(to-r, blue.400, purple.600)" bgClip="text">Chào mừng trở lại</Heading>
            <Text color="gray.500">Đăng nhập để tiếp tục</Text>
        </Box>
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} isTransparent={true} />
      </Box>
    </Flex>
  );
};

export default LoginPage;