/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF7E9',
          100: '#F7ECC8',
          200: '#EFD98E',
          300: '#E6C75A',
          400: '#D4AF37',
          500: '#B8932B',
          600: '#9A7A22',
          700: '#7A6019',
          800: '#5C4813',
          900: '#3D300C',
        },
        ink: {
          50: '#F8F8F8',
          100: '#EFEFEF',
          200: '#DADADA',
          300: '#B8B8B8',
          400: '#8A8A8A',
          500: '#5C5C5C',
          600: '#3D3D3D',
          700: '#262626',
          800: '#161616',
          900: '#0A0A0A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'Poppins', 'system-ui', 'sans-serif'],
        display: ['"SF Pro Display"', 'Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl2': '18px',
        'xl3': '22px',
      },
      boxShadow: {
        'soft': '0 6px 24px -10px rgba(0,0,0,0.12)',
        'glass': '0 8px 32px -12px rgba(0,0,0,0.25)',
        'lift': '0 20px 50px -20px rgba(0,0,0,0.35)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease forwards',
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.2s linear infinite',
        'ripple': 'ripple 0.6s ease-out',
        'slide-in': 'slideIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in': 'scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.6' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
