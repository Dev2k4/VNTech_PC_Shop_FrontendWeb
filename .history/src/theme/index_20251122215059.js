import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark', // Mặc định Dark Mode
    useSystemColorMode: false, // Không phụ thuộc vào máy, ép luôn Dark
  },
  colors: {
    // Bảng màu Apple Dark
    apple: {
      bg: "#000000",       // Nền trang web (Đen tuyền)
      card: "#1c1c1e",     // Nền thẻ sản phẩm (Xám đậm)
      cardHover: "#2c2c2e", // Nền thẻ khi di chuột
      text: "#f5f5f7",     // Chữ chính (Trắng ngà)
      subText: "#86868b",  // Chữ phụ (Xám)
      blue: "#2997ff",     // Màu xanh Apple (Link/Button)
    }
  },
  styles: {
    global: {
      body: {
        bg: "apple.bg",
        color: "apple.text",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "full", // Nút tròn như viên thuốc
        fontWeight: "medium",
      },
      variants: {
        solid: {
          bg: "apple.blue",
          color: "white",
          _hover: {
            bg: "blue.500",
          },
        },
      },
    },
  },
});

export default theme;