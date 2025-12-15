import React from 'react';
import { Box, Heading, Flex, Image, Text, useColorModeValue, Divider } from '@chakra-ui/react';
import { formatCurrency } from '../../../utils/format';

const OrderItemList = ({ items }) => {
    const textColor = useColorModeValue("gray.800", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");

    return (
        <Box>
            {items.map((item, index) => (
                <Box key={item.id}>
                    <Flex py={4} align="center">
                        <Box bg="white" p={2} borderRadius="lg" mr={4}>
                            <Image 
                                src={item.product.mainImage} 
                                fallbackSrc="https://via.placeholder.com/60"
                                boxSize="60px" objectFit="contain" 
                            />
                        </Box>
                        <Box flex="1">
                            <Text fontWeight="bold" color={textColor} noOfLines={2}>{item.product.productName}</Text>
                            <Text fontSize="sm" color="gray.500">x{item.quantity}</Text>
                        </Box>
                        <Text fontWeight="bold" color="blue.400">{formatCurrency(item.totalPrice)}</Text>
                    </Flex>
                    {index < items.length - 1 && <Divider borderColor={borderColor} />}
                </Box>
            ))}
        </Box>
    );
};

export default OrderItemList;