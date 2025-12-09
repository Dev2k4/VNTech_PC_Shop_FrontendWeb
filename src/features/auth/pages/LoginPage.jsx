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
  const bg = useColorModeValue("gray.50", "gray.900");

  // Hàm giải mã JWT token (decode base64)
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
      // 1. Gọi API Login
      const loginRes = await AuthService.login(formData);
      
      if (loginRes.success || loginRes.data) {
        const { accessToken, refreshToken, role } = loginRes.data;

        // 2. Lưu token vào localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("role", role);

        // --- BƯỚC QUAN TRỌNG: LẤY THÔNG TIN USER ---
        
        // Cách 1: Giải mã Token để lấy Email/User ngay lập tức (Dự phòng nhanh nhất)
        const decoded = parseJwt(accessToken);
        if (decoded && decoded.sub) {
             localStorage.setItem("userName", decoded.sub); // 'sub' thường là email
             // Lưu ID tạm để Header nhận diện được User
             localStorage.setItem("userId", "user-id-placeholder"); 
        }

        // Cách 2: Gọi API Profile theo Swagger (GET /user/profile) để lấy tên thật
        try {
            const profileRes = await AuthService.getProfile();
            // Swagger response: { success: true, data: { id, fullName, email... } }
            const userInfo = profileRes.data || profileRes; 
            
            if (userInfo) {
                localStorage.setItem("userId", userInfo.id);
                // Ưu tiên hiển thị: Username -> FullName -> Email
                const displayName = userInfo.username || userInfo.fullName || userInfo.email;
                localStorage.setItem("userName", displayName);
            }
        } catch (profileErr) {
            console.error("Lỗi lấy profile, sẽ sử dụng thông tin từ token:", profileErr);
        }

        // 3. Bắn sự kiện "auth-change" để Header cập nhật ngay lập tức
        window.dispatchEvent(new Event("auth-change"));
        
        // 4. Cập nhật giỏ hàng
        await fetchCartCount();

        toast({ title: "Đăng nhập thành công", status: "success", duration: 2000, isClosable: true });

        // 5. Chuyển hướng
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