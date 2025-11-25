import React from 'react';
import { HStack, Button, Text, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Backend Java thường tính trang bắt đầu từ 0
    // Nhưng hiển thị cho người dùng thì bắt đầu từ 1
    
    // Tạo mảng số trang [0, 1, 2...]
    const pages = Array.from({ length: totalPages }, (_, i) => i);

    // Nếu chỉ có 1 trang thì không cần hiện phân trang
    if (totalPages <= 1) return null;

    return (
        <HStack justify="center" mt={12} spacing={2}>
            {/* Nút Previous */}
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

            {/* Các số trang */}
            {pages.map((page) => (
                <Button
                    key={page}
                    onClick={() => onPageChange(page)}
                    variant={currentPage === page ? "solid" : "ghost"}
                    bg={currentPage === page ? "apple.blue" : "transparent"}
                    color="white"
                    borderRadius="full"
                    size="sm"
                    w="32px"
                    h="32px"
                    _hover={{
                        bg: currentPage === page ? "apple.blue" : "whiteAlpha.200"
                    }}
                >
                    {page + 1}
                </Button>
            ))}

            {/* Nút Next */}
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
        </HStack>
    );
};

export default Pagination;