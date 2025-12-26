// src/constants/category.config.js
import { FaMicrochip, FaMemory, FaHdd, FaDesktop, FaPlug, FaFan, FaKeyboard, FaHeadphones } from 'react-icons/fa';
import { BsGpuCard, BsMotherboard } from 'react-icons/bs';
import { GiComputerFan } from 'react-icons/gi';

// ĐÂY LÀ CHỖ BẠN CẦN ĐIỀN ID TỪ DATABASE VÀO
// Ví dụ: Trong DB, "CPU Intel" có id=1, "CPU AMD" có id=2 => children: [{id: 1, name: 'Intel'}, {id: 2, name: 'AMD'}]

export const MAIN_CATEGORIES = [
    {
        key: 'cpu',
        name: 'Vi xử lý (CPU)',
        icon: FaMicrochip,
        // Điền các ID danh mục con thực tế trong DB vào mảng children
        children: [
            { id: 1, name: 'Intel Core i3' }, // <--- Thay ID thật vào đây
            { id: 2, name: 'Intel Core i5' },
            { id: 3, name: 'AMD Ryzen 5' },
        ]
    },
    {
        key: 'mainboard',
        name: 'Bo mạch chủ (Mainboard)',
        icon: BsMotherboard,
        children: [
            { id: 4, name: 'Mainboard ASUS' }, // <--- Thay ID thật
            { id: 5, name: 'Mainboard MSI' },
            { id: 6, name: 'Mainboard Gigabyte' },
        ]
    },
    {
        key: 'ram',
        name: 'Bộ nhớ trong (RAM)',
        icon: FaMemory,
        children: [
            { id: 7, name: 'RAM DDR4' }, 
            { id: 8, name: 'RAM DDR5' },
        ]
    },
    {
        key: 'vga',
        name: 'Card màn hình (VGA)',
        icon: BsGpuCard,
        children: [
            { id: 9, name: 'NVIDIA RTX' },
            { id: 10, name: 'AMD Radeon' },
        ]
    },
    {
        key: 'ssd',
        name: 'Ổ cứng (SSD/HDD)',
        icon: FaHdd,
        children: [
            { id: 11, name: 'SSD NVMe' },
            { id: 12, name: 'HDD' },
        ]
    },
    {
        key: 'psu',
        name: 'Nguồn máy tính (PSU)',
        icon: FaPlug,
        children: [
            { id: 13, name: 'Nguồn 500W-650W' },
            { id: 14, name: 'Nguồn 750W+' },
        ]
    },
    {
        key: 'cooler',
        name: 'Tản nhiệt (Cooler)',
        icon: FaFan,
        children: [
            { id: 15, name: 'Tản khí' },
            { id: 16, name: 'Tản nước AIO' },
        ]
    },
    {
        key: 'case',
        name: 'Vỏ máy tính (Case)',
        icon: FaDesktop,
        children: [
            { id: 17, name: 'Case Mid Tower' },
            { id: 18, name: 'Case Mini ITX' },
        ]
    },
];