// src/features/admin/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Heading, useColorModeValue, Flex, Icon, Text } from '@chakra-ui/react';
import { FaMoneyBillWave, FaShoppingCart, FaClock, FaTimesCircle } from 'react-icons/fa';
import AdminService from '../../../services/admin.service';
import { formatCurrency } from '../../../utils/format';

const StatCard = ({ label, number, helpText, icon, color }) => {
    // Style Card tối màu
    const bg = useColorModeValue('white', '#111'); 
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

    return (
        <Flex 
            bg={bg} p={6} borderRadius="2xl" 
            border="1px solid" borderColor={borderColor}
            align="center" justify="space-between"
            boxShadow="lg"
            transition="transform 0.2s"
            _hover={{ transform: "translateY(-5px)" }}
        >
            <Box>
                <Stat>
                    <StatLabel fontSize="sm" color="gray.500" fontWeight="bold">{label}</StatLabel>
                    <StatNumber fontSize="3xl" fontWeight="800" my={1} bgGradient={`linear(to-r, ${color}, white)`} bgClip="text" color={color}>
                        {number}
                    </StatNumber>
                    <StatHelpText mb={0} color="gray.400" fontSize="xs">{helpText}</StatHelpText>
                </Stat>
            </Box>
            <Box p={4} bg={`${color}20`} borderRadius="xl">
                <Icon as={icon} w={8} h={8} color={color} />
            </Box>
        </Flex>
    );
};

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const textColor = useColorModeValue("gray.800", "white");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await AdminService.getStatistics();
                if (res.success) setStats(res.data);
            } catch (error) {
                console.error("Lỗi lấy thống kê:", error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <Box p={6} color="white">Đang tải dữ liệu...</Box>;

    return (
        <Box>
            <Heading mb={8} size="lg" color={textColor}>Tổng quan kinh doanh</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                <StatCard 
                    label="DOANH THU" 
                    number={formatCurrency(stats.totalRevenue)} 
                    helpText="Tổng doanh thu thực tế"
                    icon={FaMoneyBillWave}
                    color="#48BB78" // Green
                />
                <StatCard 
                    label="ĐƠN HÀNG MỚI" 
                    number={stats.todayOrders} 
                    helpText="Đơn hàng trong hôm nay"
                    icon={FaShoppingCart}
                    color="#4299E1" // Blue
                />
                <StatCard 
                    label="CHỜ XỬ LÝ" 
                    number={stats.pendingOrders} 
                    helpText="Cần xác nhận ngay"
                    icon={FaClock}
                    color="#ECC94B" // Yellow
                />
                <StatCard 
                    label="ĐÃ HỦY" 
                    number={stats.cancelledOrders} 
                    helpText="Đơn bị hủy / Hoàn tiền"
                    icon={FaTimesCircle}
                    color="#F56565" // Red
                />
            </SimpleGrid>
        </Box>
    );
};

export default AdminDashboard;