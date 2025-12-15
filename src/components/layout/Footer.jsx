// src/components/layout/Footer.jsx
import React from 'react';
import {
  Box, Container, Stack, SimpleGrid, Text, Link, VisuallyHidden, chakra,
  useColorModeValue, Flex, Icon, Heading, Input, Button, IconButton, Divider
} from '@chakra-ui/react';
import { FaFacebook, FaYoutube, FaTiktok, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { RiComputerLine } from 'react-icons/ri'; // Icon máy tính

const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={10} h={10}
      cursor={'pointer'}
      as={'a'} href={href}
      display={'inline-flex'} alignItems={'center'} justifyContent={'center'}
      transition={'all 0.3s ease'}
      _hover={{
        bg: 'blue.500',
        color: 'white',
        transform: 'translateY(-3px)'
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

const ListHeader = ({ children }) => {
  return (
    <Heading fontWeight={'700'} fontSize={'lg'} mb={4} color={useColorModeValue('blue.600', 'blue.300')}>
      {children}
    </Heading>
  );
};

export default function Footer() {
  const bg = useColorModeValue('gray.50', '#0a0a0a');
  const color = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  return (
    <Box bg={bg} color={color} borderTop="1px solid" borderColor={borderColor} pt={16}>
      <Container maxW={'container.xl'} py={4}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10} mb={10}>
          
          {/* Cột 1: Giới thiệu */}
          <Stack spacing={6}>
            <Flex align="center" gap={2}>
               <Icon as={RiComputerLine} w={8} h={8} color="blue.500"/>
               <Heading size="md" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
                 VNTech Store
               </Heading>
            </Flex>
            <Text fontSize={'sm'} lineHeight="tall">
              Hệ thống bán lẻ máy tính, linh kiện PC, Laptop Gaming hi-end hàng đầu Việt Nam. Cam kết chính hãng 100%, bảo hành tận nơi.
            </Text>
            <Stack direction={'row'} spacing={4}>
              <SocialButton label={'Facebook'} href={'#'}><FaFacebook /></SocialButton>
              <SocialButton label={'YouTube'} href={'#'}><FaYoutube /></SocialButton>
              <SocialButton label={'TikTok'} href={'#'}><FaTiktok /></SocialButton>
            </Stack>
          </Stack>

          {/* Cột 2: Sản phẩm */}
          <Stack align={'flex-start'} spacing={3}>
            <ListHeader>Sản phẩm & Dịch vụ</ListHeader>
            <Link href={'#'} _hover={{ color: 'blue.400', pl: 2 }} transition="all 0.2s">Laptop Gaming</Link>
            <Link href={'#'} _hover={{ color: 'blue.400', pl: 2 }} transition="all 0.2s">Build PC Đồ họa</Link>
            <Link href={'#'} _hover={{ color: 'blue.400', pl: 2 }} transition="all 0.2s">Linh kiện máy tính</Link>
            <Link href={'#'} _hover={{ color: 'blue.400', pl: 2 }} transition="all 0.2s">Màn hình & Gear</Link>
            <Link href={'#'} _hover={{ color: 'blue.400', pl: 2 }} transition="all 0.2s">Dịch vụ vệ sinh PC</Link>
          </Stack>

          {/* Cột 3: Hỗ trợ */}
          <Stack align={'flex-start'} spacing={3}>
            <ListHeader>Hỗ trợ khách hàng</ListHeader>
            <Link href={'#'} _hover={{ color: 'blue.400', pl: 2 }} transition="all 0.2s">Tra cứu bảo hành</Link>
            <Link href={'#'} _hover={{ color: 'blue.400', pl: 2 }} transition="all 0.2s">Chính sách đổi trả</Link>
            <Link href={'#'} _hover={{ color: 'blue.400', pl: 2 }} transition="all 0.2s">Hướng dẫn thanh toán</Link>
            <Link href={'#'} _hover={{ color: 'blue.400', pl: 2 }} transition="all 0.2s">Mua hàng trả góp</Link>
          </Stack>

          {/* Cột 4: Liên hệ */}
          <Stack align={'flex-start'} spacing={4}>
            <ListHeader>Liên hệ</ListHeader>
            <Flex align="center" gap={3}>
                <Icon as={FaMapMarkerAlt} color="blue.500" />
                <Text fontSize="sm">123 Trần Duy Hưng, Hà Nội</Text>
            </Flex>
            <Flex align="center" gap={3}>
                <Icon as={FaPhoneAlt} color="blue.500" />
                <Text fontSize="sm" fontWeight="bold">1900 6868 (Hotline)</Text>
            </Flex>
            <Flex align="center" gap={3}>
                <Icon as={FaEnvelope} color="blue.500" />
                <Text fontSize="sm">cskh@vntech.vn</Text>
            </Flex>
            
            <Box w="full" pt={4}>
                <Text fontSize="xs" mb={2} fontWeight="bold">Đăng ký nhận tin khuyến mãi:</Text>
                <Flex>
                    <Input placeholder="Email của bạn..." size="sm" roundedRight="0" />
                    <Button size="sm" colorScheme="blue" roundedLeft="0">Gửi</Button>
                </Flex>
            </Box>
          </Stack>
        </SimpleGrid>
      </Container>

      <Box borderTopWidth={1} borderColor={borderColor} bg={useColorModeValue('gray.100', 'black')}>
        <Container maxW={'container.xl'} py={6}>
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
                <Text fontSize="sm">© 2024 VNTech Store. All rights reserved.</Text>
                <Stack direction={'row'} spacing={6} fontSize="sm" mt={{base: 2, md: 0}}>
                    <Link href={'#'}>Điều khoản</Link>
                    <Link href={'#'}>Bảo mật</Link>
                    <Link href={'#'}>Sitemap</Link>
                </Stack>
            </Flex>
        </Container>
      </Box>
    </Box>
  );
}