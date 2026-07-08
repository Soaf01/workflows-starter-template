/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				// RGB-channel vars so Tailwind opacity modifiers (e.g. bg-gold/12) work.
				bg: "rgb(var(--bg-rgb) / <alpha-value>)",
				"bg-elevated": "rgb(var(--bg-elevated-rgb) / <alpha-value>)",
				surface: "rgb(var(--surface-rgb) / <alpha-value>)",
				"surface-alt": "rgb(var(--surface-alt-rgb) / <alpha-value>)",
				ink: "rgb(var(--text-rgb) / <alpha-value>)",
				muted: "rgb(var(--text-muted-rgb) / <alpha-value>)",
				gold: "rgb(var(--gold-rgb) / <alpha-value>)",
				"gold-soft": "rgb(var(--gold-soft-rgb) / <alpha-value>)",
				accent: "rgb(var(--accent-rgb) / <alpha-value>)",
				line: "var(--line)",
			},
			fontFamily: {
				display: "var(--font-display)",
				body: "var(--font-body)",
				mono: "var(--font-mono)",
			},
			borderRadius: {
				app: "var(--radius)",
			},
			boxShadow: {
				soft: "0 12px 40px -16px rgba(0,0,0,0.65)",
				card: "0 20px 60px -24px rgba(0,0,0,0.8)",
				gold: "0 10px 40px -12px rgba(217,178,106,0.35)",
			},
			animation: {
				"fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
				"fade-in": "fade-in 0.4s ease both",
				"slide-up": "slide-up 0.35s cubic-bezier(0.22,1,0.36,1) both",
				float: "float 6s ease-in-out infinite",
				shimmer: "shimmer 2.2s linear infinite",
			},
			keyframes: {
				"fade-up": {
					"0%": { opacity: "0", transform: "translateY(20px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
				"slide-up": {
					"0%": { opacity: "0", transform: "translateY(12px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				float: {
					"0%,100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-10px)" },
				},
				shimmer: {
					"0%": { backgroundPosition: "-200% 0" },
					"100%": { backgroundPosition: "200% 0" },
				},
			},
		},
	},
	plugins: [],
};
