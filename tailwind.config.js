/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#202020',
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#3d3d3d',
          900: '#2b2b2b',
          950: '#202020',
        },
        cream: { DEFAULT: '#FFF9F0', dark: '#F7EEDF' },
        tomato: {
          DEFAULT: '#E64B3C',
          50: '#fdf3f2',
          100: '#fce4e2',
          200: '#facdc9',
          300: '#f5aaa3',
          400: '#ee7a6e',
          500: '#E64B3C',
          600: '#d13527',
          700: '#b0291d',
          800: '#91261c',
          900: '#78251d',
        },
        olive: {
          DEFAULT: '#64734B',
          50: '#f5f7f1',
          100: '#e8ecdf',
          200: '#d2dbc1',
          300: '#b3c29a',
          400: '#94a776',
          500: '#788c59',
          600: '#64734B',
          700: '#4c5839',
          800: '#3f4831',
          900: '#363e2c',
        },
        beige: { DEFAULT: '#EDE3D5', dark: '#E0D2BE' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -6px rgba(32, 32, 32, 0.10)',
        lift: '0 18px 40px -12px rgba(32, 32, 32, 0.22)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
