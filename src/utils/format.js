// File: src/utils/format.js

export const formatCurrency = (amount) => {
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

// --- HÀM MỚI ĐƯỢC THÊM VÀO ---
export const formatDate = (dateString) => {
    if (!dateString) return "";
    
    // Giả định ngày tháng từ BE trả về dạng ISO (ví dụ: 2025-07-15T12:00:00)
    try {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return dateString; // Trả về dạng gốc nếu có lỗi format
    }
};