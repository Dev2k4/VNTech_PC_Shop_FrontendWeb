import React from 'react';
import { Box, Heading, Text, Button, Icon, VStack, useColorModeValue } from '@chakra-ui/react';
import { FaSearch, FaBoxOpen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NoResults = ({ title, message, onReset, showResetButton = true }) => {
    const navigate = useNavigate();
    const bg = useColorModeValue("white", "gray.800");
    const iconColor = useColorModeValue("blue.100", "blue.900");
    const iconMain = useColorModeValue("blue.500", "blue.300");

    const handleBackHome = () => {
        navigate('/');
    };

    return (
        <VStack 
            bg={bg} 
            p={12} 
            borderRadius="2xl" 
            border="1px dashed" 
            borderColor={useColorModeValue("gray.300", "gray.700")}
            spacing={6}
            textAlign="center"
            w="full"
        >
            <Box position="relative" display="inline-block">
                <Icon as={FaBoxOpen} w={24} h={24} color={iconColor} />
                <Icon 
                    as={FaSearch} 
                    w={10} h={10} 
                    color={iconMain} 
                    position="absolute" 
                    bottom={-2} 
                    right={-2} 
                    bg={bg}
                    borderRadius="full"
                    p={1}
                />
            </Box>

            <Box>
                <Heading size="lg" mb={2} color={useColorModeValue("gray.800", "white")}>
                    {title || "Không tìm thấy sản phẩm nào"}
                </Heading>
                <Text color="gray.500" maxW="lg" mx="auto">
                    {message || "Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với tìm kiếm của bạn. Hãy thử thay đổi từ khóa hoặc bộ lọc."}
                </Text>
            </Box>

            <VStack spacing={3}>
                {showResetButton && onReset && (
                    <Button 
                        colorScheme="blue" 
                        size="lg" 
                        px={8}
                        onClick={onReset}
                        leftIcon={<Icon as={FaSearch} />}
                    >
                        Xóa bộ lọc & Tìm lại
                    </Button>
                )}
                <Button variant="ghost" colorScheme="gray" onClick={handleBackHome}>
                    Về trang chủ
                </Button>
            </VStack>
        </VStack>
    );
};

export default NoResults;
