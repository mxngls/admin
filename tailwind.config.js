/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    theme: {
        screens: {
            // Add smaller scrensize for image grid 
            // (components/admin/Product/ProductImageContainer)
            "xs": "520px",
            ...defaultTheme.screens,
        },
    },
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    plugins: [],
};
