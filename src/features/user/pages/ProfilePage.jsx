import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  VStack,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  useColorModeValue,
  Heading,
  Flex,
  Avatar,
  Text,
  Button,
  Icon,
} from "@chakra-ui/react";
import { FaUser, FaKey, FaCamera } from "react-icons/fa";
import UserService from "../../../services/user.service";
import GeneralInfoForm from "../components/GeneralInfoForm";
import ChangePasswordForm from "../components/ChangePasswordForm";
import { FaMapMarkerAlt } from "react-icons/fa";
import AddressBook from "../components/AddressBook";
const ProfilePage = () => {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Theme Colors (Fix: Đảm bảo màu sắc tương phản rõ ràng)
  const pageBg = useColorModeValue("gray.50", "gray.900"); // Nền trang tối hẳn
  const cardBg = useColorModeValue("white", "gray.800"); // Nền card xám đậm
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const textColor = useColorModeValue("gray.800", "white"); // Chữ đen/trắng tùy mode

  const fetchProfile = async () => {
    try {
      const res = await UserService.getProfile();
      if (res.success) setUser(res.data);
    } catch (error) {
      toast({ title: "Lỗi tải thông tin", status: "error" });
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
      toast({ title: "Cập nhật ảnh thành công", status: "success" });
      fetchProfile();
      window.dispatchEvent(new Event("auth-change"));
    } catch (error) {
      toast({ title: "Lỗi upload ảnh", status: "error" });
    }
  };

  const handleUpdateInfo = async (formData) => {
    try {
      let formattedDob = null;
      if (formData.dateOfBirth) {
         // Input type="date" always returns yyyy-mm-dd
         if (formData.dateOfBirth.includes('-')) {
             const [year, month, day] = formData.dateOfBirth.split('-');
             formattedDob = `${day}-${month}-${year}`;
         } else {
             formattedDob = formData.dateOfBirth;
         }
      }

      const payload = {
        ...user,
        ...formData,
        dateOfBirth: formattedDob,
      };
      await UserService.updateProfile(payload);
      toast({ title: "Đã lưu thay đổi", status: "success" });
      fetchProfile();
    } catch (error) {
      toast({ title: "Cập nhật thất bại", status: "error" });
    }
  };

  const handleChangePassword = async (passData, onSuccess) => {
    try {
      await UserService.changePassword(passData);
      toast({ title: "Đổi mật khẩu thành công", status: "success" });
      onSuccess();
    } catch (error) {
      toast({
        title: "Đổi mật khẩu thất bại",
        description: error.response?.data?.message,
        status: "error",
      });
    }
  };

  if (loading)
    return (
      <Flex justify="center" h="100vh" align="center" bg={pageBg}>
        <Spinner color="blue.500" />
      </Flex>
    );

  return (
    <Box bg={pageBg} minH="100vh" py={10} color={textColor}>
      <Container maxW="container.lg">
        <Grid templateColumns={{ base: "1fr", md: "300px 1fr" }} gap={8}>
          {/* LEFT: User Card */}
          <VStack
            bg={cardBg}
            p={8}
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
            spacing={4}
            align="center"
            boxShadow="lg"
          >
            <Box position="relative">
              <Avatar
                size="2xl"
                name={user?.fullName}
                src={user?.avatar}
                border="4px solid"
                borderColor="blue.500"
              />
              <Box
                position="absolute"
                bottom={0}
                right={0}
                bg="blue.500"
                p={2}
                borderRadius="full"
                cursor="pointer"
                _hover={{ bg: "blue.400" }}
                as="label"
                htmlFor="avatar-upload"
              >
                <Icon as={FaCamera} color="white" />
                <input
                  type="file"
                  id="avatar-upload"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </Box>
            </Box>
            <Heading size="md" color={textColor}>
              {user?.fullName || user?.username}
            </Heading>
            <Text color="gray.500">{user?.email}</Text>
            <Button w="full" variant="outline" colorScheme="blue" size="sm">
              Thành viên {user?.roleName}
            </Button>
          </VStack>

          {/* RIGHT: Forms */}
          <Box
            bg={cardBg}
            p={8}
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
            boxShadow="lg"
          >
            <Tabs variant="soft-rounded" colorScheme="blue">
              <TabList mb={6}>
                <Tab
                  _selected={{ color: "white", bg: "blue.500" }}
                  color={textColor}
                >
                  <Icon as={FaUser} mr={2} /> Thông tin chung
                </Tab>
                <Tab
                  _selected={{ color: "white", bg: "blue.500" }}
                  color={textColor}
                >
                  <Icon as={FaKey} mr={2} /> Bảo mật
                </Tab>

                {/* --- THÊM TAB NÀY --- */}
                <Tab
                  _selected={{ color: "white", bg: "blue.500" }}
                  color={textColor}
                >
                  <Icon as={FaMapMarkerAlt} mr={2} /> Sổ địa chỉ
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Heading size="md" mb={6} color={textColor}>
                    Thông tin cá nhân
                  </Heading>
                  <GeneralInfoForm
                    initialData={user}
                    onSubmit={handleUpdateInfo}
                  />
                </TabPanel>
                <TabPanel>
                  <Heading size="md" mb={6} color={textColor}>
                    Đổi mật khẩu
                  </Heading>
                  <ChangePasswordForm onSubmit={handleChangePassword} />
                </TabPanel>

                {/* --- THÊM PANEL NÀY --- */}
                <TabPanel>
                  <AddressBook />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage;
