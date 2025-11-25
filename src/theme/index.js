import { extendTheme, theme as baseTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    apple: {
      // Dark mode colors
      bg: "#000000",
      card: "#1c1c1e",
      cardHover: "#2c2c2e",
      text: "#f5f5f7",
      subText: "#86868b",
      blue: "#2997ff",

      // Light mode colors
      lightBg: "#ffffff",
      lightCard: "#f5f5f7",
      lightCardHover: "#e8e8ed",
      lightText: "#1d1d1f",
      lightSubText: "#6e6e73",
    }
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'apple.bg' : 'apple.lightBg',
        color: props.colorMode === 'dark' ? 'apple.text' : 'apple.lightText',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
      },
      // Tự động style cho tất cả Box, Container
      '*': {
        borderColor: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200',
      },
    }),
  },
  components: {
    // Button component
    Button: {
      baseStyle: {
        borderRadius: "full",
        fontWeight: "medium",
      },
      variants: {
        solid: (props) => ({
          bg: props.colorMode === 'dark' ? 'apple.blue' : 'apple.blue',
          color: "white",
          _hover: {
            bg: "blue.500",
          },
        }),
        ghost: (props) => ({
          color: props.colorMode === 'dark' ? 'apple.text' : 'apple.lightText',
          _hover: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.100',
          },
        }),
      },
    },

    // Input component
    Input: {
      variants: {
        filled: (props) => ({
          field: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.100',
            color: props.colorMode === 'dark' ? 'white' : 'gray.800',
            _hover: {
              bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200',
            },
            _focus: {
              bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200',
              borderColor: 'apple.blue',
            },
          },
        }),
        outline: (props) => ({
          field: {
            borderColor: props.colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.300',
            color: props.colorMode === 'dark' ? 'white' : 'gray.800',
            _hover: {
              borderColor: props.colorMode === 'dark' ? 'whiteAlpha.400' : 'gray.400',
            },
            _focus: {
              borderColor: 'apple.blue',
              boxShadow: `0 0 0 1px ${baseTheme.colors.blue[500]}`,
            },
          },
        }),
      },
    },

    // Heading component
    Heading: {
      baseStyle: (props) => ({
        color: props.colorMode === 'dark' ? 'apple.text' : 'apple.lightText',
      }),
    },

    // Text component
    Text: {
      baseStyle: (props) => ({
        color: props.colorMode === 'dark' ? 'apple.text' : 'apple.lightText',
      }),
    },

    // Card/Box-like components
    Box: {
      baseStyle: (props) => ({
        color: props.colorMode === 'dark' ? 'apple.text' : 'apple.lightText',
      }),
    },

    // Form components
    FormLabel: {
      baseStyle: (props) => ({
        color: props.colorMode === 'dark' ? 'apple.text' : 'apple.lightText',
      }),
    },

    // Menu components
    Menu: {
      baseStyle: (props) => ({
        list: {
          bg: props.colorMode === 'dark' ? 'apple.card' : 'white',
          borderColor: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200',
        },
        item: {
          bg: 'transparent',
          color: props.colorMode === 'dark' ? 'white' : 'gray.800',
          _hover: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.100',
          },
        },
      }),
    },

    // Divider
    Divider: {
      baseStyle: (props) => ({
        borderColor: props.colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200',
      }),
    },
  },
});

export default theme;