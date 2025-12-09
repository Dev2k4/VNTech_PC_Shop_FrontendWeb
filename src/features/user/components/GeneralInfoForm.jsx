import React, { useState, useEffect } from 'react';
import { VStack, FormControl, FormLabel, Input, Select, Button } from '@chakra-ui/react';

const GeneralInfoForm = ({ initialData, onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        gender: '',
        dateOfBirth: '',
        phoneNumber: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData.fullName || '',
                gender: initialData.gender || '',
                dateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : '',
                phoneNumber: initialData.phoneNumber || ''
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={5} align="stretch">
                <FormControl>
                    <FormLabel>Tên đăng nhập</FormLabel>
                    <Input value={initialData?.username || ''} isReadOnly bg="gray.100" cursor="not-allowed" />
                </FormControl>
                
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input value={initialData?.email || ''} isReadOnly bg="gray.100" cursor="not-allowed" />
                </FormControl>

                <FormControl>
                    <FormLabel>Họ và tên</FormLabel>
                    <Input 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleChange} 
                        placeholder="Nhập họ tên của bạn"
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Giới tính</FormLabel>
                    <Select 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleChange}
                    >
                        <option value="">-- Chọn giới tính --</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                    </Select>
                </FormControl>

                <FormControl>
                    <FormLabel>Ngày sinh</FormLabel>
                    <Input 
                        type="date" 
                        name="dateOfBirth" 
                        value={formData.dateOfBirth} 
                        onChange={handleChange} 
                    />
                </FormControl>
                
                <Button 
                    type="submit" 
                    colorScheme="blue" 
                    isLoading={isLoading} 
                    alignSelf="flex-start"
                    px={8}
                >
                    Lưu thay đổi
                </Button>
            </VStack>
        </form>
    );
};

export default GeneralInfoForm;