import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Flex,
  Link as ChakraLink,
  Icon,
  IconButton,
  Badge,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  useToast,
  HStack,
  MenuDivider,
  useColorMode,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom"; // Import Link từ react-router-dom
import {
  FaApple,
  FaSearch,
  FaShoppingBag,
  FaBars,
  FaUser,
  FaSignOutAlt,
  FaHistory,
  FaMoon,
  FaSun,
  FaChevronDown,
  FaCog,
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

  // Colors based on color mode
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
        const res = await ProductService.getCategories();
        if (res?.success) setCategories(res.data);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const checkUserLogin = () => {
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("role");
      const userName = localStorage.getItem("userName") || "Thành viên";

      if (token && userId) {
        setUser({ id: userId, role, name: userName });
      } else {
        setUser(null);
      }
    };
    checkUserLogin();
    window.addEventListener("storage", checkUserLogin);
    return () => window.removeEventListener("storage", checkUserLogin);
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
          {/* LEFT: Logo & Menu */}
          <Flex align="center" gap={{ base: 2, lg: 8 }}>
            <IconButton
              display={{ base: "flex", lg: "none" }}
              icon={<FaBars />}
              variant="ghost"
              color={iconColor}
              aria-label="Menu"
              size="sm"
            />

            <ChakraLink
              as={Link}
              to="/"
              display="flex"
              alignItems="center"
              _hover={{ transform: "scale(1.05)" }}
              transition="transform 0.2s"
            >
              <Icon as={FaApple} color={textColor} w={6} h={6} />
              <Text
                ml={2}
                fontSize="xl"
                fontWeight="bold"
                color={textColor}
                display={{ base: "none", sm: "block" }}
              >
                Store
              </Text>
            </ChakraLink>

            <Flex
              display={{ base: "none", lg: "flex" }}
              gap={6}
              align="center"
              ml={4}
            >
              <ChakraLink
                as={Link}
                to="/"
                fontSize="14px"
                fontWeight="500"
                color={textColor}
                _hover={{ color: hoverColor, textDecoration: "none" }}
                py={2}
              >
                Cửa hàng
              </ChakraLink>

              {categories.length > 0 && (
                <Menu>
                  <MenuButton
                    as={Button}
                    variant="ghost"
                    size="sm"
                    fontSize="14px"
                    fontWeight="500"
                    color={textColor}
                    rightIcon={<FaChevronDown size={10} />}
                    _hover={{ color: hoverColor, bg: dropdownItemHover }}
                    _active={{ bg: dropdownItemHover }}
                    px={3}
                    h="32px"
                  >
                    Danh mục
                  </MenuButton>
                  <MenuList
                    bg={dropdownBg}
                    borderColor={dropdownBorder}
                    minW="220px"
                    boxShadow="xl"
                    py={2}
                  >
                    {categories.map((cat) => (
                      <MenuItem
                        key={cat.id}
                        as={Link}
                        to={`/?categoryId=${cat.id}`}
                        bg="transparent"
                        _hover={{ bg: dropdownItemHover }}
                        color={textColor}
                        fontSize="14px"
                        py={2}
                      >
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
              <IconButton
                icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
                onClick={toggleColorMode}
                variant="ghost"
                color={iconColor}
                size="sm"
                aria-label="Toggle color mode"
                _hover={{ color: hoverColor, bg: dropdownItemHover }}
              />
            </Tooltip>

            <Tooltip label="Giỏ hàng">
              <Box position="relative">
                <IconButton
                  as={Link}
                  to="/cart"
                  icon={<FaShoppingBag />}
                  variant="ghost"
                  color={iconColor}
                  size="sm"
                  aria-label="Cart"
                  _hover={{ color: hoverColor, bg: dropdownItemHover }}
                />
                {cartCount > 0 && (
                  <Badge
                    position="absolute"
                    top="0"
                    right="0"
                    bg={badgeColor}
                    color="white"
                    fontSize="10px"
                    fontWeight="bold"
                    borderRadius="full"
                    minW="4"
                    h="4"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    transform="translate(25%, -25%)"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </Badge>
                )}
              </Box>
            </Tooltip>

            {user ? (
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  rounded="full"
                  p={1}
                  minW="auto"
                  _hover={{ bg: dropdownItemHover }}
                >
                  <HStack spacing={2}>
                    <Avatar
                      size="sm"
                      name={user.name}
                      bg="blue.500"
                      color="white"
                      fontSize="xs"
                    />
                    <Text
                      fontSize="sm"
                      color={textColor}
                      display={{ base: "none", md: "block" }}
                    >
                      {user.name}
                    </Text>
                  </HStack>
                </MenuButton>
                <MenuList
                  bg={dropdownBg}
                  borderColor={dropdownBorder}
                  boxShadow="2xl"
                  minW="200px"
                >
                  <Box px={4} py={3}>
                    <Text fontSize="sm" fontWeight="bold" color={textColor}>
                      Xin chào!
                    </Text>
                    <Text fontSize="xs" color={iconColor} mt={1}>
                      {user.name}
                    </Text>
                  </Box>

                  <MenuDivider borderColor={dropdownBorder} />

                  {user.role === "ADMIN" && (
                    <MenuItem
                      icon={<FaCog />}
                      _hover={{ bg: dropdownItemHover }}
                      color={textColor}
                      as={Link}
                      to="/admin"
                      fontSize="14px"
                      py={3}
                    >
                      Trang quản trị
                    </MenuItem>
                  )}

                  {/* --- ĐÂY LÀ CHỖ ĐÃ ĐƯỢC SỬA --- */}
                  <MenuItem
                    icon={<FaUser />}
                    _hover={{ bg: dropdownItemHover }}
                    color={textColor}
                    fontSize="14px"
                    py={3}
                    as={Link}
                    to="/profile" // <--- Link tới trang hồ sơ
                  >
                    Hồ sơ cá nhân
                  </MenuItem>

                  <MenuItem
                    icon={<FaHistory />}
                    _hover={{ bg: dropdownItemHover }}
                    color={textColor}
                    fontSize="14px"
                    py={3}
                    as={Link}
                    to="/user/orders" // <--- Link tới lịch sử đơn hàng
                  >
                    Lịch sử đơn hàng
                  </MenuItem>
                  {/* ----------------------------- */}

                  <MenuDivider borderColor={dropdownBorder} />

                  <MenuItem
                    icon={<FaSignOutAlt />}
                    _hover={{ bg: "red.50", color: "red.600" }}
                    color="red.500"
                    onClick={handleLogout}
                    fontSize="14px"
                    py={3}
                  >
                    Đăng xuất
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <HStack spacing={3}>
                <Button
                  as={Link}
                  to="/login"
                  size="sm"
                  variant="ghost"
                  color={textColor}
                  _hover={{ bg: dropdownItemHover }}
                  fontSize="14px"
                >
                  Đăng nhập
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  size="sm"
                  bg="blue.500"
                  color="white"
                  _hover={{ bg: "blue.600", transform: "translateY(-1px)" }}
                  _active={{ transform: "translateY(0)" }}
                  borderRadius="md"
                  fontSize="14px"
                  px={4}
                  transition="all 0.2s"
                >
                  Đăng ký
                </Button>
              </HStack>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
