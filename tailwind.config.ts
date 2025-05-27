import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      animation: {
        'gradient-shift': 'gradientShift 3s ease infinite',
        'sparkle': 'sparkle 2s linear infinite',
        'fall': 'fall linear infinite',
        'bounce': 'bounce 0.6s ease-in-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'diamond-spin': 'diamondSpin 3s linear infinite',
        'roll-up': 'rollUp 0.5s ease',
      },
      keyframes: {
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        sparkle: {
          '0%': { transform: 'translateX(-100%) translateY(-100%) rotate(45deg)' },
          '100%': { transform: 'translateX(100%) translateY(100%) rotate(45deg)' },
        },
        fall: {
          '0%': { transform: 'translateY(-100px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' },
        },
        pulseGold: {
          '0%': { boxShadow: '0 0 0 0 rgba(255, 215, 0, 0.7)' },
          '70%': { boxShadow: '0 0 0 20px rgba(255, 215, 0, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(255, 215, 0, 0)' },
        },
        diamondSpin: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        rollUp: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)', opacity: '0.5' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      fontFamily: {
        'mono': ['Courier New', 'Monaco', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config; 