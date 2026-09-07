/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stitch "Clinical Precision" design system
        "primary":                  "#000000",
        "on-primary":               "#ffffff",
        "primary-container":        "#1c1b1b",
        "on-primary-container":     "#858383",
        "primary-fixed":            "#e5e2e1",
        "primary-fixed-dim":        "#c8c6c5",
        "on-primary-fixed":         "#1c1b1b",
        "on-primary-fixed-variant": "#474746",
        "inverse-primary":          "#c8c6c5",

        "secondary":                    "#00696b",
        "on-secondary":                 "#ffffff",
        "secondary-container":          "#56f5f8",
        "on-secondary-container":       "#006e70",
        "secondary-fixed":              "#5af8fb",
        "secondary-fixed-dim":          "#2ddbde",
        "on-secondary-fixed":           "#002020",
        "on-secondary-fixed-variant":   "#004f51",

        "tertiary":                     "#000000",
        "on-tertiary":                  "#ffffff",
        "tertiary-container":           "#001945",
        "on-tertiary-container":        "#3a7eff",
        "tertiary-fixed":               "#d9e2ff",
        "tertiary-fixed-dim":           "#b0c6ff",
        "on-tertiary-fixed":            "#001945",
        "on-tertiary-fixed-variant":    "#00419d",

        "background":                   "#f8f9fa",
        "on-background":                "#191c1d",

        "surface":                      "#f8f9fa",
        "surface-bright":               "#f8f9fa",
        "surface-dim":                  "#d9dadb",
        "surface-variant":              "#e1e3e4",
        "surface-tint":                 "#5f5e5e",
        "surface-charcoal":             "#0D1B2A",
        "surface-container-lowest":     "#ffffff",
        "surface-container-low":        "#f3f4f5",
        "surface-container":            "#edeeef",
        "surface-container-high":       "#e7e8e9",
        "surface-container-highest":    "#e1e3e4",
        "on-surface":                   "#191c1d",
        "on-surface-variant":           "#444748",
        "inverse-surface":              "#2e3132",
        "inverse-on-surface":           "#f0f1f2",

        "outline":                      "#747878",
        "outline-variant":              "#c4c7c7",

        "error":                        "#ba1a1a",
        "on-error":                     "#ffffff",
        "error-container":              "#ffdad6",
        "on-error-container":           "#93000a",

        // Custom tokens
        "stroke-subtle":                "#E9ECEF",
        "text-muted":                   "#5A5A5A",
        "cyan-action":                  "#00CED1",
      },
      fontFamily: {
        sans:          ["Inter", "system-ui", "sans-serif"],
        mono:          ["JetBrains Mono", "monospace"],
        "display-lg":        ["Inter", "sans-serif"],
        "headline-md":       ["Inter", "sans-serif"],
        "headline-sm":       ["Inter", "sans-serif"],
        "body-lg":           ["Inter", "sans-serif"],
        "body-md":           ["Inter", "sans-serif"],
        "label-md":          ["Inter", "sans-serif"],
        "label-caps":        ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display-lg":        ["56px",  { lineHeight: "64px",  fontWeight: "700", letterSpacing: "-0.02em" }],
        "display-lg-mobile": ["40px",  { lineHeight: "48px",  fontWeight: "700", letterSpacing: "-0.02em" }],
        "headline-md":       ["32px",  { lineHeight: "40px",  fontWeight: "600", letterSpacing: "-0.01em" }],
        "headline-sm":       ["24px",  { lineHeight: "32px",  fontWeight: "600" }],
        "body-lg":           ["18px",  { lineHeight: "28px",  fontWeight: "400" }],
        "body-md":           ["16px",  { lineHeight: "24px",  fontWeight: "400" }],
        "label-md":          ["14px",  { lineHeight: "20px",  fontWeight: "500" }],
        "label-caps":        ["12px",  { lineHeight: "16px",  fontWeight: "500", letterSpacing: "0.08em" }],
      },
      spacing: {
        "unit":             "8px",
        "stack-sm":         "12px",
        "stack-md":         "24px",
        "stack-lg":         "48px",
        "margin-mobile":    "16px",
        "margin-desktop":   "64px",
        "gutter":           "24px",
        "container-max":    "1280px",
      },
      borderRadius: {
        DEFAULT: "0.25rem",   // 4px — sharp internal
        "lg":    "0.5rem",    // 8px
        "xl":    "0.75rem",   // 12px
        "2xl":   "1rem",      // 16px
        "3xl":   "1.5rem",    // 24px — cards
        "full":  "9999px",
      },
      maxWidth: {
        "container-max": "1280px",
      },
      keyframes: {
        "fade-in-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.6" },
        },
      },
      animation: {
        "fade-in-up":    "fade-in-up 0.5s ease-out forwards",
        "pulse-subtle":  "pulse-subtle 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
