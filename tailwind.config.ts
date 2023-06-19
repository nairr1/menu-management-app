import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
        keyframes: {
            shimmer: {
                "100%": {
                    transform: "translateX(100%)",
                },
            },
        },
    },
  },
  plugins: [],
} satisfies Config;
