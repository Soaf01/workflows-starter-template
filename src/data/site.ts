import type { Category } from "../types";

/**
 * All brand-facing copy lives here so the template is easy to re-theme.
 * "Maison Miellune" is a fictitious name coined for this template
 * (miel = honey, lune = moon); it is not a real business.
 */
export const site = {
	name: "Maison Miellune",
	shortName: "Miellune",
	tagline: "Douceurs artisanales du monde",
	established: "Atelier imaginaire",
	intro:
		"Un atelier imaginaire où l'on pétrit, glace et caramélise des gourmandises inspirées des traditions de tous les continents. Chaque douceur raconte un voyage.",
	story: {
		heading: "Une maison née d'un carnet de voyages",
		paragraphs: [
			"Maison Miellune est une vitrine de démonstration : une pâtisserie imaginaire pensée comme un modèle générique, libre de toute marque. Ni recette secrète, ni enseigne réelle — seulement un décor prêt à accueillir la vôtre.",
			"On y suit le fil d'un carnet de voyages : la feuille de miel du Nord, le grain de sésame des bazars, le thé vert d'un jardin de pierres. Les saveurs se répondent d'un continent à l'autre, comme les musiques que vous pouvez faire jouer en fond.",
			"Remplacez les textes, les prix et les illustrations par les vôtres : la structure, elle, est déjà dressée comme une belle table.",
		],
	},
	values: [
		{
			title: "Fait maison",
			body: "Des recettes façonnées à la main, en petites fournées, chaque matin.",
			icon: "whisk",
		},
		{
			title: "Saveurs du monde",
			body: "Un tour du globe en douceurs, des bazars aux jardins de thé.",
			icon: "globe",
		},
		{
			title: "Ingrédients choisis",
			body: "Beurre, miel et fruits sélectionnés auprès de producteurs imaginaires.",
			icon: "leaf",
		},
	],
	hours: [
		{ day: "Lundi", value: "Fermé" },
		{ day: "Mardi — Vendredi", value: "8h00 — 19h30" },
		{ day: "Samedi", value: "8h00 — 20h00" },
		{ day: "Dimanche", value: "9h00 — 13h00" },
	],
	contact: {
		address: "12, rue des Lanternes · Quartier des Douceurs",
		city: "Ville-Neuve (adresse fictive)",
		phone: "+00 000 00 00 00",
		email: "bonjour@exemple-miellune.test",
		note: "Coordonnées fictives — à remplacer par les vôtres.",
	},
	social: [
		{ label: "Journal", href: "#histoire" },
		{ label: "La carte", href: "#carte" },
		{ label: "Nous trouver", href: "#contact" },
	],
	currency: "€",
} as const;

export const categories: Category[] = [
	{
		id: "patisseries",
		label: "Pâtisseries fines",
		blurb: "Les classiques, glacés et croustillants.",
	},
	{
		id: "monde",
		label: "Douceurs du monde",
		blurb: "Un carnet de voyages en bouchées.",
	},
	{
		id: "boulangerie",
		label: "Boulangerie",
		blurb: "Levains lents et mies dorées.",
	},
	{
		id: "gateaux",
		label: "Gâteaux & entremets",
		blurb: "À partager, ou pas.",
	},
];
