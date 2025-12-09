import React from "react";
import { Box, Table, Tbody, Tr, Td, useColorModeValue } from "@chakra-ui/react";

const SpecificationTable = ({ specifications }) => {
  if (!specifications || specifications.length === 0) return null;

  const cardBg = useColorModeValue("apple.lightCard", "apple.card");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const textColor = useColorModeValue("apple.lightText", "white");
  const subTextColor = useColorModeValue("apple.lightSubText", "gray.400");
  const rowHoverBg = useColorModeValue("rgba(0, 0, 0, 0.03)", "rgba(255, 255, 255, 0.03)");

  return (
    <Box
      bg={cardBg}
      borderRadius="3xl"
      overflow="hidden"
      border="1px solid"
      borderColor={borderColor}
      p={8}
      maxW="900px"
      mx="auto"
    >
      <Table variant="unstyled" size="lg">
        <Tbody>
          {specifications.map((spec, index) => (
            <Tr
              key={index}
              bg={index % 2 === 0 ? "transparent" : rowHoverBg}
            >
              <Td
                w="35%"
                fontWeight="normal"
                color={subTextColor}
                border="none"
                px={4}
                py={3}
              >
                {spec.keyName}
              </Td>
              <Td
                w="65%"
                fontWeight="semibold"
                color={textColor}
                border="none"
                px={4}
                py={3}
              >
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
