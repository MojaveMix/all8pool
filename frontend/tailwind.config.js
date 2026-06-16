/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      colors: {
        primary: "#1a1a1a",
        secondary: "#2d2d2d",
        accent: "#00ff88",
        danger: "#ff4444",
        warning: "#ffbb33",
        success: "#00c851",
      },
    },
  },
  plugins: [],
}
