import React, { useState, useEffect } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
    Button, FormControl, FormLabel, Input, Select, VStack, useToast, Checkbox, HStack
} from '@chakra-ui/react';
import AddressService from '../../../services/address.service';

const AddressModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
    const [formData, setFormData] = useState({
        recipientName: '', phoneNumber: '', 
        province: '', district: '', ward: '', 
        addressDetail: '', default: false
    });
    
    // State cho các list địa chính
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    // 1. Load danh sách Tỉnh khi mở Modal
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await AddressService.getProvinces();
                if (res.success) setProvinces(res.data);
            } catch (error) {
                console.error("Lỗi lấy tỉnh thành", error);
            }
        };
        if (isOpen) fetchProvinces();
    }, [isOpen]);

    // 2. Load danh sách Quận/Huyện khi chọn Tỉnh
    useEffect(() => {
        if (formData.province) {
            const fetchDistricts = async () => {
                const provinceCode = provinces.find(p => p.name === formData.province)?.code;
                if(provinceCode) {
                    const res = await AddressService.getDistricts(provinceCode);
                    if (res.success) setDistricts(res.data);
                }
            };
            fetchDistricts();
            setDistricts([]); setWards([]); // Reset cấp dưới
        }
    }, [formData.province, provinces]);

    // 3. Load danh sách Phường/Xã khi chọn Quận/Huyện
    useEffect(() => {
        if (formData.district) {
            const fetchWards = async () => {
                const districtCode = districts.find(d => d.name === formData.district)?.code;
                if(districtCode) {
                    const res = await AddressService.getWards(districtCode);
                    if (res.success) setWards(res.data);
                }
            };
            fetchWards();
            setWards([]); // Reset cấp dưới
        }
    }, [formData.district, districts]);

    // 4. Fill dữ liệu nếu là chế độ Sửa (Edit)
    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                province: initialData.province || '',
                district: initialData.district || '',
                ward: initialData.ward || ''
            });
        } else {
            // Reset form nếu là chế độ Thêm mới
            setFormData({ recipientName: '', phoneNumber: '', province: '', district: '', ward: '', addressDetail: '', default: false });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async () => {
        // Validate cơ bản
        if (!formData.recipientName || !formData.phoneNumber || !formData.province || !formData.district || !formData.ward || !formData.addressDetail) {
            toast({ title: 'Vui lòng điền đầy đủ thông tin', status: 'warning' });
            return;
        }

        setLoading(true);
        try {
            // Gọi API thêm mới (hoặc cập nhật nếu cần)
            await AddressService.addAddress(formData);
            toast({ title: 'Lưu địa chỉ thành công', status: 'success' });
            onSuccess(); // Callback để reload list bên ngoài
            onClose();
        } catch (error) {
            toast({ title: 'Lỗi lưu địa chỉ', description: error.response?.data?.message, status: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Thêm địa chỉ mới</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <HStack w="full" spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Họ tên</FormLabel>
                                <Input name="recipientName" value={formData.recipientName} onChange={handleChange} placeholder="Tên người nhận" />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Số điện thoại</FormLabel>
                                <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="09xxxxxxx" />
                            </FormControl>
                        </HStack>

                        <HStack w="full" spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Tỉnh / Thành phố</FormLabel>
                                <Select name="province" value={formData.province} onChange={handleChange} placeholder="Chọn Tỉnh/Thành">
                                    {provinces.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
                                </Select>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Quận / Huyện</FormLabel>
                                <Select name="district" value={formData.district} onChange={handleChange} placeholder="Chọn Quận/Huyện" isDisabled={!formData.province}>
                                    {districts.map(d => <option key={d.code} value={d.name}>{d.name}</option>)}
                                </Select>
                            </FormControl>
                        </HStack>

                        <HStack w="full" spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Phường / Xã</FormLabel>
                                <Select name="ward" value={formData.ward} onChange={handleChange} placeholder="Chọn Phường/Xã" isDisabled={!formData.district}>
                                    {wards.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
                                </Select>
                            </FormControl>
                        </HStack>

                        <FormControl isRequired>
                            <FormLabel>Địa chỉ chi tiết</FormLabel>
                            <Input name="addressDetail" value={formData.addressDetail} onChange={handleChange} placeholder="Số nhà, tên đường..." />
                        </FormControl>

                        <FormControl display="flex" alignItems="center">
                            <Checkbox name="default" isChecked={formData.default} onChange={handleChange} colorScheme="blue" mr={2} />
                            <FormLabel mb="0">Đặt làm địa chỉ mặc định</FormLabel>
                        </FormControl>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>Hủy</Button>
                    <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading}>Lưu địa chỉ</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddressModal;