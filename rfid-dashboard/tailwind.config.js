/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-glow': 'linear-gradient(135deg, rgba(0,255,255,0.2), rgba(255,0,255,0.2))',
      },
      boxShadow: {
        glow: '0 0 20px rgba(255, 255, 255, 0.3)',
      },
    },
  },
  plugins: [],
}
