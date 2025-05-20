/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Citrea brand colors
        citrea: {
          orange: '#FF5C00', // Vibrant orange from Citrea logo
          yellow: '#FFD600', // Yellow from Citrea gradient
          teal: '#00FFCC',   // Teal from Citrea gradient
          green: '#4ADE80',  // Green accent
          50: '#f0f7ff',
          100: '#e0f1ff',
          200: '#c7e3ff',
          300: '#a4d1ff',
          400: '#75b8ff',
          500: '#000000',    // Citrea uses black text on white background
          600: '#000000',
          700: '#000000',
          800: '#000000',
          900: '#000000',
          950: '#000000',
        },
        // KRNL primary colors
        krnl: {
          50: '#f0f7ff',
          100: '#e0eefe',
          200: '#b9dafd',
          300: '#7db9fb',
          400: '#4896f7',
          500: '#0052FF', // Primary KRNL blue
          600: '#0045DB',
          700: '#0039B7',
          800: '#002C93',
          900: '#001F6F',
          950: '#00134B',
        },
        // Bitcoin gold for accent
        bitcoin: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde58a',
          300: '#fbd24e',
          400: '#f9bd1c',
          500: '#f59e0b', // Bitcoin gold
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Neutral colors for UI elements
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        // Success, warning, error states
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        warning: {
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
          950: '#451a03',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        // Background colors
        background: {
          light: '#ffffff',
          dark: '#0a0a0a',
        },
        // Foreground colors
        foreground: {
          light: '#171717',
          dark: '#ededed',
        },
      },
      // Custom gradient definitions
      gradientColorStops: theme => ({
        'citrea-krnl': {
          start: theme('colors.citrea.600'),
          mid: theme('colors.krnl.500'),
          end: theme('colors.bitcoin.500'),
        },
      }),
      // Custom box shadows
      boxShadow: {
        'citrea': '0 4px 14px 0 rgba(255, 92, 0, 0.25)',
        'krnl': '0 4px 14px 0 rgba(0, 82, 255, 0.25)',
        'bitcoin': '0 4px 14px 0 rgba(245, 158, 11, 0.25)',
      },
      // Custom animations
      animation: {
        'gradient-slow': 'gradient 15s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundSize: {
        '300%': '300% 300%',
      },
    },
  },
  plugins: [],
};
