import React, { useEffect, useState, useRef } from 'react';
import { Box, Container, Heading, Text, Button, Icon, VStack, useColorModeValue, Spinner, Divider, HStack, Badge, useToast } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon, InfoIcon } from '@chakra-ui/icons';
import { Link, useSearchParams } from 'react-router-dom';
import axiosClient from '../../../config/axiosClient';
import { useCart } from '../../../context/CartContext';

const PaymentResultPage = () => {
    const [searchParams] = useSearchParams();
    const { fetchCartCount } = useCart();
    const toast = useToast();
    const toastShown = useRef(false);
    
    // Các tham số từ VNPay hoặc Backend redirect
    const status = searchParams.get('status'); 
    const vnpResponseCode = searchParams.get('vnp_ResponseCode'); 
    const orderId = searchParams.get('orderId');
    const method = searchParams.get('method');
    const message = searchParams.get('message');

    const isSuccess = status === '00' || vnpResponseCode === '00';
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        fetchCartCount();

        // Hiển thị thông báo Toast một lần duy nhất khi load trang
        if (!toastShown.current) {
            if (isSuccess) {
                toast({
                    title: "Thanh toán thành công!",
                    description: "Cảm ơn bạn đã tin tưởng VNTech Shop.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top"
                });
            } else if (status || vnpResponseCode) {
                toast({
                    title: "Thanh toán thất bại",
                    description: message || "Đã có lỗi xảy ra trong quá trình xử lý.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top"
                });
            }
            toastShown.current = true;
        }

        const verifyPayment = async () => {
            if (vnpResponseCode && !status) {
                setVerifying(true);
                try {
                    await axiosClient.get(`/user/payment/vnpay-return?${searchParams.toString()}`);
                } catch (error) {
                    console.error("Lỗi xác thực thanh toán", error);
                } finally {
                    setVerifying(false);
                }
            }
        };
        
        verifyPayment();
    }, [searchParams, vnpResponseCode, status, fetchCartCount, isSuccess, message, toast]);

    const bg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.600", "gray.400");

    if (verifying) {
        return (
            <VStack minH="60vh" justify="center" spacing={4}>
                <Spinner size="xl" color="blue.500" />
                <Text>Đang xác thực giao dịch...</Text>
            </VStack>
        );
    }

    return (
        <Box minH="80vh" py={20} bg={useColorModeValue("gray.50", "black")}>
            <Container maxW="container.sm">
                <VStack 
                    bg={bg} p={10} borderRadius="2xl" boxShadow="2xl" spacing={6} 
                    textAlign="center" border="1px solid" borderColor={useColorModeValue("gray.100", "whiteAlpha.100")}
                >
                    <Icon 
                        as={isSuccess ? CheckCircleIcon : WarningIcon} 
                        w={20} h={20} 
                        color={isSuccess ? "green.400" : "red.400"} 
                    />
                    
                    <Heading size="xl">
                        {isSuccess ? "Giao dịch thành công!" : "Giao dịch thất bại"}
                    </Heading>
                    
                    <VStack spacing={2} w="full">
                        <Text color={textColor} fontSize="lg">
                            {isSuccess 
                                ? (method === 'COD' 
                                    ? "Đơn hàng của bạn đã được ghi nhận. Vui lòng chuẩn bị tiền mặt khi nhận hàng." 
                                    : "Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đang được xử lý.") 
                                : (message || "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ.")}
                        </Text>
                        
                        {orderId && (
                            <HStack justify="center" mt={2}>
                                <Text fontWeight="bold">Mã đơn hàng:</Text>
                                <Badge colorScheme="blue" fontSize="md">#{orderId}</Badge>
                            </HStack>
                        )}
                        
                        {(method || vnpResponseCode) && (
                            <HStack justify="center">
                                <Text fontWeight="bold">Phương thức:</Text>
                                <Text color="blue.500">
                                    {(method === 'COD') ? "Thanh toán khi nhận hàng" : "VNPay"}
                                </Text>
                            </HStack>
                        )}
                    </VStack>

                    <Divider />

                    <VStack w="full" spacing={3}>
                        <Button as={Link} to="/user/orders" size="lg" colorScheme="blue" w="full" borderRadius="xl">
                            Xem đơn hàng của tôi
                        </Button>
                        <Button as={Link} to="/" variant="outline" w="full" borderRadius="xl">
                            Tiếp tục mua sắm
                        </Button>
                    </VStack>

                    <HStack spacing={2} pt={4}>
                        <Icon as={InfoIcon} color="gray.400" />
                        <Text fontSize="xs" color="gray.400">
                            Nếu có thắc mắc, vui lòng liên hệ hotline: 1900 xxxx
                        </Text>
                    </HStack>
                </VStack>
            </Container>
        </Box>
    );
};

export default PaymentResultPage;
