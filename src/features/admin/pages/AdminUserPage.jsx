import React, { useEffect, useState } from 'react';
import {
    Box, Button, Table, Thead, Tbody, Tr, Th, Td, IconButton, Avatar, Badge,
    useToast, Heading, Flex, useColorModeValue
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import AdminService from '../../../services/admin.service';

const AdminUserPage = () => {
    const [users, setUsers] = useState([]);
    const toast = useToast();
    const bg = useColorModeValue('white', 'gray.800');

    const fetchUsers = async () => {
        try {
            const res = await AdminService.getAllUsers();
            if (res.success) setUsers(res.data);
        } catch (error) {
            toast({ title: 'Lỗi tải danh sách user', status: 'error' });
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;
        try {
            await AdminService.deleteUser(id);
            toast({ title: 'Đã xóa người dùng', status: 'success' });
            fetchUsers();
        } catch (error) {
            toast({ title: 'Lỗi xóa người dùng', description: 'Không thể xóa user này', status: 'error' });
        }
    };

    return (
        <Box bg={bg} p={6} borderRadius="lg" shadow="sm">
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="md">Quản lý Người dùng</Heading>
                {/* Nút thêm mới có thể dẫn tới trang Register hoặc mở Modal nếu cần */}
            </Flex>

            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Avatar</Th>
                        <Th>Họ tên</Th>
                        <Th>Email</Th>
                        <Th>Vai trò</Th>
                        <Th>Trạng thái</Th>
                        <Th>Hành động</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {users.map((user) => (
                        <Tr key={user.id}>
                            <Td><Avatar size="sm" src={user.avatar} name={user.fullName} /></Td>
                            <Td fontWeight="bold">{user.fullName || user.username}</Td>
                            <Td>{user.email}</Td>
                            <Td>
                                <Badge colorScheme={user.roleName === 'ADMIN' ? 'red' : 'blue'}>
                                    {user.roleName}
                                </Badge>
                            </Td>
                            <Td>
                                <Badge colorScheme={user.active ? 'green' : 'gray'}>
                                    {user.active ? 'Active' : 'Locked'}
                                </Badge>
                            </Td>
                            <Td>
                                <IconButton
                                    icon={<DeleteIcon />}
                                    colorScheme="red"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteUser(user.id)}
                                    isDisabled={user.roleName === 'ADMIN'} // Không cho xóa Admin khác
                                />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default AdminUserPage;