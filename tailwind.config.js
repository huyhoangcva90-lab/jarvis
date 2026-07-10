export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Share Tech Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        void: "#020617",
        panel: "#07131f",
        cyanCore: "#22d3ee",
        greenCore: "#4ade80",
        amberCore: "#facc15",
        dangerCore: "#fb7185"
      },
      boxShadow: {
        hud: "0 0 0 1px rgba(34, 211, 238, 0.18), 0 0 32px rgba(34, 211, 238, 0.1)",
        greenHud: "0 0 0 1px rgba(74, 222, 128, 0.2), 0 0 28px rgba(74, 222, 128, 0.12)"
      },
      animation: {
        scan: "scan 4s linear infinite",
        pulseCore: "pulseCore 2.8s ease-in-out infinite",
        boot: "boot 1.8s ease-out both",
        sweep: "sweep 3.2s linear infinite"
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "15%": { opacity: "0.45" },
          "100%": { transform: "translateY(100vh)", opacity: "0" }
        },
        pulseCore: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.78" },
          "50%": { transform: "scale(1.04)", opacity: "1" }
        },
        boot: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        sweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        }
      }
    }
  },
  plugins: []
};
