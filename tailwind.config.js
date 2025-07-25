/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF3F6C',
          50: '#FFE5EA',
          100: '#FFCCDA',
          200: '#FF99B5',
          300: '#FF6690',
          400: '#FF3F6C',
          500: '#FF0040',
          600: '#CC0033',
          700: '#990026',
          800: '#660019',
          900: '#33000D'
        },
        secondary: {
          DEFAULT: '#282C3F',
          50: '#F5F5F6',
          100: '#EAEAEC',
          200: '#D5D5D9',
          300: '#C0C0C6',
          400: '#ABABB3',
          500: '#9696A0',
          600: '#57596B',
          700: '#3A3D52',
          800: '#282C3F',
          900: '#1C1F2E'
        },
        accent: {
          DEFAULT: '#FF9F00',
          50: '#FFF5E6',
          100: '#FFEBCC',
          200: '#FFD799',
          300: '#FFC366',
          400: '#FFAF33',
          500: '#FF9F00',
          600: '#CC7F00',
          700: '#995F00',
          800: '#664000',
          900: '#332000'
        }
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      animation: {
        'heart-fill': 'heartFill 0.3s ease-in-out',
        'cart-bounce': 'cartBounce 0.5s ease-in-out',
        'scale-up': 'scaleUp 0.2s ease-out'
      },
      keyframes: {
        heartFill: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' }
        },
        cartBounce: {
          '0%, 20%, 60%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '80%': { transform: 'translateY(-5px)' }
        },
        scaleUp: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' }  
        }
      }
    },
  },
  plugins: [],
}