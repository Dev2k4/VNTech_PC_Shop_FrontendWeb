import React, { useState, useEffect } from 'react';
import { VStack, FormControl, FormLabel, Input, Select, Button, useColorModeValue } from '@chakra-ui/react';

const GeneralInfoForm = ({ initialData, onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        fullName: '', gender: '', dateOfBirth: '', phoneNumber: ''
    });

    // --- FIX COLOR: Tạo màu riêng cho Input ---
    const inputBg = useColorModeValue("white", "whiteAlpha.100");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.300");
    const readOnlyBg = useColorModeValue("gray.100", "whiteAlpha.200");
    const textColor = useColorModeValue("gray.800", "white");
    // ------------------------------------------

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

    const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={5} align="stretch">
                <FormControl>
                    <FormLabel color={textColor}>Tên đăng nhập</FormLabel>
                    <Input 
                        value={initialData?.username || ''} 
                        isReadOnly 
                        bg={readOnlyBg} 
                        color={textColor} 
                        border="none"
                        cursor="not-allowed" 
                    />
                </FormControl>
                
                <FormControl>
                    <FormLabel color={textColor}>Email</FormLabel>
                    <Input 
                        value={initialData?.email || ''} 
                        isReadOnly 
                        bg={readOnlyBg} 
                        color={textColor} 
                        border="none"
                        cursor="not-allowed" 
                    />
                </FormControl>

                <FormControl>
                    <FormLabel color={textColor}>Họ và tên</FormLabel>
                    <Input 
                        name="fullName" value={formData.fullName} onChange={handleChange} 
                        bg={inputBg} borderColor={borderColor} color={textColor}
                        placeholder="Nhập họ tên của bạn"
                    />
                </FormControl>

                <FormControl>
                    <FormLabel color={textColor}>Giới tính</FormLabel>
                    <Select 
                        name="gender" value={formData.gender} onChange={handleChange}
                        bg={inputBg} borderColor={borderColor} color={textColor}
                        // Fix lỗi option bị trắng trong dark mode
                        sx={{ option: { color: useColorModeValue("black", "black") } }} 
                    >
                        <option value="">-- Chọn giới tính --</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                    </Select>
                </FormControl>

                <FormControl>
                    <FormLabel color={textColor}>Ngày sinh</FormLabel>
                    <Input 
                        type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} 
                        bg={inputBg} borderColor={borderColor} color={textColor}
                        // Fix icon lịch hiển thị tốt trên nền tối
                        css={{ "::-webkit-calendar-picker-indicator": { filter: useColorModeValue("none", "invert(1)") } }}
                    />
                </FormControl>
                
                <Button 
                    type="submit" colorScheme="blue" isLoading={isLoading} alignSelf="flex-start" px={8}
                >
                    Lưu thay đổi
                </Button>
            </VStack>
        </form>
    );
};

export default GeneralInfoForm;