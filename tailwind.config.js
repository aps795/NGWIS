/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#051326',
          900: '#0B2545', // Primary Deep Navy
          800: '#133968',
          700: '#1D4E89',
          600: '#2862A3',
          50: '#F0F5FA',
        },
        academic: {
          900: '#1E293B',
          800: '#1E3A8A',
          700: '#1D4ED8',
          600: '#2563EB',
          500: '#3B82F6',
          100: '#DBEAFE',
          50: '#EFF6FF',
        },
        gold: {
          700: '#99730E',
          600: '#B48A18',
          500: '#D4AF37', // Accent Heritage Gold
          400: '#E6C65A',
          300: '#F3DE8A',
          200: '#F9ECC1',
          100: '#FEF9C3',
          50: '#FFFDF5',
        },
        slate: {
          850: '#151F32',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'academic': '0 4px 20px -2px rgba(11, 37, 69, 0.08), 0 2px 6px -1px rgba(11, 37, 69, 0.04)',
        'academic-lg': '0 10px 25px -3px rgba(11, 37, 69, 0.12), 0 4px 10px -2px rgba(11, 37, 69, 0.06)',
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.25)',
      },
    },
  },
  plugins: [],
}
