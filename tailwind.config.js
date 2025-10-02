/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        space: {
          900: "#0a0f1f",
          800: "#0f1a33",
          700: "#0f2247",
          600: "#123060"
        },
        nasa: {
          blue: "#0b3d91",
          red: "#fc3d21",
          white: "#ffffff"
        }
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        glow: "0 0 30px rgba(11,61,145,0.4)"
      },
      animation: {
        'slow-pulse': 'slow-pulse 6s ease-in-out infinite',
      },
      keyframes: {
        'slow-pulse': {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        }
      }
    },
  },
  plugins: [],
}