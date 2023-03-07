/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors
        primary: '#0D6EFD',         // text-primary, bg-primary
        secondary: '#4F4F4F',       // text-secondary, bg-secondary
        accent: '#F4B740',          // text-accent, bg-accent
        background: '#F7F7F7',      // bg-background

        // Layer colors
        layer01: 'grey',
        overlay: 'rgba(0, 0, 0, 0.5)',  // bg-overlay
        modal: 'rgba(255, 255, 255, 0.95)',  // bg-modal
        tooltip: '#333',  // bg-tooltip
      },
      borderColor: {
        // Custom border colors
        primary: 'black',        // border-primary
        secondary: '#4F4F4F',      // border-secondary
        accent: '#F4B740',         // border-accent
        'primary-light': '#AED6FF',  // border-primary-light
        'secondary-light': '#A5A5A5',  // border-secondary-light
      },
      textColor: {
        // Custom text colors
        primary: '#1A1A1A',
        secondary: '#6B7280',
        accent: '#F4B740',
      },
    },

    maxWidth: {
      '1': '100%',
    },

    maxHeight: {
      '1': '100%',
    },
  },
  plugins: [],
}