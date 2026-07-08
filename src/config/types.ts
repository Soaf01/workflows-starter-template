/**
 * White-label configuration schema.
 *
 * The whole app renders from a single ClientConfig. It supports:
 *  - multiple selectable colour themes (config.themes)
 *  - multiple languages with full content translation (config.translations)
 * To launch a new client: add a config under src/config/clients and select it
 * with VITE_CLIENT. All sample content is generic and fictional.
 */

export type LangCode = "en" | "fr" | "es" | "de" | "ar";

export type IconName =
	| "home" | "bag" | "music" | "book" | "sparkles" | "gift" | "cake" | "class"
	| "star" | "phone" | "whatsapp" | "pin" | "clock" | "instagram" | "leaf"
	| "heart" | "truck" | "store" | "user" | "globe" | "palette";

export interface Product {
	id: string;
	name: string;
	category: string;
	price: number;
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

export interface ThemeColors {
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
	/** "dark" | "light" — drives translucency choices in a few spots. */
	mode: "dark" | "light";
}

export interface ThemeDef {
	id: string;
	label: string;
	colors: ThemeColors;
}

export interface Fonts {
	display: string;
	body: string;
	mono: string;
	/** Google Fonts href (loaded at runtime, cached offline). Optional. */
	href?: string;
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
	fonts: Fonts;
	themes: ThemeDef[];
	defaultThemeId: string;
	languages: { code: LangCode; label: string; rtl?: boolean }[];
	defaultLanguage: LangCode;
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
	music: { kicker: string; title: string; intro: string };
	classes: { kicker: string; title: string; intro: string; items: ClassItem[] };
	catering: { kicker: string; title: string; intro: string; packages: CateringPackage[] };
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
	/** Per-language content overrides, deep-merged over the base (English). */
	translations?: Partial<Record<LangCode, DeepPartial<ClientConfig>>>;
}

export type ScreenId =
	| "home" | "menu" | "music" | "story" | "more"
	| "classes" | "catering" | "gift" | "rewards" | "contact";

export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends (infer U)[]
		? DeepPartial<U>[]
		: T[P] extends object
			? DeepPartial<T[P]>
			: T[P];
};
