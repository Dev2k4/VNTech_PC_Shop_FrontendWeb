import React, { useEffect, useState } from 'react';
import { Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Heading, useColorModeValue } from '@chakra-ui/react';
import AdminService from '../../../services/admin.service';
import { formatCurrency } from '../../../utils/format';

const StatCard = ({ label, number, helpText, color }) => {
    const bg = useColorModeValue('white', 'gray.800');
    return (
        <Box bg={bg} p={6} borderRadius="lg" shadow="sm" borderLeft="4px solid" borderColor={color}>
            <Stat>
                <StatLabel fontSize="lg" color="gray.500">{label}</StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold" my={2}>{number}</StatNumber>
                <StatHelpText mb={0}>{helpText}</StatHelpText>
            </Stat>
        </Box>
    );
};

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);

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

    if (!stats) return <Box p={6}>Đang tải dữ liệu...</Box>;

    return (
        <Box>
            <Heading mb={6} size="lg">Tổng quan kinh doanh</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                <StatCard 
                    label="Doanh thu" 
                    number={formatCurrency(stats.totalRevenue)} 
                    helpText="Tổng doanh thu toàn thời gian"
                    color="green.500"
                />
                <StatCard 
                    label="Đơn hôm nay" 
                    number={stats.todayOrders} 
                    helpText="Số lượng đơn mới"
                    color="blue.500"
                />
                <StatCard 
                    label="Chờ xử lý" 
                    number={stats.pendingOrders} 
                    helpText="Cần xác nhận gấp"
                    color="orange.500"
                />
                <StatCard 
                    label="Đã hủy" 
                    number={stats.cancelledOrders} 
                    helpText="Số đơn bị hủy"
                    color="red.500"
                />
            </SimpleGrid>
        </Box>
    );
};

export default AdminDashboard;