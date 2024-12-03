// tailwind.config.js
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}", // Add this line to scan all relevant files
];

export const theme = {
  extend: {
    colors: {
      primary: '#642b8f',        // Primary color
      secondary: '#f8a213',      // Secondary color
      tertiary: '#aa88be',       // Tertiary color
      quaternary: '#f0ba6f',     // Quaternary color
      quinary: '#efe8f0',        // Quinary color
    },
  },
};

export const plugins = [];
