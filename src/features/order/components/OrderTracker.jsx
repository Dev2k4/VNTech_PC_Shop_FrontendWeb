import React from 'react';
import {
    Box, Stepper, Step, StepIndicator, StepStatus, StepIcon, StepTitle, 
    StepSeparator, useColorModeValue, Flex, Icon, Heading, Text
} from '@chakra-ui/react';
import { FaTimesCircle } from 'react-icons/fa'; // Import thêm icon dấu X

const steps = [
    { title: 'Đặt hàng' },
    { title: 'Đã xác nhận' },
    { title: 'Đang giao' },
    { title: 'Đã giao' },
];

const OrderTracker = ({ status }) => {
    const bg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    const cancelBg = useColorModeValue("rgba(250, 80, 80, 0.9)", "rgba(250, 80, 80, 0.9)");
    const cancelBorder = useColorModeValue( "red", "white");

    const getActiveStep = (s) => {
        if (s === 'PENDING') return 0;
        if (s === 'CONFIRMED' || s === 'PROCESSING') return 1;
        if (s === 'SHIPPING') return 2;
        if (s === 'DELIVERED') return 3;
        return 0;
    };

    if (status === 'CANCELLED') {
        return (
            <Box 
                bg={cancelBg} 
                p={6} 
                borderRadius="lg" 
                border="1px solid" 
                borderColor={cancelBorder} 
                mb={8}
            >
                <Flex align="center" gap={4}>
                    <Icon as={FaTimesCircle} w={10} h={10} color="white" />
                    <Box>
                        <Heading size="md" color="white" mb={1}>
                            Đơn hàng đã bị hủy
                        </Heading>
                        <Text fontSize="sm" color="white.600">
                            Đơn hàng này đã dừng xử lý. Bạn có thể đặt lại đơn hàng mới nếu muốn.
                        </Text>
                    </Box>
                </Flex>
            </Box>
        );
    }

    // --- Giữ nguyên logic cũ cho các trạng thái khác ---
    return (
        <Box bg={bg} p={8} borderRadius="lg" shadow="sm" border="1px" borderColor={borderColor} mb={8}>
            <Stepper index={getActiveStep(status)} colorScheme="blue">
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepIndicator>
                            <StepStatus
                                complete={<StepIcon />}
                                incomplete={<Box w="10px" h="10px" bg="gray.200" borderRadius="full" />}
                                active={<Box w="10px" h="10px" bg="blue.500" borderRadius="full" />}
                            />
                        </StepIndicator>
                        <Box flexShrink='0'>
                            <StepTitle>{step.title}</StepTitle>
                        </Box>
                        <StepSeparator />
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
};

export default OrderTracker;