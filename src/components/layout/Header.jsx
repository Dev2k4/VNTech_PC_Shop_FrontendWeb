// src/components/layout/Header.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Container, Flex, Link as ChakraLink, Icon, IconButton, Badge, Button,
  Menu, MenuButton, MenuList, MenuItem, Avatar, Text, useToast, HStack,
  MenuDivider, useColorMode, useColorModeValue, Input, InputGroup, InputRightElement
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaMicrochip, FaSearch, FaShoppingCart, FaBars, FaUser, FaSignOutAlt,
  FaHistory, FaMoon, FaSun, FaCog, FaTools
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import AuthService from "../../services/auth.service";

const Header = () => {
  const { cartCount } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
const handleSearch = () => {
    if (searchTerm.trim()) {
        // Chuyển hướng sang trang /products kèm tham số search
        // encodeURIComponent để xử lý các ký tự đặc biệt (dấu cách, tiếng việt)
        navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };
  // --- TECH THEME COLORS ---
  const bgHeader = useColorModeValue(
    isScrolled ? "white" : "rgba(255, 255, 255, 0.9)",
    isScrolled ? "rgba(5, 5, 5, 0.95)" : "rgba(5, 5, 5, 0.8)"
  );
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const textColor = useColorModeValue("gray.800", "white");
  const iconColor = useColorModeValue("gray.600", "gray.400");
  const logoGradient = "linear(to-r, #00C6FF, #0072FF)"; 

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- LOGIC AUTH ĐÃ ĐƯỢC SỬA ---
  useEffect(() => {
    const checkUserLogin = () => {
      const token = localStorage.getItem("accessToken");
      const role = localStorage.getItem("role");
      
      // Lấy cả Tên và Email từ LocalStorage
      const storedName = localStorage.getItem("userName");
      const storedEmail = localStorage.getItem("userEmail"); // Cần đảm bảo Login đã lưu cái này

      // Logic chọn tên hiển thị:
      // 1. Nếu có Tên và không phải "undefined/null" -> Dùng Tên
      // 2. Nếu không -> Dùng Email
      // 3. Nếu không nốt -> Dùng "Member"
      let displayName = "Member";

      if (storedName && storedName !== "undefined" && storedName !== "null" && storedName.trim() !== "") {
          displayName = storedName;
      } else if (storedEmail && storedEmail !== "undefined" && storedEmail !== "null") {
          // Nếu dùng email, cắt lấy phần trước @ cho gọn (Option)
          // displayName = storedEmail.split('@')[0]; 
          displayName = storedEmail;
      }

      if (token) {
          setUser({ role, name: displayName });
      } else {
          setUser(null);
      }
    };

    checkUserLogin();
    window.addEventListener("auth-change", checkUserLogin);
    window.addEventListener("storage", checkUserLogin);
    return () => {
      window.removeEventListener("auth-change", checkUserLogin);
      window.removeEventListener("storage", checkUserLogin);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) await AuthService.logout(refreshToken);
    } catch (e) {} 
    localStorage.clear();
    setUser(null);
    // Dispatch event để update lại UI ngay lập tức
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login");
  };

  return (
    <Box
      as="header"
      bg={bgHeader}
      backdropFilter="blur(16px)"
      position="sticky"
      top="0"
      zIndex="1000"
      w="100%"
      borderBottom="1px solid"
      borderColor={borderColor}
      transition="all 0.3s ease"
      boxShadow={isScrolled ? "0 4px 30px rgba(0, 0, 0, 0.1)" : "none"}
    >
      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        <Flex h="70px" align="center" justify="space-between">
          
          {/* 1. LOGO & MOBILE MENU */}
          <Flex align="center" gap={4}>
            <IconButton
              display={{ base: "flex", lg: "none" }}
              icon={<FaBars />}
              variant="ghost"
              color={iconColor}
              aria-label="Menu"
            />
            
            <ChakraLink as={Link} to="/" _hover={{ textDecoration: 'none' }} group>
              <HStack spacing={2}>
                <Icon as={FaMicrochip} w={8} h={8} color="blue.500" />
                <Box lineHeight="1">
                    <Text fontSize="2xl" fontWeight="900" fontFamily="heading" bgGradient={logoGradient} bgClip="text" letterSpacing="tight">
                        VNTech
                    </Text>
                    <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="widest" ml={1}>
                        STORE
                    </Text>
                </Box>
              </HStack>
            </ChakraLink>
          </Flex>

          {/* 2. SEARCH BAR */}
          <Box display={{ base: "none", md: "block" }} flex="1" maxW="500px" mx={8}>
             <InputGroup size="md">
    <Input 
        placeholder="Tìm linh kiện, laptop, gear..." 
        bg={useColorModeValue("gray.100", "whiteAlpha.100")}
        border="none"
        color={textColor}
        focusBorderColor="blue.500"
        borderRadius="full"
        _placeholder={{ color: "gray.500" }}
        
        // --- Bổ sung logic Search ---
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
        }}
        // ----------------------------
    />
    <InputRightElement>
        <IconButton 
            icon={<FaSearch />} 
            size="sm" 
            variant="ghost" 
            color="blue.500" 
            borderRadius="full" 
            aria-label="Search"
            onClick={handleSearch} // Bắt sự kiện click
        />
    </InputRightElement>
  </InputGroup>
          </Box>

          {/* 3. RIGHT ACTIONS */}
          <HStack spacing={3}>
            <IconButton icon={colorMode === "light" ? <FaMoon /> : <FaSun />} onClick={toggleColorMode} variant="ghost" color={iconColor} isRound />

            <Box position="relative">
              <IconButton as={Link} to="/cart" icon={<FaShoppingCart />} variant="ghost" color={iconColor} isRound aria-label="Cart" />
              {cartCount > 0 && (
                <Badge 
                    position="absolute" top="-2px" right="-2px" 
                    bgGradient="linear(to-r, pink.500, red.500)" color="white" 
                    fontSize="xs" borderRadius="full" w="18px" h="18px" 
                    display="flex" alignItems="center" justifyContent="center"
                    boxShadow="0 0 10px rgba(236, 72, 153, 0.6)"
                >
                  {cartCount}
                </Badge>
              )}
            </Box>

            {user ? (
              <Menu>
                <MenuButton as={Button} variant="ghost" rounded="full" p={1} minW="auto">
                  <HStack spacing={2}>
                    <Avatar 
                        size="sm" 
                        name={user.name} // Avatar sẽ tự lấy chữ cái đầu của Email nếu Name là Email
                        src={`https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`}
                        border="2px solid" borderColor="blue.500"
                    />
                    <Text fontSize="sm" fontWeight="bold" display={{ base: "none", lg: "block" }}>
                        {user.name}
                    </Text>
                  </HStack>
                </MenuButton>
                <MenuList bg={useColorModeValue("white", "#1a1a1a")} borderColor={borderColor} boxShadow="xl">
                  <Box px={4} py={2}>
                    <Text fontSize="xs" color="gray.500">Vai trò</Text>
                    <Badge colorScheme="blue" mt={1}>{user.role}</Badge>
                  </Box>
                  <MenuDivider />
                  {(user.role === "ADMIN" || user.role === "ROLE_ADMIN") && (
                    <MenuItem icon={<FaCog />} as={Link} to="/admin">Trang quản trị</MenuItem>
                  )}
                  <MenuItem icon={<FaUser />} as={Link} to="/profile">Hồ sơ cá nhân</MenuItem>
                  <MenuItem icon={<FaHistory />} as={Link} to="/user/orders">Đơn mua</MenuItem>
                  <MenuDivider />
                  <MenuItem icon={<FaSignOutAlt />} color="red.400" onClick={handleLogout}>Đăng xuất</MenuItem>
                </MenuList>
              </Menu>
            ) : (
                <Button as={Link} to="/login" size="sm" variant="brand" leftIcon={<FaUser />} borderRadius="full" px={6}>
                    Đăng nhập
                </Button>
            )}
          </HStack>
          <Button 
    as={Link} to="/build-pc" 
    leftIcon={<FaTools />} 
    variant="ghost" 
    color={iconColor}
    display={{ base: "none", md: "flex" }}
>
    Xây cấu hình
</Button>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;