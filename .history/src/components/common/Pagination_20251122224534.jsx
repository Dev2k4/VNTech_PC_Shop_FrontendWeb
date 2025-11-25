import React from "react";
import { HStack, Button, IconButton, Icon } from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const SIBLING_COUNT = 3;

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    let start = Math.max(0, currentPage - Math.floor(SIBLING_COUNT / 2));
    let end = Math.min(totalPages - 1, start + SIBLING_COUNT - 1);

    if (end - start + 1 < SIBLING_COUNT) {
      start = Math.max(0, end - SIBLING_COUNT + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <HStack justify="center" mt={12} spacing={2}>
      <IconButton
        icon={<ArrowLeftIcon boxSize={3} />}
        isDisabled={currentPage === 0}
        onClick={() => onPageChange(0)}
        variant="l"
        color="white"
        _hover={{ bg: "whiteAlpha.200" }}
        aria-label="Trang đầu"
        borderRadius="full"
        size="sm"
      />

      <IconButton
        icon={<ChevronLeftIcon boxSize={6} />}
        isDisabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        variant="ghost"
        color="white"
        _hover={{ bg: "whiteAlpha.200" }}
        aria-label="Trang trước"
        borderRadius="full"
      />

      {visiblePages.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={currentPage === page ? "solid" : "ghost"}
          bg={currentPage === page ? "apple.blue" : "transparent"}
          color="white"
          borderRadius="full"
          size="sm"
          w="36px"
          h="36px"
          _hover={{
            bg: currentPage === page ? "apple.blue" : "whiteAlpha.200",
          }}
        >
          {page + 1}
        </Button>
      ))}

      <IconButton
        icon={<ChevronRightIcon boxSize={6} />}
        isDisabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        variant="ghost"
        color="white"
        _hover={{ bg: "whiteAlpha.200" }}
        aria-label="Trang sau"
        borderRadius="full"
      />

      <IconButton
        icon={<ArrowRightIcon boxSize={3} />}
        isDisabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(totalPages - 1)}
        variant="ghost"
        color="white"
        _hover={{ bg: "whiteAlpha.200" }}
        aria-label="Trang cuối"
        borderRadius="full"
        size="sm"
      />
    </HStack>
  );
};

export default Pagination;
