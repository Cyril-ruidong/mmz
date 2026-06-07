/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wasteland: '#2A1A0F',
        sand: '#C8A668',
        metal: '#6B6B6B',
        blood: '#B8232C',
        pixelGreen: '#5CAA48',
        pixelGold: '#E8C170',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', '"VT323"', 'monospace'],
      },
    },
  },
  plugins: [],
}
