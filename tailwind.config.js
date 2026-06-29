module.exports = {
  content: [
    "./src/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "!./src/node_modules/**",
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
