import React, { useState } from 'react';
import { VStack, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';

const ChangePasswordForm = ({ onSubmit }) => {
    const [passData, setPassData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const toast = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passData.newPassword !== passData.confirmNewPassword) {
            toast({ title: 'Mật khẩu xác nhận không khớp', status: 'warning', duration: 3000 });
            return;
        }
        onSubmit(passData, () => {
            setPassData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPassData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={5} align="stretch">
                <FormControl isRequired>
                    <FormLabel>Mật khẩu hiện tại</FormLabel>
                    <Input 
                        type="password" 
                        name="oldPassword"
                        value={passData.oldPassword} 
                        onChange={handleChange} 
                        placeholder="********"
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <Input 
                        type="password" 
                        name="newPassword"
                        value={passData.newPassword} 
                        onChange={handleChange} 
                        placeholder="Ít nhất 6 ký tự"
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Nhập lại mật khẩu mới</FormLabel>
                    <Input 
                        type="password" 
                        name="confirmNewPassword"
                        value={passData.confirmNewPassword} 
                        onChange={handleChange} 
                        placeholder="Xác nhận mật khẩu"
                    />
                </FormControl>

                <Button type="submit" colorScheme="red" alignSelf="flex-start" px={8}>
                    Đổi mật khẩu
                </Button>
            </VStack>
        </form>
    );
};

export default ChangePasswordForm;