import React from 'react';
import { Box, Text, Button, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const OrderEmpty = () => {
    const bg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    return (
        <Box textAlign="center" py={10} bg={bg} borderRadius="lg" border="1px" borderColor={borderColor}>
            <Text mb={4}>Bạn chưa có đơn hàng nào.</Text>
            <Button as={Link} to="/" colorScheme="blue">Mua sắm ngay</Button>
        </Box>
    );
};

export default OrderEmpty;