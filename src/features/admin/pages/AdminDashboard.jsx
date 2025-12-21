// src/features/admin/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import {
    Box,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Heading,
    useColorModeValue,
    Flex,
    Icon,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Spinner,
    Select,
    HStack,
    Image,
    Badge,
} from '@chakra-ui/react';
import {
    FiDollarSign,
    FiShoppingBag,
    FiUsers,
    FiActivity,
} from 'react-icons/fi';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import StatisticsService from '../../../services/statisticsService';
import { formatCurrency } from '../../../utils/format';

const StatCard = ({ label, number, helpText, icon, color }) => {
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

    return (
        <Flex
            bg={bg}
            p={6}
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
            align="center"
            justify="space-between"
            boxShadow="sm"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
        >
            <Box>
                <Stat>
                    <StatLabel fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">
                        {label}
                    </StatLabel>
                    <StatNumber fontSize="2xl" fontWeight="800" my={1} color={color}>
                        {number}
                    </StatNumber>
                    <StatHelpText mb={0} color="gray.400" fontSize="xs">
                        {helpText}
                    </StatHelpText>
                </Stat>
            </Box>
            <Box p={4} bg={`${color}15`} borderRadius="xl">
                <Icon as={icon} w={6} h={6} color={color} />
            </Box>
        </Flex>
    );
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const STATUS_MAP = {
    'PENDING': { label: 'Chờ xác nhận', color: '#FEAF00' },
    'CONFIRMED': { label: 'Đã xác nhận', color: '#0088FE' },
    'PROCESSING': { label: 'Đang xử lý', color: '#3182CE' },
    'SHIPPING': { label: 'Đang giao hàng', color: '#FFBB28' },
    'DELIVERED': { label: 'Đã giao hàng', color: '#48BB78' },
    'CANCELLED': { label: 'Đã hủy', color: '#F56565' },
    'RETURNED': { label: 'Đã trả hàng', color: '#805AD5' },
    'REFUNDED': { label: 'Đã hoàn tiền', color: '#718096' }
};

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(new Date().getFullYear());
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        pendingOrders: 0,
        monthlyRevenue: [],
        ordersByStatus: [],
        topProducts: [],
        newUsersMonthly: [],
    });

    const textColor = useColorModeValue('gray.800', 'white');
    const noteColor = useColorModeValue('gray.600', 'gray.400');
    const cardBg = useColorModeValue('white', 'gray.800');

    useEffect(() => {
        const fetchAllStats = async () => {
            setLoading(true);
            try {
                const [
                    revenueRes,
                    ordersRes,
                    customersRes,
                    pendingRes,
                    monthlyRevenueRes,
                    ordersStatusRes,
                    topProductsRes,
                    newUsersRes,
                ] = await Promise.all([
                    StatisticsService.getTotalRevenue(),
                    StatisticsService.getTotalOrders(),
                    StatisticsService.getTotalCustomers(),
                    StatisticsService.getPendingOrders(),
                    StatisticsService.getMonthlyRevenue(year),
                    StatisticsService.getOrdersByStatus(),
                    StatisticsService.getTopSellingProducts(),
                    StatisticsService.getMonthlyNewUsers(year),
                ]);

                // Map status names for PieChart
                const mappedOrdersByStatus = (ordersStatusRes || []).map(item => ({
                    ...item,
                    originalStatus: item.status,
                    status: (STATUS_MAP[item.status]?.label || item.status),
                    color: (STATUS_MAP[item.status]?.color || '#CBD5E0')
                }));

                setStats({
                    totalRevenue: revenueRes.value || 0,
                    totalOrders: ordersRes.value || 0,
                    totalCustomers: customersRes.value || 0,
                    pendingOrders: pendingRes.value || 0,
                    monthlyRevenue: monthlyRevenueRes || [],
                    ordersByStatus: mappedOrdersByStatus,
                    topProducts: topProductsRes || [],
                    newUsersMonthly: newUsersRes || [],
                });
            } catch (error) {
                console.error('Error fetching statistics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllStats();
    }, [year]);

    if (loading) {
        return (
            <Flex justify="center" align="center" minH="400px">
                <Spinner size="xl" color="blue.500" thickness="4px" />
                <Text ml={4} fontWeight="medium" color="gray.500">Đang tải dữ liệu thống kê...</Text>
            </Flex>
        );
    }

    return (
        <Box p={4}>
            <Flex justify="space-between" align="center" mb={10}>
                <Heading size="lg" color={textColor}>
                    Báo Cáo Tổng Quan
                </Heading>
                <HStack>
                    <Text fontWeight="600" fontSize="sm">Năm:</Text>
                    <Select
                        size="sm"
                        w="120px"
                        borderRadius="md"
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                    >
                        {[...Array(5)].map((_, i) => (
                            <option key={i} value={new Date().getFullYear() - i}>
                                {new Date().getFullYear() - i}
                            </option>
                        ))}
                    </Select>
                </HStack>
            </Flex>

            {/* Summary Cards */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={10}>
                <StatCard
                    label="Doanh Thu Tổng"
                    number={formatCurrency(stats.totalRevenue)}
                    helpText="Tổng lũy kế từ trước đến nay"
                    icon={FiDollarSign}
                    color="green.500"
                />
                <StatCard
                    label="Tổng Đơn Hàng"
                    number={stats.totalOrders}
                    helpText="Số lượng đơn hàng đã nhận"
                    icon={FiShoppingBag}
                    color="blue.500"
                />
                <StatCard
                    label="Khách Hàng"
                    number={stats.totalCustomers}
                    helpText="Số lượng người dùng đăng ký"
                    icon={FiUsers}
                    color="purple.500"
                />
                <StatCard
                    label="Đơn Chờ Xử Lý"
                    number={stats.pendingOrders}
                    helpText="Cần xử lý ngay lập tức"
                    icon={FiActivity}
                    color="orange.500"
                />
            </SimpleGrid>

            {/* Charts Section 1 */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={10}>
                <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="sm" height="420px">
                    <Heading size="md" mb={1} fontSize="lg">Doanh Thu Hàng Tháng</Heading>
                    <Text fontSize="xs" color={noteColor} mb={5}>Biểu đồ thể hiện tổng doanh thu đạt được qua các tháng trong năm {year}.</Text>
                    <ResponsiveContainer width="100%" height="75%">
                        <BarChart data={stats.monthlyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `${val / 1000000}M`} />
                            <Tooltip
                                formatter={(value) => formatCurrency(value)}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="revenue" fill="#3182CE" radius={[4, 4, 0, 0]} name="Doanh thu" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>

                <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="sm" height="420px">
                    <Heading size="md" mb={1} fontSize="lg">Người Dùng Mới</Heading>
                    <Text fontSize="xs" color={noteColor} mb={5}>Thống kê số lượng khách hàng mới đăng ký tài khoản theo từng tháng trong năm {year}.</Text>
                    <ResponsiveContainer width="100%" height="75%">
                        <LineChart data={stats.newUsersMonthly}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#805AD5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Người dùng mới" />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </SimpleGrid>

            {/* Charts Section 2 & Top Products */}
            <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
                <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="sm" height="480px">
                    <Heading size="md" mb={1} fontSize="lg">Trạng Thái Đơn Hàng</Heading>
                    <Text fontSize="xs" color={noteColor} mb={5}>Phân bổ các đơn hàng theo trạng thái xử lý trong hệ thống.</Text>
                    <ResponsiveContainer width="100%" height="75%">
                        <PieChart>
                            <Pie
                                data={stats.ordersByStatus}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="count"
                                nameKey="status"
                            >
                                {stats.ordersByStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </Box>

                <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="sm" height="480px" gridColumn={{ lg: '2 / 4' }}>
                    <Heading size="md" mb={1} fontSize="lg">Sản Phẩm Bán Chạy</Heading>
                    <Text fontSize="xs" color={noteColor} mb={5}>Top 5 sản phẩm có doanh số và doanh thu cao nhất của cửa hàng.</Text>
                    <Box overflowY="auto" maxH="350px">
                        <Table variant="simple" size="sm">
                            <Thead position="sticky" top={0} bg={cardBg} zIndex={1}>
                                <Tr>
                                    <Th>Sản phẩm</Th>
                                    <Th isNumeric>Số lượng</Th>
                                    <Th isNumeric>Doanh thu</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {stats.topProducts.map((product) => (
                                    <Tr key={product.productId}>
                                        <Td>
                                            <Flex align="center">
                                                <Image
                                                    src={product.mainImage || '/placeholder.png'}
                                                    fallbackSrc="https://via.placeholder.com/40"
                                                    boxSize="40px"
                                                    borderRadius="md"
                                                    mr={3}
                                                    objectFit="cover"
                                                />
                                                <Box>
                                                    <Text fontWeight="600" noOfLines={1} fontSize="sm">{product.productName}</Text>
                                                    <Badge colorScheme="blue" fontSize="2xs">#{product.productId}</Badge>
                                                </Box>
                                            </Flex>
                                        </Td>
                                        <Td isNumeric fontWeight="600">{product.soldCount}</Td>
                                        <Td isNumeric fontWeight="700" color="green.500">
                                            {formatCurrency(product.revenue)}
                                        </Td>
                                    </Tr>
                                ))}
                                {stats.topProducts.length === 0 && (
                                    <Tr>
                                        <Td colSpan={3} textAlign="center" py={10} color="gray.500">
                                            Chưa có dữ liệu sản phẩm bán chạy
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    </Box>
                </Box>
            </SimpleGrid>
        </Box>
    );
};

export default AdminDashboard;
