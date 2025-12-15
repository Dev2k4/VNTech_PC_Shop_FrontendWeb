import React from "react";
import { Box, Table, Tbody, Tr, Td, useColorModeValue } from "@chakra-ui/react";

const SpecificationTable = ({ specifications }) => {
  if (!specifications || specifications.length === 0) return null;

  const cardBg = useColorModeValue("white", "vntech.cardBg");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.500", "gray.400");
  const rowEvenBg = useColorModeValue("gray.50", "whiteAlpha.50");

  return (
    <Box bg={cardBg} borderRadius="2xl" overflow="hidden" border="1px solid" borderColor={borderColor}>
      <Table variant="simple" size="md">
        <Tbody>
          {specifications.map((spec, index) => (
            <Tr key={index} bg={index % 2 === 0 ? "transparent" : rowEvenBg}>
              <Td w="30%" fontWeight="medium" color={subTextColor} borderBottomColor={borderColor}>{spec.keyName}</Td>
              <Td w="70%" fontWeight="semibold" color={textColor} borderBottomColor={borderColor}>{spec.value}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default SpecificationTable;