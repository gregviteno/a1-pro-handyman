/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/*.js"],
  theme: {
    extend: {
      colors: {
        /* Neo-brutalist palette: orange-dominant, white for clarity, true
           black for every border and shadow. `navy` is kept as a token name
           (306 text-navy usages) but now resolves to near-black, so headings
           read as brutalist ink rather than corporate blue. */
        navy: "#111111",
        "navy-deep": "#000000",
        orange: "#F26A1B",
        "orange-press": "#D95A12",
        "orange-deep": "#B8460A",
        "orange-soft": "#FFD9C0",
        "orange-tint": "#FFF1E6",
        paper: "#FFF7F1",
        ink: "#111111",
        steel: "#333333",
        line: "#000000",
        go: "#1F9D55",
      },
      fontFamily: {
        display: ['"Barlow Condensed"', "Arial Narrow", "sans-serif"],
        sans: ["Barlow", "Helvetica Neue", "Arial", "sans-serif"],
        /* Was undefined, so every `font-mono` label silently fell back to the
           OS default. v0 specifies Space Mono; we keep it a system stack to
           honour the self-hosted-fonts-only rule (no extra download). */
        mono: ['"SFMono-Regular"', "Menlo", "Consolas", '"Liberation Mono"', "monospace"],
      },
      fontSize: {
        /* Brutalist type: tighter leading and negative tracking so the
           condensed caps set as dense slabs. Sizes nudged up a step. */
        h1: ["clamp(3rem, 6.5vw + 1rem, 5.25rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        h2: ["clamp(2.125rem, 3.2vw + 1rem, 3.25rem)", { lineHeight: "1.0", letterSpacing: "-0.015em" }],
        h3: ["clamp(1.375rem, 1.2vw + 1rem, 1.75rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        body: ["1.0625rem", { lineHeight: "1.7" }],
      },
      borderRadius: {
        /* Brutalism squares everything off. `card` is the token every surface
           in the site routes through, so zeroing it here does the whole job. */
        card: "0px",
      },
      boxShadow: {
        /* Restrained: surfaces sit flat with a stark hairline and only pick up
           a small hard offset on hover. `brutal`/`brutal-lg` are reserved for
           the pieces that should carry real weight — the hero lead form and
           the nav dropdown. */
        card: "none",
        lift: "3px 3px 0 0 #000000",
        brutal: "4px 4px 0 0 #000000",
        "brutal-lg": "6px 6px 0 0 #000000",
      },
      maxWidth: {
        wrap: "72rem",
      },
    },
  },
  plugins: [],
};
