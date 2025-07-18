/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      colors: {
        // Harmonisation palette avec l’avatar principal
        neonCyan: '#3de2fc', // turquoise lumineux (dominant sur la photo)
        neonOrange: '#ffb347', // orange doux et lumineux (présent dans les reflets)
        neonViolet: '#a259f7', // violet/magenta artistique
        neonPink: '#ff5fa2', // rose vif (touches sur la photo)
        neonWhite: '#f8fafd', // blanc très clair (pour contrastes)
        neonBlack: '#18122B', // noir profond, fond principal
        // Pour hover ou ombres
        neonYellow: '#ffe066',
        neonBlue: '#0099ff',
      },
      boxShadow: {
        neonCyan: '0 0 16px #3de2fc',
        neonPink: '0 0 16px #ff5fa2',
        neonViolet: '0 0 16px #a259f7',
        neonOrange: '0 0 16px #ffb347',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'none' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(.4,0,.2,1) both',
      },
    },
  },
  plugins: [],
};
