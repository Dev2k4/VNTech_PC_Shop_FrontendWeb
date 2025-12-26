import React from "react";
import { Box, Heading, Text, VStack, Button, HStack, Divider, Flex, useColorModeValue, Avatar, Badge } from "@chakra-ui/react";
import { StarIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { formatDate } from "../../../utils/format";

const ReviewList = ({ reviews }) => {
  const cardBg = useColorModeValue("white", "vntech.cardBg");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.500", "gray.400");

  if (!reviews || reviews.length === 0) {
    return (
      <Box bg={cardBg} p={8} borderRadius="2xl" border="1px solid" borderColor={borderColor} textAlign="center" mt={6}>
        <Heading size="md" mb={2} color={textColor}>Chưa có đánh giá nào</Heading>
        <Text color={subTextColor} mb={4}>Hãy là người đầu tiên đánh giá sản phẩm này!</Text>
      </Box>
    );
  }

  return (
    <Box mt={8}>
      <VStack align="stretch" spacing={6}>
        {reviews.map((review, index) => (
          <Box key={index} borderBottom={index < reviews.length - 1 ? "1px solid" : "none"} borderColor={borderColor} pb={6}>
            <Flex justify="space-between" align="flex-start" mb={2}>
                <HStack spacing={3}>
                    <Avatar size="sm" name={review.user?.fullName} src={review.user?.avatar} bg="blue.500" />
                    <Box>
                        <HStack>
                            <Text fontWeight="bold" color={textColor} fontSize="sm">{review.user?.fullName || "Người dùng ẩn danh"}</Text>
                            {review.verifiedPurchase && (
                                <Badge colorScheme="green" fontSize="0.7em" variant="subtle">Đã mua hàng <Icon as={CheckCircleIcon} ml={1}/></Badge>
                            )}
                        </HStack>
                        <HStack spacing={0.5} pt={1}>
                            {[...Array(5)].map((_, i) => <StarIcon key={i} w={3} h={3} color={i < review.rating ? "yellow.400" : "gray.300"} />)}
                        </HStack>
                    </Box>
                </HStack>
                <Text fontSize="xs" color="gray.500">{formatDate(review.createdAt)}</Text>
            </Flex>
            <Text color={textColor} fontSize="sm" mt={2} pl={12} lineHeight="tall">
              {review.comment}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};
import { Icon } from "@chakra-ui/react";

export default ReviewList;