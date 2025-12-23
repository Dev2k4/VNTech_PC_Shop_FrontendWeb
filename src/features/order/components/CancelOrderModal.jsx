import React, { useState, useRef } from 'react';
import {
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button,
    Textarea, Text, useToast, FormControl, FormLabel
} from '@chakra-ui/react';

const CancelOrderModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
    const cancelRef = useRef();
    const [reason, setReason] = useState("");
    const toast = useToast();

    const handleSubmit = () => {
        if (!reason.trim()) {
            toast({ title: "Vui lòng nhập lý do hủy đơn", status: "warning", position: "top" });
            return;
        }
        onConfirm(reason);
    };

    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay>
                {/* --- ĐÃ XÓA THẺ ModalContent THỪA Ở ĐÂY --- */}
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>Xác nhận hủy đơn hàng</AlertDialogHeader>
                    <AlertDialogBody>
                        <Text mb={3} color="gray.500">
                            Hành động này không thể hoàn tác. Bạn có chắc chắn muốn hủy?
                        </Text>
                        <FormControl isRequired>
                            <FormLabel>Lý do hủy đơn</FormLabel>
                            <Textarea 
                                placeholder="VD: Đổi địa chỉ, không có nhu cầu nữa..." 
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                autoFocus
                            />
                        </FormControl>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose} isDisabled={isLoading}>
                            Không
                        </Button>
                        <Button 
                            colorScheme='red' 
                            onClick={handleSubmit} 
                            ml={3}
                            isLoading={isLoading}
                            loadingText="Đang hủy..."
                        >
                            Xác nhận hủy
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                {/* ------------------------------------------- */}
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

export default CancelOrderModal;