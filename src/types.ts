/**
 * Shared types for the Maison Miellune template.
 * Everything here is generic sample data — rename freely.
 */

export type CategoryId = "patisseries" | "monde" | "boulangerie" | "gateaux";

export interface Category {
	id: CategoryId;
	label: string;
	blurb: string;
}

export type TreatTag =
	| "populaire"
	| "nouveau"
	| "vegan"
	| "sans-gluten"
	| "signature";

/** Keys map 1:1 to a hand-drawn SVG in components/illustrations. */
export type IllustrationKey =
	| "croissant"
	| "macaron"
	| "eclair"
	| "tarte"
	| "financier"
	| "baklava"
	| "mochi"
	| "alfajor"
	| "churros"
	| "gaufre"
	| "levain"
	| "brioche"
	| "cheesecake"
	| "foret"
	| "cupcake"
	| "cookie";

export interface Treat {
	id: string;
	name: string;
	category: CategoryId;
	/** An evocative, invented place of origin (ties into the music regions). */
	origin: string;
	/** Price in the shop's generic currency unit. */
	price: number;
	illustration: IllustrationKey;
	description: string;
	tags: TreatTag[];
	featured?: boolean;
}

export interface CartLine {
	id: string;
	quantity: number;
}

export interface OrderResult {
	ok: boolean;
	reference?: string;
	itemCount?: number;
	total?: number;
	message?: string;
	error?: string;
}
