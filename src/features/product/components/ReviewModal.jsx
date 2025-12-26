import React, { useState } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Button, Textarea, VStack, Text, HStack, Icon, useToast, FormControl, FormErrorMessage
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import ReviewService from '../../../services/review.service';

const ReviewModal = ({ isOpen, onClose, productId, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const toast = useToast();

    const handleSubmit = async () => {
        if (!comment.trim()) {
            setError("Vui lòng nhập nội dung đánh giá");
            return;
        }
        if (comment.trim().length < 10) {
            setError("Nội dung đánh giá phải có ít nhất 10 ký tự");
            return;
        }
        setError(""); // Clear error

        setLoading(true);
        try {
            await ReviewService.createReview({ productId, rating, comment });
            toast({ title: "Đánh giá thành công!", description: "Cảm ơn bạn đã chia sẻ đánh giá.", status: "success" });
            onSuccess(); // Reload lại list review bên ngoài
            handleClose();
        } catch (error) {
            const msg = error.response?.data || "Không thể gửi đánh giá";
            toast({ title: "Lỗi", description: msg, status: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setComment("");
        setRating(5);
        setError("");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} isCentered size="lg">
            <ModalOverlay backdropFilter="blur(2px)" />
            <ModalContent borderRadius="xl">
                <ModalHeader>Đánh giá sản phẩm</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <VStack spacing={6}>
                        <VStack spacing={2}>
                            <Text fontWeight="medium" fontSize="lg">Bạn cảm thấy sản phẩm thế nào?</Text>
                            <HStack spacing={2}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Icon 
                                        key={star} 
                                        as={StarIcon} 
                                        w={10} h={10} 
                                        color={star <= rating ? "yellow.400" : "gray.200"} 
                                        cursor="pointer"
                                        onClick={() => setRating(star)}
                                        _hover={{ transform: 'scale(1.1)', color: "yellow.300" }}
                                        transition="all 0.2s"
                                    />
                                ))}
                            </HStack>
                            <Text color="yellow.500" fontWeight="bold">
                                {rating === 5 ? "Tuyệt vời" : rating === 4 ? "Hài lòng" : rating === 3 ? "Bình thường" : rating === 2 ? "Không hài lòng" : "Tệ"}
                            </Text>
                        </VStack>

                        <FormControl isInvalid={!!error} w="full">
                            <Textarea 
                                placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này nhé..." 
                                value={comment}
                                onChange={(e) => {
                                    setComment(e.target.value);
                                    if(error) setError("");
                                }}
                                rows={6}
                                borderRadius="md"
                                _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                            />
                            <FormErrorMessage>{error}</FormErrorMessage>
                        </FormControl>
                    </VStack>
                </ModalBody>
                <ModalFooter bg="gray.50" borderRadius="0 0 12px 12px">
                    <Button variant="ghost" mr={3} onClick={handleClose}>Hủy bỏ</Button>
                    <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading} px={8}>Gửi đánh giá</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ReviewModal;