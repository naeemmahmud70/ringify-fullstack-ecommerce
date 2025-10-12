import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: '320px', 
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      backgroundImage: {
        "custom-gradient": "linear-gradient(90deg, #959595 0%, #202020 100%)", // Adjust the second color as needed
      },
      backdropBlur: {
        "48": "48px",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"], // Poppins font
        mulish: ["Mulish", "sans-serif"], // Mulish font
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "green-custom": "#25B021", // Custom Green
        "yellow-custom": "#FFF876", // Custom Yellow
      },
      fontSize: {
        xxl: "82px", // Extra Extra Large
        xl: "72px", // Extra Large
        lg: "62px", // Large
        "lg-md": "52px", // Large Medium
        md: "48px", // Medium
        "lg-sm": "40px", // Large Small
        "sm-lg": "36px", // Small Large
        "sm-md": "34px", // small Medium
        sm: "30px", // Small
        "base-lg": "24px", // Base Large
        "base-md": "28px", // Base Medium
        base: "20px", // Base
        "sm-xs": "18px", // Small Extra Small
        xs: "16px", // Extra Small
      },
      width: {
        xs: "108px", // Custom width for 108px
        sm: "165.95px",
        "sm-md": "277px",
        "sm-lg": "554px",
        "md-lg": "584px",
        lg: "850px",
        xlg: "1148px",
      },
      padding: {
        sm: "34px", // Small padding of 34 pixels
        lg: "129px", // Large padding of 129 pixels
      },
      height: {
        "s-sm": "27px",
        xsm: "67.57px",
        "xsm-sm": "277px",
        "xsm-lg": "398px",
        sm: "412px",
        "sm-lg": "148px",
        "lg-sm": "864px",
        lg: "969px",
      },
      animation: {
        scroll: "scroll 30s linear infinite",
        topScroll: "topScroll 30s linear infinite",
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        topScroll: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
      },
    },
  },

  plugins: [],
};
export default config;
