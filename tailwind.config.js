/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
    "./src/**/*.component.{html,ts,scss}",
    "./src/**/*.page.{html,ts,scss}"
  ],
  theme: {
    extend: {
      colors: {
        'ion-color-orange-500': '#ff9f1c',
        'ion-color-orange-400': '#ffc46a',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles to avoid conflicts with Ionic
  }
}

