import React from 'react';
import {
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button
} from '@chakra-ui/react';

const CancelOrderModal = ({ isOpen, onClose, onConfirm }) => {
    const cancelRef = React.useRef();

    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>Hủy đơn hàng</AlertDialogHeader>
                    <AlertDialogBody>
                        Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>Không</Button>
                        <Button colorScheme='red' onClick={onConfirm} ml={3}>Hủy đơn</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

export default CancelOrderModal;
