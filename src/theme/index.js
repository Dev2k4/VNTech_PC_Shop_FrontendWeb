// src/theme/index.js
import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    vntech: {
      50: '#E6FFFA',
      100: '#B2F5EA',
      500: '#319795', // Teal mặc định
      // Gradient chủ đạo: Xanh Neon -> Tím
      gradient: "linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)",
      gradientHover: "linear-gradient(135deg, #0072FF 0%, #00C6FF 100%)",
      darkBg: "#050505", // Đen sâu hơn
      cardBg: "#111111",
    }
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode('gray.50', 'vntech.darkBg')(props),
        color: mode('gray.800', 'whiteAlpha.900')(props),
        // Font hiện đại hơn cho công nghệ
        fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
      },
      // Tùy chỉnh thanh cuộn cho đẹp
      "::-webkit-scrollbar": {
        width: "8px",
      },
      "::-webkit-scrollbar-track": {
        background: mode("gray.100", "#111")(props),
      },
      "::-webkit-scrollbar-thumb": {
        background: mode("gray.400", "#444")(props),
        borderRadius: "4px",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: mode("blue.500", "blue.400")(props),
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
        borderRadius: "xl", // Bo góc mềm mại hơn
      },
      variants: {
        // Nút Brand (Gradient)
        brand: (props) => ({
          bgGradient: "linear(to-r, blue.400, purple.500)",
          color: "white",
          _hover: {
            bgGradient: "linear(to-r, blue.500, purple.600)",
            transform: "translateY(-2px)",
            boxShadow: "lg",
          },
          _active: {
            transform: "translateY(0)",
          },
          transition: "all 0.3s ease",
        }),
      },
    },
    // Card component (Container)
    Container: {
      baseStyle: {
        maxW: "container.xl",
      }
    }
  },
});

export default theme;