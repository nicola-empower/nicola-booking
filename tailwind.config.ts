import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0f766e", // Deep Teal
                secondary: "#334155", // Slate
                accent: "#f59e0b", // Gold/Amber
                success: "#10b981",
                "text-main": "#1e293b",
                "text-muted": "#64748b",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
            backgroundImage: {
                "gradient-main": "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
            },
            backdropBlur: {
                glass: "12px",
            },
            boxShadow: {
                glass: "0 10px 40px rgba(0, 0, 0, 0.08)",
                card: "0 4px 12px rgba(0,0,0,0.04)",
                "card-hover": "0 8px 20px rgba(0,0,0,0.08)",
            },
            keyframes: {
                slideUp: {
                    from: { opacity: "0", transform: "translateY(20px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                fadeIn: {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
            },
            animation: {
                slideUp: "slideUp 0.4s ease",
                fadeIn: "fadeIn 0.5s ease",
            },
        },
    },
    plugins: [],
};
export default config;
