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

  // Background đẹp hơn
  const bgImage = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"; 

  const parseJwt = (token) => {
    try { return JSON.parse(atob(token.split('.')[1])); } catch (e) { return null; }
  };

  const handleLogin = async (formData) => {
    setIsLoading(true);
    try {
      const loginRes = await AuthService.login(formData);
      if (loginRes.success || loginRes.data) {
        const { accessToken, refreshToken, role } = loginRes.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("role", role);

        // Get user info logic...
        const decoded = parseJwt(accessToken);
        if (decoded && decoded.sub) localStorage.setItem("userName", decoded.sub);
        
        try {
            const profileRes = await AuthService.getProfile();
            const userInfo = profileRes.data || profileRes;
            if (userInfo) {
                const displayName = userInfo.username || userInfo.fullName || userInfo.email;
                localStorage.setItem("userName", displayName);
            }
        } catch (e) {}

        window.dispatchEvent(new Event("auth-change"));
        await fetchCartCount();
        toast({ title: "Đăng nhập thành công", status: "success", duration: 2000, position: 'top' });

        if (role === "ADMIN" || role === "ROLE_ADMIN") navigate("/admin");
        else navigate("/");
      }
    } catch (error) {
      toast({ title: "Lỗi đăng nhập", description: "Email hoặc mật khẩu không đúng", status: "error", position: 'top' });
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
        backdropFilter="blur(20px)"
      >
        <Box textAlign="center" mb={6}>
            <Heading size="xl" mb={2} bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">VNTech ID</Heading>
            <Text color="gray.400">Đăng nhập để tiếp tục trải nghiệm</Text>
        </Box>
        
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      </Box>
    </Flex>
  );
};

export default LoginPage;