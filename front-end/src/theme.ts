import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      500: "#2D3748",
    },
    // Street Art Theme Colors
    streetArt: {
      primary: "#00D4FF",      // Electric blue
      secondary: "#FF6B35",    // Vibrant orange
      accent: "#39FF14",       // Neon green
      darkAccent: "#6A0DAD",   // Deep purple
      white: "#FFFFFF",
      black: "#000000",
      gray: "#2D3748",
      lightGray: "#E2E8F0"
    },
    // Dark Theme Colors
    dark: {
      50: "#1A202C",
      100: "#2D3748",
      200: "#4A5568",
      300: "#718096",
      400: "#A0AEC0",
      500: "#CBD5E0",
      600: "#E2E8F0",
      700: "#EDF2F7",
      800: "#F7FAFC",
      900: "#FFFFFF"
    }
  },
  fonts: {
    heading: `var(--font-jetbrains-mono), 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace`,
    body: `var(--font-inter), 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
    mono: `var(--font-jetbrains-mono), 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace`,
    tech: `var(--font-jetbrains-mono), 'JetBrains Mono', 'Fira Code', monospace`,
    display: `var(--font-inter), 'Inter', 'SF Pro Display', sans-serif`
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
    "8xl": "6rem",
    "9xl": "8rem",
  },
  components: {
    Heading: {
      baseStyle: {
        fontFamily: "heading",
        fontWeight: "bold",
        color: "white",
        textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
      },
      variants: {
        streetArt: {
          fontFamily: "'Permanent Marker', cursive",
          fontWeight: "900",
          textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
        },
        graffiti: {
          fontFamily: "'Permanent Marker', cursive",
          fontWeight: "900",
          textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
        },
        tech: {
          fontFamily: "tech",
          fontWeight: "bold",
          textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
        },
        urban: {
          fontFamily: "'Permanent Marker', cursive",
          fontWeight: "800",
          textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
        },
      },
      sizes: {
        h1: {
          fontSize: "4xl",
          lineHeight: "1.2",
        },
        h2: {
          fontSize: "3xl",
          lineHeight: "1.3",
        },
        h3: {
          fontSize: "2xl",
          lineHeight: "1.4",
        },
        h4: {
          fontSize: "xl",
          lineHeight: "1.5",
        },
      },
    },
    Button: {
      baseStyle: {
        fontWeight: "bold",
        borderRadius: "full",
        _hover: {
          transform: "translateY(-2px)",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        },
        _active: {
          transform: "translateY(0)",
        },
      },
      variants: {
        streetArt: {
          bg: "streetArt.primary",
          color: "white",
          _hover: {
            bg: "streetArt.secondary",
            boxShadow: "0 0 20px rgba(0, 212, 255, 0.6)",
          },
        },
        neon: {
          bg: "streetArt.accent",
          color: "black",
          _hover: {
            bg: "streetArt.darkAccent",
            color: "white",
            boxShadow: "0 0 30px rgba(57, 255, 20, 0.8)",
          },
        },
      },
    },
    Progress: {
      baseStyle: {
        track: {
          bg: "dark.200",
          borderRadius: "full",
        },
        filledTrack: {
          bg: "linear-gradient(90deg, #00D4FF 0%, #FF6B35 50%, #39FF14 100%)",
          borderRadius: "full",
        },
      },
    },
    ModalHeader: {
      baseStyle: {
        fontFamily: "tech",
        fontWeight: "bold",
        color: "white",
        textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "dark.50",
        color: "white",
      },
    },
  },
});

export default theme;
