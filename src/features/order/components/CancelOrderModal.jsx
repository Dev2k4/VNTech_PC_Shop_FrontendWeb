import React, { useState } from 'react';
import {
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button,
    Textarea, Text, useToast
} from '@chakra-ui/react';

const CancelOrderModal = ({ isOpen, onClose, onConfirm }) => {
    const cancelRef = React.useRef();
    const [reason, setReason] = useState("");
    const toast = useToast();

    const handleSubmit = () => {
        if (!reason.trim()) {
            toast({ title: "Vui lòng nhập lý do", status: "warning", position: "top" });
            return;
        }
        onConfirm(reason); // Truyền lý do ra ngoài
        setReason(""); // Reset form
    };

    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>Hủy đơn hàng</AlertDialogHeader>
                    <AlertDialogBody>
                        <Text mb={3}>Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.</Text>
                        <Textarea 
                            placeholder="Nhập lý do hủy đơn (VD: Đổi ý, sai địa chỉ...)" 
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>Không</Button>
                        <Button colorScheme='red' onClick={handleSubmit} ml={3}>Xác nhận hủy</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

export default CancelOrderModal;