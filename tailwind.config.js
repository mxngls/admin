/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    theme: {
        screens: {
            // Add smaller scrensize for image grid
            // (components/admin/Product/ProductImageContainer)
            xxs: "392px",
            xs: "520px",
            ...defaultTheme.screens,
        },
        extend: {
            screens: {
                md: "728px",
                // => @media (min-width: 992px) { ... }
            },
        },
    },
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    plugins: [],
};
