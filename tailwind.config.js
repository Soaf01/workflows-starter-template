/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "media", // Automatically follows system preference
	theme: {
		extend: {
			colors: {
				cream: {
					50: "#fcf9f2",
					100: "#fbf6ec",
					200: "#f5ecd9",
					300: "#eddfc4",
				},
				honey: {
					200: "#f8dda0",
					300: "#f3c56b",
					400: "#eaa945",
					500: "#e09a2e",
					600: "#cf8422",
					700: "#a9691a",
					800: "#835114",
				},
				cocoa: {
					600: "#5c4433",
					700: "#4a3527",
					800: "#37271c",
					900: "#241812",
					950: "#180f0a",
				},
				berry: {
					300: "#e79bb0",
					400: "#d9718d",
					500: "#c64b6e",
					600: "#a83557",
				},
				sage: {
					300: "#b6d1a4",
					400: "#9bbe86",
					500: "#7fa867",
				},
			},
			fontFamily: {
				serif: [
					"ui-serif",
					"Georgia",
					"Cambria",
					'"Iowan Old Style"',
					'"Palatino Linotype"',
					'"Book Antiqua"',
					"serif",
				],
				sans: [
					"ui-sans-serif",
					"system-ui",
					"-apple-system",
					'"Segoe UI"',
					"Roboto",
					"Helvetica",
					"Arial",
					"sans-serif",
				],
			},
			boxShadow: {
				soft: "0 10px 40px -12px rgba(74, 53, 39, 0.35)",
				card: "0 18px 50px -20px rgba(74, 53, 39, 0.45)",
				glow: "0 0 60px -10px rgba(234, 169, 69, 0.55)",
			},
			animation: {
				"fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
				float: "float 6s ease-in-out infinite",
				"float-slow": "float 9s ease-in-out infinite",
				shimmer: "shimmer 2.5s linear infinite",
				"spin-slow": "spin 26s linear infinite",
				"pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				steam: "steam 3.4s ease-in-out infinite",
			},
			keyframes: {
				"fade-up": {
					"0%": { opacity: "0", transform: "translateY(26px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				float: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-14px)" },
				},
				shimmer: {
					"0%": { backgroundPosition: "-200% 0" },
					"100%": { backgroundPosition: "200% 0" },
				},
				"pulse-ring": {
					"0%": { transform: "scale(0.9)", opacity: "0.7" },
					"70%, 100%": { transform: "scale(1.7)", opacity: "0" },
				},
				steam: {
					"0%": { opacity: "0", transform: "translateY(0) scaleX(1)" },
					"40%": { opacity: "0.5" },
					"100%": { opacity: "0", transform: "translateY(-22px) scaleX(1.6)" },
				},
			},
		},
	},
	plugins: [],
};
