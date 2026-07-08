/**
 * White-label configuration schema.
 *
 * The entire app renders from a single ClientConfig object. To launch a new
 * client's app you only add a config file under src/config/clients/ and select
 * it with the VITE_CLIENT env var — no component changes required.
 *
 * All sample content shipped with this template is generic and fictional.
 */

export type IconName =
	| "home"
	| "bag"
	| "music"
	| "book"
	| "sparkles"
	| "gift"
	| "cake"
	| "class"
	| "star"
	| "phone"
	| "whatsapp"
	| "pin"
	| "clock"
	| "instagram"
	| "leaf"
	| "heart"
	| "truck"
	| "store"
	| "user";

export interface Product {
	id: string;
	name: string;
	category: string;
	price: number;
	/** Image reference resolved by <Photo/> (keywords or a URL/path). */
	image: string;
	description: string;
	tags?: string[];
	badge?: string;
	popular?: boolean;
}

export interface ClassItem {
	id: string;
	title: string;
	image: string;
	date: string;
	duration: string;
	level: string;
	price: number;
	spots: number;
	description: string;
}

export interface CateringPackage {
	id: string;
	name: string;
	serves: string;
	price: number;
	image: string;
	items: string[];
}

export interface ClientConfig {
	slug: string;
	brand: {
		name: string;
		shortName: string;
		monogram: string;
		tagline: string;
		established: string;
	};
	theme: {
		bg: string;
		bgElevated: string;
		surface: string;
		surfaceAlt: string;
		text: string;
		textMuted: string;
		gold: string;
		goldSoft: string;
		accent: string;
		line: string;
		radius: string;
		fontDisplay: string;
		fontBody: string;
		fontMono: string;
		/** Google Fonts href (loaded at runtime; runtime-cached for offline). */
		fontsHref: string;
	};
	currency: { symbol: string; code: string; position: "before" | "after" };
	contact: {
		phone: string;
		whatsapp: string;
		email: string;
		address: string;
		area: string;
		instagram: string;
		mapQuery: string;
		hours: { day: string; value: string }[];
		note: string;
	};
	features: {
		order: boolean;
		music: boolean;
		classes: boolean;
		catering: boolean;
		giftCards: boolean;
		rewards: boolean;
	};
	nav: { id: ScreenId; label: string; icon: IconName }[];
	home: {
		heroImage: string;
		heroKicker: string;
		heroTitle: string;
		heroSubtitle: string;
		featuredIds: string[];
		highlights: { icon: IconName; title: string; text: string }[];
		announcement?: string;
	};
	menu: {
		categories: { id: string; label: string }[];
		products: Product[];
	};
	music: {
		kicker: string;
		title: string;
		intro: string;
	};
	classes: {
		kicker: string;
		title: string;
		intro: string;
		items: ClassItem[];
	};
	catering: {
		kicker: string;
		title: string;
		intro: string;
		packages: CateringPackage[];
	};
	giftCards: {
		kicker: string;
		title: string;
		intro: string;
		image: string;
		denominations: number[];
		note: string;
	};
	rewards: {
		kicker: string;
		title: string;
		intro: string;
		pointsName: string;
		tiers: { threshold: number; reward: string }[];
		perks: { icon: IconName; text: string }[];
	};
	story: {
		heroImage: string;
		kicker: string;
		heading: string;
		paragraphs: string[];
		values: { icon: IconName; title: string; text: string }[];
	};
}

export type ScreenId =
	| "home"
	| "menu"
	| "music"
	| "story"
	| "more"
	| "classes"
	| "catering"
	| "gift"
	| "rewards"
	| "contact";
