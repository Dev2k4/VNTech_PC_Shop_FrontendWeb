import React from 'react';
import { Box, Heading, Text, VStack, Button, HStack, Divider, Flex } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { formatDate } from '../../../utils/format'; 

const ReviewList = ({ reviews }) => {
    // reviews: product.reviews (Giả sử Backend trả về mảng reviews)
    if (!reviews || reviews.length === 0) {
        return (
            <Box bg="apple.card" p={6} borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.200">
                <Heading size="md" mb={4} color="white">Đánh giá khách hàng (0)</Heading>
                <Divider borderColor="whiteAlpha.200" mb={4} />
                <Text color="gray.400" mb={4}>Hãy đăng nhập và là người đầu tiên đánh giá sản phẩm này!</Text>
                <Button colorScheme="blue" borderRadius="full" size="sm">Viết đánh giá</Button>
            </Box>
        );
    }

    return (
        <VStack align="stretch" spacing={6}>
            <Heading size="xl" color="white" borderBottom="1px solid" borderColor="whiteAlpha.200" pb={4} mb={2}>
                Đánh giá ({reviews.length})
            </Heading>
            
            {reviews.map((review, index) => (
                <Box 
                    key={index} 
                    p={5} 
                    bg="apple.card" 
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                >
                    <Flex justify="space-between" align="center" mb={3}>
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
            
            <Flex justify="center" mt={4}>
                <Button variant="link" colorScheme="blue">Xem thêm đánh giá</Button>
            </Flex>
        </VStack>
    );
};

export default ReviewList;