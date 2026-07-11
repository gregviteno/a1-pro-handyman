/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/*.js"],
  theme: {
    extend: {
      colors: {
        navy: "#16324F",
        "navy-deep": "#0E2338",
        orange: "#F26A1B",
        "orange-press": "#D95A12",
        paper: "#FAF7F2",
        ink: "#21272C",
        steel: "#5A6873",
        line: "#E5DFD5",
        go: "#1F9D55",
      },
      fontFamily: {
        display: ['"Barlow Condensed"', "Arial Narrow", "sans-serif"],
        sans: ["Barlow", "Helvetica Neue", "Arial", "sans-serif"],
      },
      fontSize: {
        h1: ["clamp(2.5rem, 5vw + 1rem, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        h2: ["clamp(1.75rem, 2.5vw + 0.75rem, 2.5rem)", { lineHeight: "1.15" }],
        h3: ["clamp(1.25rem, 1vw + 1rem, 1.5rem)", { lineHeight: "1.25" }],
        body: ["1.0625rem", { lineHeight: "1.7" }],
      },
      borderRadius: {
        card: "8px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(14,35,56,.06), 0 4px 16px rgba(14,35,56,.08)",
        lift: "0 2px 4px rgba(14,35,56,.08), 0 10px 28px rgba(14,35,56,.12)",
      },
      maxWidth: {
        wrap: "72rem",
      },
    },
  },
  plugins: [],
};
