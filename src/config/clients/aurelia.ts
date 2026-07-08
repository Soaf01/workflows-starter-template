import type { ClientConfig } from "../types";
import { aureliaTranslations } from "./aurelia.i18n";

/**
 * Demo client — "Aurelia Bakehouse". Entirely fictional.
 * Duplicate this file to spin up a new client.
 */
export const aurelia: ClientConfig = {
	slug: "aurelia",
	brand: {
		name: "Aurelia Bakehouse",
		shortName: "Aurelia",
		monogram: "A",
		tagline: "Slow-baked, every morning",
		established: "Est. 2019",
	},
	fonts: {
		// Sans-serif, Calibri-first with a close web fallback + Arabic coverage.
		display:
			"Calibri, 'Segoe UI', 'Source Sans 3', 'Noto Sans Arabic', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif",
		body:
			"Calibri, 'Segoe UI', 'Source Sans 3', 'Noto Sans Arabic', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif",
		mono: "'DM Mono', ui-monospace, SFMono-Regular, monospace",
		href:
			"https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@400;500&family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap",
	},
	themes: [
		{
			id: "dark",
			label: "Midnight Gold",
			colors: {
				bg: "#0e0b08",
				bgElevated: "#17100a",
				surface: "#1d150f",
				surfaceAlt: "#271b12",
				text: "#f5efe6",
				textMuted: "#a89583",
				gold: "#d9b26a",
				goldSoft: "#eccd84",
				accent: "#c56d4e",
				line: "rgba(217,178,106,0.18)",
				radius: "22px",
				mode: "dark",
			},
		},
		{
			id: "lightEarth",
			label: "Light Earth",
			colors: {
				bg: "#efe7d6",
				bgElevated: "#e7dcc6",
				surface: "#f8f2e6",
				surfaceAlt: "#ece1cd",
				text: "#3b2c1d",
				textMuted: "#7c6a52",
				gold: "#996716",
				goldSoft: "#bd8a33",
				accent: "#b0563a",
				line: "rgba(59,44,29,0.16)",
				radius: "22px",
				mode: "light",
			},
		},
	],
	defaultThemeId: "dark",
	languages: [
		{ code: "en", label: "English" },
		{ code: "fr", label: "Français" },
		{ code: "es", label: "Español" },
		{ code: "de", label: "Deutsch" },
		{ code: "ar", label: "العربية", rtl: true },
	],
	defaultLanguage: "en",
	currency: { symbol: "$", code: "USD", position: "before" },
	contact: {
		phone: "+1 (555) 018-4420",
		whatsapp: "15550184420",
		email: "hello@aurelia-bakehouse.example",
		address: "Unit 7, Riverside Market Hall",
		area: "Old Town",
		instagram: "@aurelia.bakehouse",
		mapQuery: "Riverside Market Hall",
		hours: [
			{ day: "Monday", value: "Closed" },
			{ day: "Tue – Fri", value: "7:30 – 19:00" },
			{ day: "Saturday", value: "8:00 – 20:00" },
			{ day: "Sunday", value: "8:00 – 14:00" },
		],
		note: "Fictional details — replace them in the client config.",
	},
	features: { order: true, music: true, classes: true, catering: true, giftCards: true, rewards: true },
	nav: [
		{ id: "home", label: "Home", icon: "home" },
		{ id: "menu", label: "Menu", icon: "bag" },
		{ id: "music", label: "Music", icon: "music" },
		{ id: "rewards", label: "Rewards", icon: "star" },
		{ id: "more", label: "More", icon: "sparkles" },
	],
	home: {
		heroImage: "croissant,bakery",
		heroKicker: "Artisan bakehouse",
		heroTitle: "Slow-baked joy, every single morning",
		heroSubtitle:
			"Sourdough, viennoiserie and small-batch cakes — made by hand and best enjoyed warm.",
		featuredIds: ["croissant", "pistachio-snail", "vanilla-cake", "sourdough"],
		highlights: [
			{ icon: "leaf", title: "Small batches", text: "Baked fresh twice a day" },
			{ icon: "cake", title: "By hand", text: "Every gram weighed" },
			{ icon: "truck", title: "Same-day", text: "Local delivery & pickup" },
		],
		announcement: "Fresh trays out of the oven at 7:30 & 15:00, daily.",
	},
	menu: {
		categories: [
			{ id: "viennoiserie", label: "Viennoiserie" },
			{ id: "cakes", label: "Cakes & Slices" },
			{ id: "cookies", label: "Cookies" },
			{ id: "breads", label: "Breads" },
			{ id: "drinks", label: "Drinks" },
		],
		products: [
			{ id: "croissant", name: "Butter Croissant", category: "viennoiserie", price: 3.5, image: "croissant", description: "Thirty-two folds of cultured butter, shatteringly crisp.", tags: ["Bestseller"], popular: true },
			{ id: "pain-choc", name: "Pain au Chocolat", category: "viennoiserie", price: 3.9, image: "chocolate,croissant", description: "Two batons of dark chocolate in flaky, laminated dough." },
			{ id: "pistachio-snail", name: "Pistachio Snail", category: "viennoiserie", price: 4.6, image: "pistachio,pastry", description: "Laminated swirl, pistachio cream, toasted nuts.", popular: true },
			{ id: "cinnamon-knot", name: "Cardamom Knot", category: "viennoiserie", price: 4.2, image: "cinnamon,bun", description: "Cardamom-scented, pearl sugar, a soft centre." },
			{ id: "vanilla-cake", name: "Vanilla Bean Cake", category: "cakes", price: 5.2, image: "cake,slice", description: "Three layers, real vanilla, cloud-light cream.", tags: ["Slice"], popular: true },
			{ id: "choc-torte", name: "Dark Chocolate Torte", category: "cakes", price: 5.8, image: "chocolate,cake", description: "Flourless and intense, with a whisper of sea salt." },
			{ id: "cheesecake", name: "Berry Cheesecake", category: "cakes", price: 5.6, image: "cheesecake", description: "Baked vanilla cheesecake under seasonal berries." },
			{ id: "lemon-cake", name: "Lemon Olive-Oil Cake", category: "cakes", price: 4.8, image: "lemon,cake", description: "Bright and moist, dusted with icing sugar." },
			{ id: "salt-cookie", name: "Sea-Salt Choc Cookie", category: "cookies", price: 3.2, image: "cookie,chocolate", description: "Molten centre, three cocoas, flaky salt.", popular: true },
			{ id: "pistachio-sable", name: "Pistachio Sablé", category: "cookies", price: 2.8, image: "cookie,pistachio", description: "Buttery shortbread with roasted pistachio." },
			{ id: "oat-raisin", name: "Oat & Raisin", category: "cookies", price: 2.6, image: "cookie,oatmeal", description: "Chewy, gently spiced, wholesome." },
			{ id: "sourdough", name: "Country Sourdough", category: "breads", price: 6.4, image: "sourdough,bread", description: "Three-day levain, blistered crust, open crumb.", tags: ["Loaf"], popular: true },
			{ id: "seeded-rye", name: "Seeded Rye", category: "breads", price: 6.8, image: "rye,bread", description: "Dense and nutty, sliced on request." },
			{ id: "brioche", name: "Brioche Buns (×4)", category: "breads", price: 5.4, image: "brioche,bread", description: "Rich, feathery crumb with glossy tops." },
			{ id: "flat-white", name: "Flat White", category: "drinks", price: 3.4, image: "coffee,latte", description: "Double ristretto, silky micro-foam." },
			{ id: "pistachio-latte", name: "Iced Pistachio Latte", category: "drinks", price: 4.2, image: "iced,coffee", description: "House pistachio, cold milk, espresso.", popular: true },
			{ id: "chai", name: "Spiced Chai", category: "drinks", price: 3.6, image: "chai,tea", description: "Black tea, cardamom, cinnamon, ginger." },
		],
	},
	music: {
		kicker: "Bakehouse radio",
		title: "Aurelia Music",
		intro:
			"The ambience that hums through the bakehouse at dawn — generated live, so it never repeats. Pick a mood and bake along.",
	},
	classes: {
		kicker: "Bakehouse school",
		title: "Classes & workshops",
		intro: "Small, hands-on classes led by our bakers. Aprons, ingredients and coffee included.",
		items: [
			{ id: "lamination", title: "Croissant Lamination 101", image: "croissant,baking", date: "Sat 12 Jul · 10:00", duration: "3 hours", level: "Beginner", price: 85, spots: 6, description: "Master the fold: butter blocks, turns and the perfect bake." },
			{ id: "sourdough-class", title: "Sourdough from Scratch", image: "sourdough,baking", date: "Sun 20 Jul · 09:30", duration: "4 hours", level: "All levels", price: 95, spots: 8, description: "Build a starter, shape a boule and take a loaf home." },
			{ id: "cakes-class", title: "Layer Cakes & Buttercream", image: "cake,baking", date: "Sat 26 Jul · 14:00", duration: "3 hours", level: "Intermediate", price: 90, spots: 6, description: "Level, fill, crumb-coat and finish like a pro." },
			{ id: "kids-class", title: "Kids' Cookie Club", image: "cookies,baking", date: "Sun 3 Aug · 11:00", duration: "1.5 hours", level: "Ages 6–11", price: 40, spots: 10, description: "Roll, cut, decorate and devour. Grown-ups can watch." },
		],
	},
	catering: {
		kicker: "Gatherings",
		title: "Catering & platters",
		intro: "Breakfast spreads, dessert tables and grazing boxes for offices, weddings and celebrations.",
		packages: [
			{ id: "morning-box", name: "Morning Pastry Box", serves: "8 – 10", price: 55, image: "pastry,breakfast", items: ["Croissants & pains au chocolat", "Mini danishes", "Seasonal fruit", "Jams & butter"] },
			{ id: "celebration-cake", name: "Celebration Cake", serves: "12 – 16", price: 120, image: "cake,celebration", items: ["Three tiers, your flavours", "Hand-piped message", "Candles & serving box"] },
			{ id: "grazing-table", name: "Grazing Dessert Table", serves: "20 +", price: 240, image: "dessert,buffet", items: ["Assorted cakes & tarts", "Cookies & macarons", "On-site styling & setup"] },
		],
	},
	giftCards: {
		kicker: "Gifting",
		title: "Gift cards",
		intro: "A little box of joy — delivered by email or printed in-store, redeemable on anything we bake.",
		image: "gift,box",
		denominations: [15, 25, 50, 100],
		note: "Digital gift cards are a demonstration in this template.",
	},
	rewards: {
		kicker: "Loyalty",
		title: "Crumb Club",
		intro: "Earn a Crumb on every order. Collect them for free bakes and early access to seasonal menus.",
		pointsName: "Crumbs",
		tiers: [
			{ threshold: 50, reward: "A filter coffee, on us" },
			{ threshold: 120, reward: "Any pastry, free" },
			{ threshold: 250, reward: "A box of cake slices" },
			{ threshold: 400, reward: "Priority class booking + 15% off" },
		],
		perks: [
			{ icon: "gift", text: "A birthday treat, every year" },
			{ icon: "clock", text: "Skip-the-queue pickup" },
			{ icon: "star", text: "Member-only seasonal specials" },
		],
	},
	story: {
		heroImage: "baker,bakery",
		kicker: "Our story",
		heading: "From a home oven to your neighbourhood bakehouse",
		paragraphs: [
			"Aurelia began the way most good things do — with a stubborn love for the craft and a kitchen that always smelled of butter. Weekend loaves for friends became a counter, then a queue, then a home.",
			"We still bake in small batches, still weigh every gram by hand, and still believe a morning is better with something warm in it. Our flour is milled locally and nothing leaves the bench we wouldn't serve at our own table.",
			"This is a fictional showcase — change the words, the photos and the palette, and it becomes any bakehouse you like.",
		],
		values: [
			{ icon: "leaf", title: "Real ingredients", text: "Local flour, fair chocolate, real vanilla." },
			{ icon: "heart", title: "Made by hand", text: "No shortcuts, no factory trays." },
			{ icon: "store", title: "Rooted locally", text: "A counter that knows your order." },
		],
	},
	translations: aureliaTranslations,
};
