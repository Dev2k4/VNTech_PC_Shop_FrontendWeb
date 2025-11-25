import React from 'react';
import { Box, Table, Tbody, Tr, Td, Grid, Text } from '@chakra-ui/react';

// Component chỉ có nhiệm vụ render bảng
const SpecificationTable = ({ specifications }) => {
    
    if (!specifications || specifications.length === 0) return null;

    return (
        <Box 
            bg="apple.card" // Nền xám đậm
            borderRadius="3xl"
            overflow="hidden"
            border="1px solid"
            borderColor="whiteAlpha.200"
            p={8}
            maxW="900px" // Giới hạn bảng giữa trang
            mx="auto"
        >
            <Heading size="md" mb={4} color="white">Đánh giá khách hàng (0)</Heading>
            <Table variant="unstyled" size="lg">
                <Tbody>
                    
                    {specifications.map((spec, index) => (
                        <Tr 
                            key={index} 
                            bg={index % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.03)"} // Sọc xen kẽ nhẹ
                        >
                            <Td w="35%" fontWeight="normal" color="gray.400" border="none" px={4} py={3}>
                                {spec.keyName}
                            </Td>
                            <Td w="65%" fontWeight="semibold" color="white" border="none" px={4} py={3}>
                                {spec.value}
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default SpecificationTable;