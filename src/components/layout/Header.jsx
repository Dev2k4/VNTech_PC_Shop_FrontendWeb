import React, { useEffect, useState } from "react";
import {
  Box, Container, Flex, Link as ChakraLink, Icon, IconButton, Badge, Button,
  Menu, MenuButton, MenuList, MenuItem, Avatar, Text, useToast, HStack,
  MenuDivider, useColorMode, useColorModeValue, Tooltip,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaApple, FaSearch, FaShoppingBag, FaBars, FaUser, FaSignOutAlt,
  FaHistory, FaMoon, FaSun, FaChevronDown, FaCog,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import ProductService from "../../services/product.service";
import AuthService from "../../services/auth.service";

const Header = () => {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // --- Theme Colors ---
  const bgColor = useColorModeValue(
    isScrolled ? "white" : "rgba(255, 255, 255, 0.95)",
    isScrolled ? "gray.900" : "rgba(22, 22, 23, 0.95)"
  );
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const iconColor = useColorModeValue("gray.600", "gray.300");
  const hoverColor = useColorModeValue("black", "white");
  const dropdownBg = useColorModeValue("white", "gray.800");
  const dropdownBorder = useColorModeValue("gray.200", "gray.600");
  const dropdownItemHover = useColorModeValue("gray.50", "gray.700");
  const badgeColor = useColorModeValue("red.500", "red.300");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await ProductService.getCategories(); // Đã check service: getCategories() đúng
        if (res?.success) setCategories(res.data);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // --- LOGIC AUTHENTICATION (ĐÃ SỬA) ---
  useEffect(() => {
    const checkUserLogin = () => {
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("role");
      const userName = localStorage.getItem("userName") || "Thành viên";

      // Logic cũ yêu cầu phải có userId. 
      // Logic mới: Nếu có Token là coi như đã login (để UI cập nhật ngay), userId có thể lấy sau hoặc dùng dummy.
      if (token) {
        setUser({ 
            id: userId || "user-temp-id", // Fallback ID để pass qua điều kiện check
            role, 
            name: userName 
        });
      } else {
        setUser(null);
      }
    };

    checkUserLogin();
    
    // Lắng nghe sự kiện tùy chỉnh "auth-change" (quan trọng nhất)
    window.addEventListener("auth-change", checkUserLogin);
    // Lắng nghe sự kiện storage cho các tab khác
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
    } catch (error) {
      console.log("Lỗi logout server", error);
    } finally {
      localStorage.clear();
      setUser(null);
      // Bắn sự kiện để các component khác (nếu có) biết đã logout
      window.dispatchEvent(new Event("auth-change"));
      
      toast({
        title: "Đăng xuất thành công",
        status: "info",
        duration: 2000,
        position: "top",
      });
      navigate("/login");
    }
  };

  return (
    <Box
      as="header"
      bg={bgColor}
      backdropFilter="blur(20px)"
      position="sticky"
      top="0"
      zIndex="1000"
      w="100%"
      borderBottom="1px solid"
      borderColor={borderColor}
      transition="all 0.3s ease"
      boxShadow={isScrolled ? "sm" : "none"}
    >
      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        <Flex h="64px" align="center" justify="space-between">
          
          {/* ... (Phần Logo và Menu giữ nguyên như code cũ của bạn) ... */}
          <Flex align="center" gap={{ base: 2, lg: 8 }}>
            <IconButton
              display={{ base: "flex", lg: "none" }}
              icon={<FaBars />}
              variant="ghost"
              color={iconColor}
              aria-label="Menu"
              size="sm"
            />
            <ChakraLink as={Link} to="/" display="flex" alignItems="center" _hover={{ transform: "scale(1.05)" }}>
              <Icon as={FaApple} color={textColor} w={6} h={6} />
              <Text ml={2} fontSize="xl" fontWeight="bold" color={textColor} display={{ base: "none", sm: "block" }}>
                Store
              </Text>
            </ChakraLink>
            <Flex display={{ base: "none", lg: "flex" }} gap={6} align="center" ml={4}>
              <ChakraLink as={Link} to="/" fontSize="14px" fontWeight="500" color={textColor} _hover={{ color: hoverColor, textDecoration: "none" }} py={2}>
                Cửa hàng
              </ChakraLink>
              {categories.length > 0 && (
                <Menu>
                  <MenuButton as={Button} variant="ghost" size="sm" fontSize="14px" fontWeight="500" color={textColor} rightIcon={<FaChevronDown size={10} />} _hover={{ color: hoverColor, bg: dropdownItemHover }} px={3} h="32px">
                    Danh mục
                  </MenuButton>
                  <MenuList bg={dropdownBg} borderColor={dropdownBorder} minW="220px" boxShadow="xl" py={2}>
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} as={Link} to={`/?categoryId=${cat.id}`} bg="transparent" _hover={{ bg: dropdownItemHover }} color={textColor} fontSize="14px" py={2}>
                        {cat.categoryName}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              )}
            </Flex>
          </Flex>

          {/* RIGHT: Actions */}
          <Flex gap={2} align="center">
            <Tooltip label={`Chế độ ${colorMode === "light" ? "tối" : "sáng"}`}>
              <IconButton icon={colorMode === "light" ? <FaMoon /> : <FaSun />} onClick={toggleColorMode} variant="ghost" color={iconColor} size="sm" />
            </Tooltip>

            <Tooltip label="Giỏ hàng">
              <Box position="relative">
                <IconButton as={Link} to="/cart" icon={<FaShoppingBag />} variant="ghost" color={iconColor} size="sm" />
                {cartCount > 0 && (
                  <Badge position="absolute" top="0" right="0" bg={badgeColor} color="white" fontSize="10px" borderRadius="full" minW="4" h="4" display="flex" alignItems="center" justifyContent="center" transform="translate(25%, -25%)">
                    {cartCount > 99 ? "99+" : cartCount}
                  </Badge>
                )}
              </Box>
            </Tooltip>

            {/* --- USER MENU (Logic hiển thị dựa trên state user) --- */}
            {user ? (
              <Menu>
                <MenuButton as={Button} variant="ghost" rounded="full" p={1} minW="auto" _hover={{ bg: dropdownItemHover }}>
                  <HStack spacing={2}>
                    <Avatar size="sm" name={user.name} bg="blue.500" color="white" fontSize="xs" />
                    <Text fontSize="sm" color={textColor} display={{ base: "none", md: "block" }}>{user.name}</Text>
                  </HStack>
                </MenuButton>
                <MenuList bg={dropdownBg} borderColor={dropdownBorder} boxShadow="2xl" minW="200px">
                  <Box px={4} py={3}>
                    <Text fontSize="sm" fontWeight="bold" color={textColor}>Xin chào!</Text>
                    <Text fontSize="xs" color={iconColor} mt={1}>{user.name}</Text>
                  </Box>

                  <MenuDivider borderColor={dropdownBorder} />

                  {/* --- LOGIC HIỂN THỊ MENU ADMIN --- */}
                  {(user.role === "ADMIN" || user.role === "ROLE_ADMIN") && (
                    <MenuItem
                      icon={<FaCog />}
                      _hover={{ bg: dropdownItemHover }}
                      color={textColor}
                      as={Link}
                      to="/admin" // Chuyển đến trang Dashboard Admin
                      fontSize="14px"
                      py={3}
                      fontWeight="bold"
                    >
                      Trang quản trị
                    </MenuItem>
                  )}
                  {/* ---------------------------------- */}

                  <MenuItem icon={<FaUser />} as={Link} to="/profile" fontSize="14px" py={3} _hover={{ bg: dropdownItemHover }}>
                    Hồ sơ cá nhân
                  </MenuItem>
                  
                  <MenuItem icon={<FaHistory />} as={Link} to="/user/orders" fontSize="14px" py={3} _hover={{ bg: dropdownItemHover }}>
                    Lịch sử đơn hàng
                  </MenuItem>

                  <MenuDivider borderColor={dropdownBorder} />

                  <MenuItem icon={<FaSignOutAlt />} color="red.500" onClick={handleLogout} fontSize="14px" py={3} _hover={{ bg: "red.50" }}>
                    Đăng xuất
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <HStack spacing={3}>
                <Button as={Link} to="/login" size="sm" variant="ghost" color={textColor}>Đăng nhập</Button>
                <Button as={Link} to="/register" size="sm" bg="blue.500" color="white">Đăng ký</Button>
              </HStack>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;