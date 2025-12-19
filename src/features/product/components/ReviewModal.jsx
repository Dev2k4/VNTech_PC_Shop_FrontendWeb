import React, { useState } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Button, Textarea, VStack, Text, HStack, Icon, useToast
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import ReviewService from '../../../services/review.service';

const ReviewModal = ({ isOpen, onClose, productId, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async () => {
        if (!comment.trim()) {
            toast({ title: "Vui lòng nhập nội dung đánh giá", status: "warning" });
            return;
        }
        setLoading(true);
        try {
            await ReviewService.createReview({ productId, rating, comment });
            toast({ title: "Đánh giá thành công!", status: "success" });
            onSuccess(); // Reload lại list review bên ngoài
            onClose();
            setComment("");
        } catch (error) {
            toast({ title: "Lỗi", description: "Không thể gửi đánh giá", status: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Đánh giá sản phẩm</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <Text fontWeight="bold">Bạn cảm thấy sản phẩm thế nào?</Text>
                        <HStack spacing={2}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Icon 
                                    key={star} 
                                    as={StarIcon} 
                                    w={8} h={8} 
                                    color={star <= rating ? "yellow.400" : "gray.300"} 
                                    cursor="pointer"
                                    onClick={() => setRating(star)}
                                    _hover={{ transform: 'scale(1.2)' }}
                                    transition="all 0.2s"
                                />
                            ))}
                        </HStack>
                        <Textarea 
                            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..." 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={5}
                        />
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>Hủy</Button>
                    <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading}>Gửi đánh giá</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ReviewModal;