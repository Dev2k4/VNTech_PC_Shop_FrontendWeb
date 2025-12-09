// src/components/layout/Footer.jsx
import React from 'react';
import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  VisuallyHidden,
  chakra,
  useColorModeValue,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FaTwitter, FaYoutube, FaInstagram, FaApple } from 'react-icons/fa';

// Component con hiển thị tiêu đề cột
const ListHeader = ({ children }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2} color={useColorModeValue('gray.700', 'white')}>
      {children}
    </Text>
  );
};

// Component con hiển thị nút mạng xã hội
const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function Footer() {
  const bg = useColorModeValue('gray.50', '#161617'); // Màu nền Apple Dark
  const color = useColorModeValue('gray.700', 'gray.400'); // Màu chữ
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  return (
    <Box
      bg={bg}
      color={color}
      borderTop="1px solid"
      borderColor={borderColor}
      mt={10}
    >
      <Container as={Stack} maxW={'container.xl'} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          
          {/* Cột 1: Brand */}
          <Stack spacing={6}>
            <Flex align="center" gap={2}>
               <Icon as={FaApple} w={6} h={6} color={useColorModeValue("black", "white")}/>
               <Text fontWeight="bold" fontSize="xl" color={useColorModeValue("black", "white")}>VNTech Store</Text>
            </Flex>
            <Text fontSize={'sm'}>
              Cung cấp các sản phẩm công nghệ chính hãng với chất lượng tốt nhất và dịch vụ hậu mãi tận tâm.
            </Text>
          </Stack>

          {/* Cột 2: Sản phẩm */}
          <Stack align={'flex-start'}>
            <ListHeader>Sản phẩm</ListHeader>
            <Link href={'/'} _hover={{ color: 'blue.500' }}>MacBook</Link>
            <Link href={'/'} _hover={{ color: 'blue.500' }}>iPhone</Link>
            <Link href={'/'} _hover={{ color: 'blue.500' }}>iPad</Link>
            <Link href={'/'} _hover={{ color: 'blue.500' }}>Phụ kiện</Link>
          </Stack>

          {/* Cột 3: Hỗ trợ */}
          <Stack align={'flex-start'}>
            <ListHeader>Hỗ trợ</ListHeader>
            <Link href={'/profile'} _hover={{ color: 'blue.500' }}>Tài khoản</Link>
            <Link href={'/user/orders'} _hover={{ color: 'blue.500' }}>Tra cứu đơn hàng</Link>
            <Link href={'#'} _hover={{ color: 'blue.500' }}>Chính sách bảo hành</Link>
            <Link href={'#'} _hover={{ color: 'blue.500' }}>Liên hệ</Link>
          </Stack>

          {/* Cột 4: Theo dõi */}
          <Stack align={'flex-start'}>
            <ListHeader>Theo dõi chúng tôi</ListHeader>
            <Stack direction={'row'} spacing={4}>
              <SocialButton label={'Twitter'} href={'#'}>
                <FaTwitter />
              </SocialButton>
              <SocialButton label={'YouTube'} href={'#'}>
                <FaYoutube />
              </SocialButton>
              <SocialButton label={'Instagram'} href={'#'}>
                <FaInstagram />
              </SocialButton>
            </Stack>
            <Text fontSize="xs" mt={4}>
                Hotline: 1900 1234
            </Text>
          </Stack>
        </SimpleGrid>
      </Container>

      {/* Dòng bản quyền dưới cùng */}
      <Box borderTopWidth={1} style={{ borderTopStyle: 'solid', borderColor: borderColor }}>
        <Container
          as={Stack}
          maxW={'container.xl'}
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ base: 'center', md: 'space-between' }}
          align={{ base: 'center', md: 'center' }}
        >
          <Text fontSize="sm">© 2024 VNTech Store. All rights reserved</Text>
          <Stack direction={'row'} spacing={6} fontSize="sm">
            <Link href={'#'} _hover={{ color: 'blue.500' }}>Quyền riêng tư</Link>
            <Link href={'#'} _hover={{ color: 'blue.500' }}>Điều khoản sử dụng</Link>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}