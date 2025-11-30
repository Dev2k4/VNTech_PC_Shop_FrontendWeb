import React, { useEffect, useState } from 'react';
import {
    Box, Container, Grid, VStack, useToast, Tabs, TabList, TabPanels, Tab, TabPanel,
    Spinner, useColorModeValue
} from '@chakra-ui/react';
import UserService from '../../../services/user.service';
import UserInfoCard from '../components/UserInfoCard';
import GeneralInfoForm from '../components/GeneralInfoForm';
import ChangePasswordForm from '../components/ChangePasswordForm';

const ProfilePage = () => {
    const toast = useToast();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const cardBg = useColorModeValue('white', 'gray.800');

    // --- LOGIC GỌI API ---
    const fetchProfile = async () => {
        try {
            const res = await UserService.getProfile();
            if (res.success) {
                setUser(res.data);
            }
        } catch (error) {
            toast({ title: 'Lỗi tải thông tin', status: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            await UserService.uploadAvatar(user.id, file);
            toast({ title: 'Cập nhật ảnh đại diện thành công', status: 'success' });
            fetchProfile(); 
            window.dispatchEvent(new Event("storage"));
        } catch (error) {
            toast({ title: 'Lỗi upload ảnh', description: error.response?.data?.message, status: 'error' });
        }
    };

    const handleUpdateInfo = async (formData) => {
        setUpdating(true);
        try {
            const payload = {
                ...user,
                fullName: formData.fullName,
                gender: formData.gender,
                dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
                phoneNumber: formData.phoneNumber
            };

            const res = await UserService.updateProfile(payload);
            if (res.success) {
                toast({ title: 'Cập nhật thành công', status: 'success' });
                localStorage.setItem("userName", formData.fullName || user.username);
                window.dispatchEvent(new Event("storage"));
                fetchProfile(); // Load lại data mới nhất từ server
            }
        } catch (error) {
            toast({ title: 'Cập nhật thất bại', description: error.response?.data?.message, status: 'error' });
        } finally {
            setUpdating(false);
        }
    };

    const handleChangePassword = async (passData, onSuccess) => {
        try {
            await UserService.changePassword(passData);
            toast({ title: 'Đổi mật khẩu thành công', status: 'success' });
            if (onSuccess) onSuccess(); // Gọi callback để reset form
        } catch (error) {
            toast({ title: 'Đổi mật khẩu thất bại', description: error.response?.data?.message, status: 'error' });
        }
    };

    // --- RENDER ---
    if (loading) return <Box textAlign="center" py={20}><Spinner size="xl" color="blue.500" /></Box>;

    return (
        <Container maxW="container.lg" py={10}>
            <Grid templateColumns={{ base: "1fr", md: "300px 1fr" }} gap={8}>
                {/* Component bên trái */}
                <VStack spacing={6} align="stretch">
                    <UserInfoCard user={user} onAvatarChange={handleAvatarChange} />
                </VStack>

                {/* Component bên phải (Tabs) */}
                <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
                    <Tabs variant="enclosed" colorScheme="blue">
                        <TabList mb={4}>
                            <Tab fontWeight="bold">Thông tin cá nhân</Tab>
                            <Tab fontWeight="bold">Đổi mật khẩu</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <GeneralInfoForm 
                                    initialData={user} 
                                    onSubmit={handleUpdateInfo} 
                                    isLoading={updating} 
                                />
                            </TabPanel>

                            <TabPanel>
                                <ChangePasswordForm 
                                    onSubmit={handleChangePassword} 
                                />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Grid>
        </Container>
    );
};

export default ProfilePage;