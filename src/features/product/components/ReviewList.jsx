import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  HStack,
  Divider,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { formatDate } from "../../../utils/format";

const ReviewList = ({ reviews }) => {
  const cardBg = useColorModeValue("apple.lightCard", "apple.card");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const textColor = useColorModeValue("apple.lightText", "white");
  const subTextColor = useColorModeValue("apple.lightSubText", "gray.400");
  const commentColor = useColorModeValue("gray.600", "gray.300");

  if (!reviews || reviews.length === 0) {
    return (
      <Box
        bg={cardBg}
        p={6}
        borderRadius="2xl"
        border="1px solid"
        borderColor={borderColor}
      >
        <Heading size="md" mb={4} color={textColor}>
          Đánh giá khách hàng (0)
        </Heading>
        <Divider borderColor={borderColor} mb={4} />
        <Text color={subTextColor} mb={4}>
          Hãy đăng nhập và là người đầu tiên đánh giá sản phẩm này!
        </Text>
        <Button colorScheme="blue" borderRadius="full" size="sm">
          Viết đánh giá
        </Button>
      </Box>
    );
  }

  return (
    <VStack align="stretch" spacing={6}>
      <Heading
        size="xl"
        color={textColor}
        borderBottom="1px solid"
        borderColor={borderColor}
        pb={4}
        mb={2}
      >
        Đánh giá ({reviews.length})
      </Heading>

      {reviews.map((review, index) => (
        <Box
          key={index}
          p={5}
          bg={cardBg}
          borderRadius="xl"
          border="1px solid"
          borderColor={useColorModeValue("gray.100", "whiteAlpha.100")}
        >
          <Flex justify="space-between" align="center" mb={3}>
            {/* Rating stars */}
            <HStack spacing={0.5} color="yellow.400">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  boxSize={4}
                  opacity={i < review.rating ? 1 : 0.3}
                />
              ))}
            </HStack>
            <Text fontSize="sm" color="gray.500">
              {formatDate(review.createdAt)}
            </Text>
          </Flex>

          <Text fontWeight="semibold" color={textColor} mb={2}>
            {review.user?.username || "Người dùng ẩn danh"}
          </Text>

          <Text color={commentColor} fontSize="md">
            {review.comment}
          </Text>
        </Box>
      ))}

      <Flex justify="center" mt={4}>
        <Button variant="link" colorScheme="blue">
          Xem thêm đánh giá
        </Button>
      </Flex>
    </VStack>
  );
};

export default ReviewList;
