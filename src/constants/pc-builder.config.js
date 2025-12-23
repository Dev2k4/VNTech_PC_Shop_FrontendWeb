import { FaMicrochip, FaMemory, FaHdd, FaDesktop, FaPlug, FaFan } from 'react-icons/fa';
import { BsGpuCard, BsMotherboard } from 'react-icons/bs';

// 🔥 QUAN TRỌNG: Bạn hãy vào Database, xem bảng `categories` 
// và điền ID thực tế của từng loại linh kiện vào đây nhé!
export const BUILD_SLOTS = [
    { 
        key: 'cpu', 
        name: 'Vi xử lý (CPU)', 
        categoryId: 1, // Sửa số này theo DB của bạn
        icon: FaMicrochip, 
        required: true,
        checkKey: 'Socket' // Key trong specifications để check tương thích
    },
    { 
        key: 'mainboard', 
        name: 'Bo mạch chủ (Mainboard)', 
        categoryId: 2, 
        icon: BsMotherboard, 
        required: true,
        checkKey: 'Socket' 
    },
    { 
        key: 'ram', 
        name: 'Bộ nhớ trong (RAM)', 
        categoryId: 3, 
        icon: FaMemory, 
        required: true 
    },
    { 
        key: 'vga', 
        name: 'Card màn hình (VGA)', 
        categoryId: 4, 
        icon: BsGpuCard, 
        required: false 
    },
    { 
        key: 'ssd', 
        name: 'Ổ cứng (SSD/HDD)', 
        categoryId: 5, 
        icon: FaHdd, 
        required: true 
    },
    { 
        key: 'psu', 
        name: 'Nguồn (PSU)', 
        categoryId: 6, 
        icon: FaPlug, 
        required: true 
    },
    { 
        key: 'case', 
        name: 'Vỏ máy tính (Case)', 
        categoryId: 7, 
        icon: FaDesktop, 
        required: true 
    },
    { 
        key: 'cooling', 
        name: 'Tản nhiệt', 
        categoryId: 8, 
        icon: FaFan, 
        required: false 
    }
];