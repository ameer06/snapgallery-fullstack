/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stitch "Studio Minimalist" design system for SnapGallery
        "canvas": "#FAFAFA",
        "surface": "#FFFFFF",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F4F2FD",
        "surface-container": "#EEEDF7",
        "surface-container-high": "#E8E7F1",
        "surface-container-highest": "#E3E1EC",
        "on-surface": "#1A1B22",
        "on-surface-variant": "#47464B",
        "subtle": "#F4F4F5",
        "ink": "#18181B",
        "ink-dark": "#09090B",
        "muted": "#71717A",
        "outline": "#77767B",
        "border-subtle": "#E4E4E7",
        "border-hairline": "#F4F4F5",
        "indigo-accent": "#4F46E5",
        "secondary": "#4B41E1",
        "secondary-fixed": "#E2DFFF",
        "on-secondary-fixed": "#0F0069",
        "secondary-container": "#645EFB",
        "on-secondary-container": "#FFFBFB",
      },
      fontFamily: {
        sans: ["Geist", "Inter", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        mono: ["Geist", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",   // 8px
        "md": "0.5rem",      // 8px
        "lg": "0.75rem",     // 12px
        "xl": "1rem",        // 16px
        "2xl": "1.25rem",    // 20px
        "3xl": "1.5rem",     // 24px
        "full": "9999px",
      },
      boxShadow: {
        'card-rest': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card-hover': '0 4px 12px -2px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        'dock': '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.15)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
