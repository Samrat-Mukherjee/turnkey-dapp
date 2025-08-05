// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    // add other paths as needed
  ],
  theme: {
    extend: {
      keyframes: {
        "enter-from-right": {
          "0%": { transform: "translateX(200px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        // Add all required shadcn keyframes if needed
      },
      animation: {
        "enter-from-right": "enter-from-right 0.3s ease",
        // Add all required animations if needed
      },
    },
  },
  plugins: [],
};
