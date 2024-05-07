import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'laptop': '1024px',
      'desktop': '1280px'
    },
    extend: {
      backgroundImage: {
        "cartoon": "url('/images/card-bg.jpg')",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      aspectRatio: {
        card: '3 / 4',
      },
    },
  },
  plugins: [],
};
export default config;
