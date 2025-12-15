import React from "react";
import { HStack, Button, IconButton } from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const SIBLING_COUNT = 1;
  const range = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, idx) => start + idx);

  const getVisiblePages = () => {
    const totalNumbers = SIBLING_COUNT + 5;
    if (totalPages <= totalNumbers) return range(0, totalPages - 1);

    const leftSiblingIndex = Math.max(currentPage - SIBLING_COUNT, 0);
    const rightSiblingIndex = Math.min(
      currentPage + SIBLING_COUNT,
      totalPages - 1
    );
    const showLeftDots = leftSiblingIndex > 1;
    const showRightDots = rightSiblingIndex < totalPages - 2;

    if (!showLeftDots && showRightDots) {
      let leftItemCount = 3 + 2 * SIBLING_COUNT;
      return range(0, leftItemCount);
    }
    if (showLeftDots && !showRightDots) {
      let rightItemCount = 3 + 2 * SIBLING_COUNT;
      return range(totalPages - rightItemCount, totalPages - 1);
    }
    return range(leftSiblingIndex, rightSiblingIndex);
  };

  const visiblePages = getVisiblePages();

  return (
    <HStack justify="center" mt={10} spacing={2}>
      <IconButton
        icon={<ArrowLeftIcon boxSize={3} />}
        isDisabled={currentPage === 0}
        onClick={() => onPageChange(0)}
        variant="outline"
        borderColor="whiteAlpha.300"
        color="white"
        size="sm"
        isRound
        _hover={{ bg: "whiteAlpha.200" }}
      />
      <IconButton
        icon={<ChevronLeftIcon boxSize={5} />}
        isDisabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        variant="outline"
        borderColor="whiteAlpha.300"
        color="white"
        size="sm"
        isRound
        _hover={{ bg: "whiteAlpha.200" }}
      />

      {visiblePages.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={currentPage === page ? "solid" : "ghost"}
          bg={currentPage === page ? "blue.500" : "transparent"}
          color="white"
          size="sm"
          borderRadius="md"
          _hover={{ bg: currentPage === page ? "blue.600" : "whiteAlpha.200" }}
        >
          {page + 1}
        </Button>
      ))}

      <IconButton
        icon={<ChevronRightIcon boxSize={5} />}
        isDisabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        variant="outline"
        borderColor="whiteAlpha.300"
        color="white"
        size="sm"
        isRound
        _hover={{ bg: "whiteAlpha.200" }}
      />
      <IconButton
        icon={<ArrowRightIcon boxSize={3} />}
        isDisabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(totalPages - 1)}
        variant="outline"
        borderColor="whiteAlpha.300"
        color="white"
        size="sm"
        isRound
        _hover={{ bg: "whiteAlpha.200" }}
      />
    </HStack>
  );
};

export default Pagination;
