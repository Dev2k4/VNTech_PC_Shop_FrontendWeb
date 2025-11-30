import React from 'react';
import { Box, Heading, Text, VStack, useColorModeValue } from '@chakra-ui/react';

const OrderShippingAddress = ({ address }) => {
    const bg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");

    return (
        <Box bg={bg} p={6} borderRadius="lg" shadow="sm" border="1px" borderColor={borderColor}>
            <Heading size="md" mb={4} color={textColor}>Thông tin nhận hàng</Heading>
            <VStack align="start" spacing={1}>
                <Text fontWeight="bold">{address?.recipientName}</Text>
                <Text>{address?.phoneNumber}</Text>
                <Text color="gray.500">
                    {address?.addressDetail}, {address?.ward}, {address?.district}, {address?.province}
                </Text>
            </VStack>
        </Box>
    );
};

export default OrderShippingAddress;