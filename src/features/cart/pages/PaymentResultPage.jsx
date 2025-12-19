import React, { useEffect } from 'react';
import { Box, Container, Heading, Text, Button, Icon, VStack, useColorModeValue } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { Link, useSearchParams } from 'react-router-dom';
import axiosClient from '../../../config/axiosClient';

const PaymentResultPage = () => {
    const [searchParams] = useSearchParams();
    // VNPay trả về vnp_ResponseCode = 00 là thành công
    const responseCode = searchParams.get('vnp_ResponseCode');
    const isSuccess = responseCode === '00';
    
    // Gọi API Backend để xác nhận giao dịch (Optional nhưng nên có)
    useEffect(() => {
        const verifyPayment = async () => {
            try {
                // Backend sẽ tự động lấy params từ URL này để update trạng thái đơn hàng
                await axiosClient.get(`/user/payment/vnpay-return?${searchParams.toString()}`);
            } catch (error) {
                console.error("Lỗi xác thực thanh toán", error);
            }
        };
        
        if (searchParams.toString()) {
            verifyPayment();
        }
    }, [searchParams]);

    const bg = useColorModeValue("white", "gray.800");

    return (
        <Box minH="80vh" py={20} bg={useColorModeValue("gray.50", "black")}>
            <Container maxW="container.sm">
                <VStack 
                    bg={bg} p={10} borderRadius="2xl" boxShadow="xl" spacing={6} 
                    textAlign="center"
                >
                    <Icon 
                        as={isSuccess ? CheckCircleIcon : WarningIcon} 
                        w={20} h={20} 
                        color={isSuccess ? "green.400" : "red.400"} 
                    />
                    
                    <Heading size="xl">
                        {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
                    </Heading>
                    
                    <Text color="gray.500" fontSize="lg">
                        {isSuccess 
                            ? "Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý." 
                            : "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại."}
                    </Text>

                    <Button as={Link} to="/user/orders" size="lg" colorScheme="blue" w="full">
                        Xem đơn hàng của tôi
                    </Button>
                    <Button as={Link} to="/" variant="ghost" w="full">
                        Về trang chủ
                    </Button>
                </VStack>
            </Container>
        </Box>
    );
};

export default PaymentResultPage;