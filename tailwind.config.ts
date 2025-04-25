
import type { Config } from "tailwindcss";
import { colors } from "./src/config/tailwind/colors";
import { typography } from "./src/config/tailwind/typography";
import { animations } from "./src/config/tailwind/animations";
import { spacing } from "./src/config/tailwind/spacing";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    ...spacing,
    extend: {
      ...colors,
      ...typography,
      ...animations,
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.08)",
        dropdown: "0 4px 12px rgba(0, 0, 0, 0.1)",
        popover: "0 4px 12px rgba(0, 0, 0, 0.1)",
        modal: "0 10px 25px rgba(0, 0, 0, 0.15)",
        sm: "0 1px 3px rgba(0, 0, 0, 0.08)",
        md: "0 4px 6px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

