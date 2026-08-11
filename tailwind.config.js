/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/*.js"],
  theme: {
    extend: {
      colors: {
        /* Palette is unchanged from the neo-brutalist system — same orange,
           same warm paper, same near-black ink. The only token that moves is
           `line`: it was true black (every edge was a hard 2px rule). In the
           rounded system edges recede and elevation does the separating, so
           `line` becomes a warm hairline in the spirit of the reference
           template's neutral border, tinted to sit on `paper`. */
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
        line: "#EADFD4",
        go: "#1F9D55",
      },
      fontFamily: {
        display: ['"Barlow Condensed"', "Arial Narrow", "sans-serif"],
        sans: ["Barlow", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ['"SFMono-Regular"', "Menlo", "Consolas", '"Liberation Mono"', "monospace"],
      },
      fontSize: {
        /* Type scale is retained verbatim. The condensed caps and the tight
           leading are the site's voice; softening the shapes shouldn't soften
           the headline. Only h3 loosens a hair now that it sits on rounded
           cards rather than hard boxes. */
        h1: ["clamp(3rem, 6.5vw + 1rem, 5.25rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        h2: ["clamp(2.125rem, 3.2vw + 1rem, 3.25rem)", { lineHeight: "1.0", letterSpacing: "-0.015em" }],
        h3: ["clamp(1.375rem, 1.2vw + 1rem, 1.75rem)", { lineHeight: "1.18", letterSpacing: "-0.01em" }],
        body: ["1.0625rem", { lineHeight: "1.7" }],
      },
      borderRadius: {
        /* `card` is the single token every surface routes through, so the
           whole site rounds from this one value. 16px matches the reference
           template's largest step (--radius + 4px ≈ 14px) nudged up slightly
           for the larger surfaces this site uses. */
        card: "1rem",
        field: "0.625rem",
      },
      boxShadow: {
        /* Hard black offsets are gone. Separation now comes from a two-part
           ambient shadow — a tight contact shadow plus a wide soft one —
           warm-tinted so it reads against `paper` instead of graying it. */
        card: "0 1px 2px rgba(70, 34, 8, 0.05), 0 6px 16px rgba(70, 34, 8, 0.06)",
        lift: "0 4px 10px rgba(70, 34, 8, 0.07), 0 14px 32px rgba(70, 34, 8, 0.12)",
        brutal: "0 2px 6px rgba(70, 34, 8, 0.06), 0 10px 28px rgba(70, 34, 8, 0.10)",
        "brutal-lg": "0 6px 18px rgba(70, 34, 8, 0.08), 0 22px 48px rgba(70, 34, 8, 0.14)",
      },
      maxWidth: {
        wrap: "72rem",
      },
    },
  },
  plugins: [],
};
