import React from "react";
import { Box, Heading, Text, VStack, Button, HStack, Divider, Flex, useColorModeValue, Avatar } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { formatDate } from "../../../utils/format";

const ReviewList = ({ reviews }) => {
  const cardBg = useColorModeValue("white", "vntech.cardBg");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.500", "gray.400");

  if (!reviews || reviews.length === 0) {
    return (
      <Box bg={cardBg} p={8} borderRadius="2xl" border="1px solid" borderColor={borderColor} textAlign="center">
        <Heading size="md" mb={2} color={textColor}>Chưa có đánh giá nào</Heading>
        <Text color={subTextColor} mb={4}>Hãy là người đầu tiên đánh giá sản phẩm này!</Text>
      </Box>
    );
  }

  return (
    <Box bg={cardBg} p={8} borderRadius="2xl" border="1px solid" borderColor={borderColor}>
      <Heading size="lg" mb={6} color={textColor}>Đánh giá từ khách hàng ({reviews.length})</Heading>
      <VStack align="stretch" spacing={6}>
        {reviews.map((review, index) => (
          <Box key={index} borderBottom={index < reviews.length - 1 ? "1px solid" : "none"} borderColor={borderColor} pb={6}>
            <Flex justify="space-between" align="flex-start" mb={2}>
                <HStack spacing={3}>
                    <Avatar size="sm" name={review.user?.username} bg="blue.500" />
                    <Box>
                        <Text fontWeight="bold" color={textColor} fontSize="sm">{review.user?.username || "Người dùng"}</Text>
                        <HStack spacing={0.5} color="yellow.400" fontSize="xs">
                            {[...Array(5)].map((_, i) => <StarIcon key={i} color={i < review.rating ? "yellow.400" : "gray.600"} />)}
                        </HStack>
                    </Box>
                </HStack>
                <Text fontSize="xs" color="gray.500">{formatDate(review.createdAt)}</Text>
            </Flex>
            <Text color={subTextColor} fontSize="sm" mt={2} pl={10}>
              {review.comment}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default ReviewList;