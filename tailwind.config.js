/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./public/**/*.html",
      "./src/**/*.{js,ts,jsx,tsx}", // atau sesuaikan dengan lokasi file kamu
      "./node_modules/flowbite/**/*.js"
    ],
    theme: {
      extend: {
        fontFamily: {
          poppins: ['Poppins', 'sans-serif'],
          karma: ['Karma', 'serif'],
        },
      },
    },
    plugins: [
        require('flowbite/plugin')
      ]
};