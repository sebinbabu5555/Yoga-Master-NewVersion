/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary – Midnight Navy
        'navy':      '#101828',
        'navy-800':  '#1D2939',
        'navy-700':  '#344054',
        // Brand / Interactive – Electric Teal
        'teal':      '#12B8A6',
        'teal-600':  '#0FA396',
        'teal-100':  '#D1FAF5',
        // Energy Accent – Active Coral
        'coral':     '#FF6B4A',
        'coral-100': '#FFE4DC',
        // Secondary Accent – Electric Blue (AI)
        'blue-ai':   '#4385F5',
        'blue-ai-100':'#DBEAFE',
        // Backgrounds & Surfaces
        'surface':   '#FFFFFF',
        'surface-2': '#EEF2F5',
        'bg-base':   '#F6F8FA',
        // Text
        'text-primary':   '#17202A',
        'text-secondary': '#667085',
        // Borders
        'border-ui': '#DDE3EA',
        // Status
        'success':   '#22A06B',
        'warning':   '#F79009',
        'error':     '#E5484D',
        // Legacy aliases so existing code still compiles
        'primary':   '#12B8A6',
        'secondary': '#12B8A6',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        'btn': '8px',
        'card': '14px',
      },
    },
  },
  plugins: [],
}