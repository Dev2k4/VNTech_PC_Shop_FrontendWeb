import React from 'react';
import { Box, HStack, Text, Progress, VStack, Heading, Flex, Icon } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const ReviewSummary = ({ summary }) => {
    if (!summary) return null;

    const { averageRating, totalReviews, fiveStar, fourStar, threeStar, twoStar, oneStar } = summary;

    const RatingBar = ({ stars, count, total }) => {
        const percent = total > 0 ? (count / total) * 100 : 0;
        return (
            <HStack w="full" spacing={4}>
                <HStack w="60px" spacing={1}>
                    <Text fontWeight="bold" fontSize="sm">{stars}</Text>
                    <StarIcon color="yellow.400" w={3} h={3} />
                </HStack>
                <Progress value={percent} size="sm" colorScheme="yellow" borderRadius="full" flex={1} bg="gray.100" />
                <Text fontSize="sm" color="gray.500" w="40px" textAlign="right">{count}</Text>
            </HStack>
        );
    };

    return (
        <Box p={6} bg="gray.50" borderRadius="xl">
            <Grid templateColumns={{ base: "1fr", md: "1fr 1.5fr" }} gap={8} alignItems="center">
                {/* Average Rating Box */}
                <VStack spacing={1} align="center" justify="center" h="full">
                    <Flex align="baseline">
                        <Heading size="3xl" color="yellow.500">{averageRating?.toFixed(1) || 0}</Heading>
                        <Text fontSize="xl" color="gray.500" ml={1}>/ 5</Text>
                    </Flex>
                    <HStack spacing={1}>
                        {[...Array(5)].map((_, i) => (
                            <Icon 
                                key={i} 
                                as={StarIcon} 
                                color={i < Math.round(averageRating || 0) ? "yellow.400" : "gray.300"} 
                                w={6} h={6}
                            />
                        ))}
                    </HStack>
                    <Text color="gray.500" mt={2}>({totalReviews || 0} đánh giá)</Text>
                </VStack>

                {/* Rating Progress Bars */}
                <VStack spacing={2} w="full">
                    <RatingBar stars={5} count={fiveStar || 0} total={totalReviews} />
                    <RatingBar stars={4} count={fourStar || 0} total={totalReviews} />
                    <RatingBar stars={3} count={threeStar || 0} total={totalReviews} />
                    <RatingBar stars={2} count={twoStar || 0} total={totalReviews} />
                    <RatingBar stars={1} count={oneStar || 0} total={totalReviews} />
                </VStack>
            </Grid>
        </Box>
    );
};

// Cần import Grid từ Chakra UI, nãy quên
import { Grid } from '@chakra-ui/react';

export default ReviewSummary;
