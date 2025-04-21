/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
        },
        red: {
          100: '#fee2e2',
          500: '#ef4444',
          800: '#991b1b',
        },
        orange: {
          100: '#ffedd5',
          800: '#9a3412',
        },
        yellow: {
          100: '#fef9c3',
          800: '#854d0e',
        },
        green: {
          100: '#dcfce7',
          800: '#166534',
        },
      },
    },
  },
  plugins: [],
};
