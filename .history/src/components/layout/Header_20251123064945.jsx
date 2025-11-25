import React from "react";
import {
  Box,
  Container,
  Flex,
  Link as ChakraLink,
  Icon,
  IconButton,
  Badge,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { FaApple, FaSearch, FaShoppingBag, FaBars } from "react-icons/fa";
import { useCart } from "../../context/CartContext";

const Header = () => {
  const MENU_ITEMS = [
    { label: "Cửa Hàng", path: "/" },
    { label: "Mac", path: "/mac" },
    { label: "iPad", path: "/ipad" },
    { label: "iPhone", path: "/iphone" },
    { label: "Watch", path: "/watch" },
    { label: "AirPods", path: "/airpods" },
    { label: "TV & Nhà", path: "/tv-home" },
    { label: "Giải Trí", path: "/entertainment" },
    { label: "Phụ Kiện", path: "/accessories" },
    { label: "Hỗ Trợ", path: "/support" },
  ];

  const cartCount = 2;

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
          <IconButton
            display={{ base: "flex", lg: "none" }}
            icon={<FaBars />}
            variant="ghost"
            color="gray.300"
            aria-label="Menu"
          />
          <ChakraLink as={Link} to="/" _hover={{ opacity: 0.8 }}>
            <Icon as={FaApple} color="white" w={5} h={5} mb={1} />
          </ChakraLink>
          <Flex
            display={{ base: "none", lg: "flex" }}
            gap={8}
            align="center"
            flex={1}
            justify="center"
          >
            {MENU_ITEMS.map((item) => (
              <ChakraLink
                key={item.label}
                as={Link}
                to={item.path}
                fontSize="12px"
                fontWeight="400"
                color="#e8e8ed"
                _hover={{ color: "white", textDecoration: "none" }}
                transition="color 0.2s"
                letterSpacing="0.5px"
              >
                {item.label}
              </ChakraLink>
            ))}
          </Flex>
          <Flex gap={6} align="center">
            <Icon
              as={FaSearch}
              color="gray.300"
              w={4}
              h={4}
              cursor="pointer"
              _hover={{ color: "white" }}
            />
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
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
