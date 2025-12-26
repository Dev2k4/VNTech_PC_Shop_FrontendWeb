import { FaMicrochip, FaMemory, FaHdd, FaDesktop, FaPlug, FaFan } from 'react-icons/fa';
import { BsGpuCard, BsMotherboard } from 'react-icons/bs';

export const BUILD_SLOTS = [
    { 
        key: 'cpu', 
        name: 'Vi xử lý (CPU)', 
        categoryKeyword: 'CPU', // Tìm tất cả danh mục có chữ "CPU"
        icon: FaMicrochip, 
        required: true,
        checkKey: 'Socket' 
    },
    { 
        key: 'mainboard', 
        name: 'Bo mạch chủ', 
        categoryKeyword: 'Mainboard', // Tìm tất cả danh mục có chữ "Mainboard"
        icon: BsMotherboard, 
        required: true,
        checkKey: 'Socket' 
    },
    { 
        key: 'ram', 
        name: 'RAM', 
        categoryKeyword: 'RAM', 
        icon: FaMemory, 
        required: true 
    },
    { 
        key: 'vga', 
        name: 'VGA', 
        categoryKeyword: 'VGA', // Hoặc 'Card' tùy tên trong DB bạn
        icon: BsGpuCard, 
        required: false 
    },
    { 
        key: 'ssd', 
        name: 'Ổ cứng SSD', 
        categoryKeyword: 'SSD', 
        icon: FaHdd, 
        required: true 
    },
    { 
        key: 'psu', 
        name: 'Nguồn', 
        categoryKeyword: 'Nguồn', 
        icon: FaPlug, 
        required: true 
    },
    { 
        key: 'case', 
        name: 'Vỏ Case', 
        categoryKeyword: 'Case', // Hoặc 'Vỏ'
        icon: FaDesktop, 
        required: true 
    },
    { 
        key: 'cooler', 
        name: 'Tản nhiệt', 
        categoryKeyword: 'Tản', 
        icon: FaFan, 
        required: false 
    }
];