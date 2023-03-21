/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',

        // Or if using `src` directory:
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#9748FF', // text-primary, bg-primary
                secondary: '#BCE3FF', // text-secondary, bg-secondary
                background: '#F7F7F7', // bg-background

                // Layer colors
                placeholder: 'grey',
                overlay: 'rgba(0, 0, 0, 0.5)', // bg-overlay
                modal: 'rgba(255, 255, 255, 0.95)', // bg-modal
                tooltip: '#333', // bg-tooltip
            },
            borderColor: {
                // Custom border colors
                primary: 'black', // border-primary
                secondary: '#4F4F4F', // border-secondary
            },
            textColor: {
                // Custom text colors
                primary: '#1A1A1A',
                secondary: '#6B7280',
                link: '#9748FF',
                linkHover: '#AC6DFF',
                inverted: '#F7F7F7',
            },
        },

        maxWidth: {
            1: '100%',
        },

        maxHeight: {
            1: '100%',
        },
    },
    plugins: [],
};
