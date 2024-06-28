/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    backgroundImage: {
      pattern: "url(/src/assets/pattern.svg)",
    },
    extend: {
      boxShadow: {
        "auth-form": "-14px 14px 38px rgba(0, 0, 0, 0.13)",
        "rating-shadow": "0px 6px 12px rgba(0, 0, 0, 0.3)",
      },
      colors: {
        primaryPurple: "#481079", // Example color value (orange)
        borderPrimary: "#DBDCE0",
      },
    },
  },
  plugins: [],
}

