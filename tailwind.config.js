module.exports = {
  content: [
    "./src/index.html", 
    "./src/**/*.{js,ts,jsx,tsx}",
    './components/**/*.{js,jsx,ts,tsx}',
    './hook/**/*.{js,jsx,ts,tsx}',
    './data/**/*.{js,jsx,ts,tsx}',
    './supabase/**/*.{js,jsx,ts,tsx}',
    './types/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
      }
    }
  },
  plugins: []
};
