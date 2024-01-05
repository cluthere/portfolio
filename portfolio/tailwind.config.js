/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    theme:{
      sm:'480px',
      md:'768px',
      lg: '1024px',
      xl: '1280px',
    },
    // fontSize: {
    //   base: '1rem',
    // },
    extend: {},
  },
  plugins: [],
}