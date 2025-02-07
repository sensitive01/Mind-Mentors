module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#642b8f",
        secondary: "#f8a213",
        tertiary: "#aa88be",
        quaternary: "#f0ba6f",
        quinary: "#efe8f0",
      },
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
