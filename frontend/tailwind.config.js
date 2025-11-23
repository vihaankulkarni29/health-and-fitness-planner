/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
        './app/**/*.{js,jsx}',
        './src/**/*.{js,jsx}',
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "#CD1C18",
                    50: "#FFF5F5",
                    100: "#FFE3E3",
                    200: "#FFC7C7",
                    300: "#FFA896",
                    400: "#FF7A75",
                    500: "#CD1C18",
                    600: "#9B1313",
                    700: "#7A0F0F",
                    800: "#5C0B0B",
                    900: "#38000A",
                    950: "#1F0005",
                    foreground: "#FFFFFF",
                },
                secondary: {
                    DEFAULT: "#1E293B",
                    50: "#F8FAFC",
                    100: "#F1F5F9",
                    200: "#E2E8F0",
                    300: "#CBD5E1",
                    400: "#94A3B8",
                    500: "#64748B",
                    600: "#475569",
                    700: "#334155",
                    800: "#1E293B",
                    900: "#0F172A",
                    950: "#020617",
                    foreground: "#FFFFFF",
                },
                accent: {
                    DEFAULT: "#3B82F6",
                    50: "#EFF6FF",
                    100: "#DBEAFE",
                    200: "#BFDBFE",
                    300: "#93C5FD",
                    400: "#60A5FA",
                    500: "#3B82F6",
                    600: "#2563EB",
                    700: "#1D4ED8",
                    800: "#1E40AF",
                    900: "#1E3A8A",
                    950: "#172554",
                    foreground: "#FFFFFF",
                },
                success: {
                    DEFAULT: "#10B981",
                    50: "#ECFDF5",
                    100: "#D1FAE5",
                    200: "#A7F3D0",
                    300: "#6EE7B7",
                    400: "#34D399",
                    500: "#10B981",
                    600: "#059669",
                    700: "#047857",
                    800: "#065F46",
                    900: "#064E3B",
                },
                warning: {
                    DEFAULT: "#F59E0B",
                    50: "#FFFBEB",
                    100: "#FEF3C7",
                    200: "#FDE68A",
                    300: "#FCD34D",
                    400: "#FBBF24",
                    500: "#F59E0B",
                    600: "#D97706",
                    700: "#B45309",
                    800: "#92400E",
                    900: "#78350F",
                },
                error: {
                    DEFAULT: "#EF4444",
                    50: "#FEF2F2",
                    100: "#FEE2E2",
                    200: "#FECACA",
                    300: "#FCA5A5",
                    400: "#F87171",
                    500: "#EF4444",
                    600: "#DC2626",
                    700: "#B91C1C",
                    800: "#991B1B",
                    900: "#7F1D1D",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                navbar: {
                    light: {
                        bg: "rgb(255 255 255 / 0.8)",
                        border: "rgb(229 231 235)",
                        text: "rgb(17 24 39)",
                        hover: "rgb(243 244 246)"
                    },
                    dark: {
                        bg: "rgb(11 12 15 / 0.8)",
                        border: "rgb(22 24 29)",
                        text: "rgb(255 255 255)",
                        hover: "rgb(22 24 29)"
                    }
                }
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "navbar-slide-down": {
                    "0%": { transform: "translateY(-100%)" },
                    "100%": { transform: "translateY(0)" }
                },
                "navbar-dropdown": {
                    "0%": {
                        opacity: "0",
                        transform: "rotateX(-12deg) scale(0.9)"
                    },
                    "100%": {
                        opacity: "1",
                        transform: "rotateX(0) scale(1)"
                    }
                }
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "navbar-slide-down": "navbar-slide-down 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "navbar-dropdown": "navbar-dropdown 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            },
            backdropBlur: {
                navbar: "10px"
            }
        },
    },
    plugins: [require("tailwindcss-animate")],
}
