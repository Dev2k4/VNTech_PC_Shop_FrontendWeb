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
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { FaApple, FaSearch, FaShoppingBag, FaBars, FaUser, FaSignOutAlt, FaHistory } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import ProductService from "../../services/product.service";
import AuthService from "../../services/auth.service";

const Header = () => {
  const { cartCount, fetchCartCount } = useCart(); // Lấy hàm fetchCartCount để reset khi logout
  const navigate = useNavigate();
  const toast = useToast();

  // State lưu danh mục và User
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);

  // 1. Lấy danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await ProductService.getAllCategories();
        if (res && res.success) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // 2. Kiểm tra trạng thái đăng nhập (Lấy từ localStorage)
  // Trong thực tế nên dùng AuthContext, nhưng ở đây ta check trực tiếp cho nhanh
  useEffect(() => {
    const checkUserLogin = () => {
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("role");
      
      // Giả lập lấy tên user từ localStorage (hoặc gọi API profile nếu cần chi tiết)
      // Tạm thời ta hiển thị mặc định hoặc lưu username lúc login
      if (token && userId) {
        setUser({
          id: userId,
          role: role,
          name: "Thành viên", // Bạn có thể lưu username vào localStorage lúc login để hiển thị ở đây
        });
      } else {
        setUser(null);
      }
    };
    
    checkUserLogin();
    
    // Lắng nghe sự kiện storage để update header khi login/logout ở tab khác hoặc component khác
    window.addEventListener('storage', checkUserLogin);
    return () => window.removeEventListener('storage', checkUserLogin);
  }, []);

  // 3. Hàm xử lý Logout
  const handleLogout = async () => {
    try {
        const refreshToken = localStorage.getItem("refreshToken");
        if(refreshToken) {
            await AuthService.logout(refreshToken);
        }
    } catch (error) {
        console.log("Lỗi logout server", error);
    } finally {
        // Xóa local storage
        localStorage.clear();
        setUser(null);
        
        // Reset giỏ hàng về 0 (nếu context có hỗ trợ)
        // fetchCartCount(); // Nếu hàm này check token, nó sẽ tự về 0

        toast({
            title: "Đăng xuất thành công",
            status: "info",
            duration: 2000,
        });
        navigate("/login");
    }
  };

  return (
    <Box
      as="header"
      bg="rgba(22, 22, 23, 0.8)"
      backdropFilter="blur(20px)"
      position="sticky"
      top="0"
      zIndex="1000"
      w="100%"
      borderBottom="1px solid rgba(255,255,255,0.1)"
    >
      <Container maxW="container.xl" h="60px">
        <Flex h="100%" align="center" justify="space-between">
          
          {/* Mobile Menu Icon */}
          <IconButton
            display={{ base: "flex", lg: "none" }}
            icon={<FaBars />}
            variant="ghost"
            color="gray.300"
            aria-label="Menu"
          />

          {/* Logo */}
          <ChakraLink as={Link} to="/" _hover={{ opacity: 0.8 }}>
            <Icon as={FaApple} color="white" w={5} h={5} mb={1} />
          </ChakraLink>

          {/* Categories Menu (Dynamic) */}
          <Flex
            display={{ base: "none", lg: "flex" }}
            gap={6}
            align="center"
            flex={1}
            justify="center"
          >
            {/* Link mặc định Store */}
            <ChakraLink
                as={Link}
                to="/"
                fontSize="12px"
                fontWeight="400"
                color="#e8e8ed"
                _hover={{ color: "white", textDecoration: "none" }}
            >
                Cửa hàng
            </ChakraLink>

            {/* Render danh mục từ API */}
            {categories.map((cat) => (
              <ChakraLink
                key={cat.id}
                as={Link}
                // Truyền query param để HomePage lọc
                to={`/?categoryId=${cat.id}`} 
                fontSize="12px"
                fontWeight="400"
                color="#e8e8ed"
                _hover={{ color: "white", textDecoration: "none" }}
                transition="color 0.2s"
                letterSpacing="0.5px"
              >
                {cat.categoryName}
              </ChakraLink>
            ))}
          </Flex>

          {/* Right Actions: Search, Cart, User */}
          <Flex gap={5} align="center">
            <Icon
              as={FaSearch}
              color="gray.300"
              w={4}
              h={4}
              cursor="pointer"
              _hover={{ color: "white" }}
            />

            {/* Cart Icon */}
            <Box position="relative" cursor="pointer">
              <ChakraLink as={Link} to="/cart">
                <Icon
                  as={FaShoppingBag}
                  color="gray.300"
                  w={4}
                  h={4}
                  _hover={{ color: "white" }}
                />
                {cartCount > 0 && (
                  <Badge
                    position="absolute"
                    top="-5px"
                    right="-8px"
                    bg="apple.blue"
                    color="white"
                    fontSize="9px"
                    borderRadius="full"
                    w="14px"
                    h="14px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {cartCount}
                  </Badge>
                )}
              </ChakraLink>
            </Box>

            {/* User Login/Logout Section */}
            <Box>
                {user ? (
                    <Menu>
                        <MenuButton 
                            as={Button} 
                            rounded={'full'} 
                            variant={'link'} 
                            cursor={'pointer'} 
                            minW={0}
                        >
                            <Avatar size={'xs'} src={'https://bit.ly/broken-link'} bg="gray.600" />
                        </MenuButton>
                        <MenuList bg="apple.card" borderColor="whiteAlpha.200">
                             <Box px={3} py={2}>
                                <Text fontSize="sm" fontWeight="bold" color="white">Xin chào,</Text>
                                <Text fontSize="xs" color="gray.400">{user.name}</Text>
                             </Box>
                            <MenuDivider borderColor="whiteAlpha.200"/>
                            
                            {user.role === 'ADMIN' && (
                                <MenuItem bg="transparent" _hover={{ bg: "whiteAlpha.100" }} color="white" as={Link} to="/admin">
                                    Trang quản trị
                                </MenuItem>
                            )}
                            
                            <MenuItem bg="transparent" _hover={{ bg: "whiteAlpha.100" }} color="white" icon={<FaUser />}>
                                Hồ sơ cá nhân
                            </MenuItem>
                            <MenuItem bg="transparent" _hover={{ bg: "whiteAlpha.100" }} color="white" icon={<FaHistory />}>
                                Lịch sử đơn hàng
                            </MenuItem>
                            <MenuDivider borderColor="whiteAlpha.200"/>
                            <MenuItem 
                                bg="transparent" 
                                _hover={{ bg: "whiteAlpha.100" }} 
                                color="red.300" 
                                icon={<FaSignOutAlt />}
                                onClick={handleLogout}
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
                            size="xs" 
                            variant="ghost" 
                            color="white" 
                            _hover={{ bg: 'whiteAlpha.200' }}
                        >
                            Đăng nhập
                        </Button>
                        <Button 
                            as={Link} 
                            to="/register" 
                            size="xs" 
                            bg="apple.blue" 
                            color="white" 
                            _hover={{ bg: 'blue.600' }}
                            borderRadius="full"
                        >
                            Đăng ký
                        </Button>
                    </HStack>
                )}
            </Box>

          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;