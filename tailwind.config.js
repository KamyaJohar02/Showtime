/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',        // All files in src/
    './app/**/*.{js,ts,jsx,tsx,mdx}',        // All files in app/
    './components/**/*.{js,ts,jsx,tsx,mdx}', // All files in components/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
