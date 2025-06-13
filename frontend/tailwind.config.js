/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#374151",
            a: {
              color: "#3B82F6",
              "&:hover": {
                color: "#1D4ED8",
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
