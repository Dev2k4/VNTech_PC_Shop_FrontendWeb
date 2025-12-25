import React from 'react';
import { Box, Heading, Text, HStack, VStack, Progress, Grid, Icon } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const ReviewStats = ({ summary }) => {
    if (!summary) return null;

    const { 
        averageRating, 
        totalReviews, 
        fiveStar, 
        fourStar, 
        threeStar, 
        twoStar, 
        oneStar 
    } = summary;

    // Create a map for easier iteration
    const distribution = {
        5: fiveStar || 0,
        4: fourStar || 0,
        3: threeStar || 0,
        2: twoStar || 0,
        1: oneStar || 0
    };
    
    const getPercentage = (count) => {
        if (!totalReviews || totalReviews === 0) return 0;
        return (count / totalReviews) * 100;
    };

    return (
        <Box p={6} bg="gray.50" _dark={{ bg: "gray.700" }} borderRadius="xl">
            <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={8} alignItems="center">
                <VStack spacing={2}>
                    <Heading size="3xl" color="blue.500">{averageRating ? averageRating.toFixed(1) : 0}</Heading>
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
                    <Text color="gray.500">{totalReviews || 0} đánh giá</Text>
                </VStack>

                <VStack spacing={2} align="stretch" w="full">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <HStack key={rating} spacing={4}>
                            <Text w="30px" fontWeight="bold" fontSize="sm">{rating} ★</Text>
                            <Progress 
                                value={getPercentage(distribution[rating])} 
                                colorScheme="yellow" 
                                size="sm" 
                                w="full" 
                                borderRadius="full" 
                                bg="white"
                                _dark={{ bg: "gray.600" }}
                            />
                            <Text w="40px" fontSize="xs" color="gray.500" textAlign="right">
                                {distribution[rating]}
                            </Text>
                        </HStack>
                    ))}
                </VStack>
            </Grid>
        </Box>
    );
};

export default ReviewStats;
