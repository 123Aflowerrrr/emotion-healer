/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#fefcf9', 100: '#fdf6ed', 200: '#fae8d4', 300: '#f5d5b0',
          400: '#edb980', 500: '#e39c58', 600: '#d4803d', 700: '#b0682e',
          800: '#8e5429', 900: '#734625',
        },
        calm: {
          50: '#f7f9fb', 100: '#edf2f7', 200: '#d9e4ef', 300: '#b7cde3',
          400: '#8eafd3', 500: '#6d92c2', 600: '#5578b0', 700: '#48659a',
          800: '#3e547e', 900: '#364766',
        },
        forest: {
          50: '#f2f7f2', 100: '#e0ece0', 200: '#c2d9c2', 300: '#96bf98',
          400: '#6aa16d', 500: '#4a854f', 600: '#376b3c', 700: '#2c5531',
          800: '#254428', 900: '#1f3822',
        },
        ocean: {
          50: '#f2f7fb', 100: '#e4eef7', 200: '#c5dcef', 300: '#94c1e3',
          400: '#5da1d3', 500: '#3a85be', 600: '#2a6ba0', 700: '#245682',
          800: '#21486c', 900: '#1f3d5b',
        },
        sunset: {
          50: '#fdf8f5', 100: '#fbeddf', 200: '#f6d8be', 300: '#eeb994',
          400: '#e59264', 500: '#dd7342', 600: '#c85b33', 700: '#a6482c',
          800: '#863b29', 900: '#6d3325',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        cute: ['"ZCOOL KuaiLe"', '"Noto Sans SC"', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'breathe': 'breathe 8s ease-in-out infinite',
        'sway': 'sway 12s ease-in-out infinite',
        'sway-fast': 'sway 5s ease-in-out infinite',
        'firefly': 'firefly 4s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'drift': 'drift 20s ease-in-out infinite',
        'rain': 'rain 1.5s linear infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 0.5s ease-in-out',
        'heart-float': 'heartFloat 2s ease-out forwards',
        'cursor-blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        breathe: { '0%, 100%': { transform: 'scale(1)', opacity: '0.9' }, '50%': { transform: 'scale(1.02)', opacity: '1' } },
        sway: { '0%, 100%': { transform: 'rotate(0deg)' }, '25%': { transform: 'rotate(0.5deg)' }, '75%': { transform: 'rotate(-0.5deg)' } },
        firefly: { '0%, 100%': { opacity: '0.2', transform: 'scale(1)' }, '50%': { opacity: '1', transform: 'scale(1.5)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
        drift: { '0%, 100%': { transform: 'translateX(0) translateY(0)' }, '25%': { transform: 'translateX(10px) translateY(-5px)' }, '50%': { transform: 'translateX(5px) translateY(-10px)' }, '75%': { transform: 'translateX(-5px) translateY(-5px)' } },
        rain: { '0%': { transform: 'translateY(-100%)', opacity: '0' }, '10%': { opacity: '0.6' }, '90%': { opacity: '0.4' }, '100%': { transform: 'translateY(100vh)', opacity: '0' } },
        sparkle: { '0%, 100%': { opacity: '0', transform: 'scale(0)' }, '50%': { opacity: '1', transform: 'scale(1)' } },
        bounceGentle: { '0%, 100%': { transform: 'translateY(0)' }, '30%': { transform: 'translateY(-15px)' }, '50%': { transform: 'translateY(0)' }, '70%': { transform: 'translateY(-7px)' } },
        heartFloat: { '0%': { opacity: '1', transform: 'translateY(0) scale(1)' }, '100%': { opacity: '0', transform: 'translateY(-60px) scale(1.5)' } },
        blink: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0' } },
      },
    },
  },
  plugins: [],
}
