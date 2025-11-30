import React from 'react';
import {
    Box, Stepper, Step, StepIndicator, StepStatus, StepIcon, StepTitle, StepSeparator, useColorModeValue
} from '@chakra-ui/react';

const steps = [
    { title: 'Đặt hàng' },
    { title: 'Đã xác nhận' },
    { title: 'Đang giao' },
    { title: 'Đã giao' },
];

const OrderTracker = ({ status }) => {
    const bg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    const getActiveStep = (s) => {
        if (s === 'CANCELLED') return -1;
        if (s === 'PENDING') return 0;
        if (s === 'CONFIRMED' || s === 'PROCESSING') return 1;
        if (s === 'SHIPPING') return 2;
        if (s === 'DELIVERED') return 3;
        return 0;
    };

    if (status === 'CANCELLED') return null;

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