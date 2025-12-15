// src/components/common/AdminTableSkeleton.jsx
import React from 'react';
import { Tr, Td, Skeleton, useColorModeValue } from '@chakra-ui/react';

const AdminTableSkeleton = ({ rowCount = 5, columnCount = 5 }) => {
    // Màu Skeleton cho Dark Mode (Cyberpunk style)
    const startColor = useColorModeValue("gray.100", "gray.700");
    const endColor = useColorModeValue("gray.300", "gray.600");

    return (
        <>
            {[...Array(rowCount)].map((_, rowIndex) => (
                <Tr key={rowIndex}>
                    {[...Array(columnCount)].map((_, colIndex) => (
                        <Td key={colIndex}>
                            <Skeleton 
                                height="20px" 
                                width="100%" 
                                borderRadius="md"
                                startColor={startColor}
                                endColor={endColor}
                            />
                        </Td>
                    ))}
                </Tr>
            ))}
        </>
    );
};

export default AdminTableSkeleton;