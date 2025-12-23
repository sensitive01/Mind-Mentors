module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
     
      animation: {
        "border-run": "border-run 9s linear infinite",
      },
      keyframes: {
        "border-run": {
          "0%": { backgroundPosition: "0% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"), // Ensure this is installed
  ],
};
