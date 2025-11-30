import React from 'react';
import {
    Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Flex, Image, Text, useColorModeValue
} from '@chakra-ui/react';
import { formatCurrency } from '../../../utils/format';

const OrderItemList = ({ items }) => {
    const bg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");

    return (
        <Box bg={bg} p={6} borderRadius="lg" shadow="sm" border="1px" borderColor={borderColor}>
            <Heading size="md" mb={4} color={textColor}>Sản phẩm</Heading>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Sản phẩm</Th>
                        <Th isNumeric>Giá</Th>
                        <Th isNumeric>SL</Th>
                        <Th isNumeric>Tạm tính</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {items.map((item) => (
                        <Tr key={item.id}>
                            <Td>
                                <Flex align="center">
                                    <Image 
                                        src={item.product.mainImage} 
                                        fallbackSrc="https://via.placeholder.com/50"
                                        boxSize="50px" 
                                        objectFit="cover" 
                                        borderRadius="md" 
                                        mr={3} 
                                    />
                                    <Text fontWeight="medium" noOfLines={2}>{item.product.productName}</Text>
                                </Flex>
                            </Td>
                            <Td isNumeric>{formatCurrency(item.price)}</Td>
                            <Td isNumeric>x{item.quantity}</Td>
                            <Td isNumeric fontWeight="bold">{formatCurrency(item.totalPrice)}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default OrderItemList;