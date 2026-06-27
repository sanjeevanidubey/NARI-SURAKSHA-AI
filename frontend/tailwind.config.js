/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0B0D19",
        cybernavy: "#02040A",
        emeraldneon: "#10B981",
        amberneon: "#F59E0B",
        crimsonneon: "#EF4444",
        violetneon: "#8B5CF6",
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-green': '0 0 15px rgba(16, 185, 129, 0.4)',
        'neon-yellow': '0 0 15px rgba(245, 158, 11, 0.4)',
        'neon-red': '0 0 15px rgba(239, 68, 68, 0.6)',
        'neon-violet': '0 0 20px rgba(139, 92, 246, 0.5)',
      }
    },
  },
  plugins: [],
}
