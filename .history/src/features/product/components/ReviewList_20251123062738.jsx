import React from 'react';
import { Box, Heading, Text, VStack, Divider, Flex } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { formatDate } from '../../../utils/format'; // Dùng hàm format ngày tháng nếu có

const ReviewList = ({ reviews }) => {
    // Nếu chưa có reviews, hiển thị form để user đăng nhập và viết đánh giá
    if (!reviews || reviews.length === 0) {
        return (
            <Box bg="apple.card" p={8} borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.200">
                <Heading size="md" mb={4} color="white">Chưa có đánh giá</Heading>
                <Text color="gray.400">Hãy là người đầu tiên đánh giá sản phẩm này!</Text>
                <Button mt={4} colorScheme="blue" borderRadius="full">Viết đánh giá</Button>
            </Box>
        );
    }

    return (
        <VStack align="stretch" spacing={6}>
            <Heading size="lg" color="white">Đánh giá khách hàng ({reviews.length})</Heading>
            
            {reviews.map((review, index) => (
                <Box 
                    key={review.id} 
                    p={5} 
                    bg="apple.card" 
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                >
                    <Flex justify="space-between" align="center" mb={2}>
                        {/* Rating stars */}
                        <HStack spacing={0.5} color="yellow.400">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} boxSize={4} opacity={i < review.rating ? 1 : 0.3} />
                            ))}
                        </HStack>
                        <Text fontSize="sm" color="gray.500">{formatDate(review.createdAt)}</Text>
                    </Flex>
                    
                    <Text fontWeight="semibold" color="white" mb={2}>
                        {review.user?.username || "Người dùng ẩn danh"} 
                    </Text>

                    <Text color="gray.300" fontSize="md">
                        {review.comment}
                    </Text>
                </Box>
            ))}
        </VStack>
    );
};

export default ReviewList;