import type { Treat } from "../types";

/**
 * Generic sample menu. Names are common pastry categories (not brands);
 * "origins" are invented, evocative place names that echo the music regions.
 */
export const menu: Treat[] = [
	// — Pâtisseries fines —
	{
		id: "croissant-beurre",
		name: "Croissant au beurre",
		category: "patisseries",
		origin: "Vallée dorée",
		price: 2.2,
		illustration: "croissant",
		description:
			"Feuilletage lent, trente-deux couches de beurre, une croûte qui chante sous les doigts.",
		tags: ["populaire"],
		featured: true,
	},
	{
		id: "macarons-assortis",
		name: "Macarons assortis",
		category: "patisseries",
		origin: "Atelier Miellune",
		price: 8.5,
		illustration: "macaron",
		description:
			"Boîte de six coques lisses : miel-lavande, cacao, pistache, framboise, vanille, agrume.",
		tags: ["sans-gluten", "signature"],
		featured: true,
	},
	{
		id: "eclair-chocolat",
		name: "Éclair au chocolat",
		category: "patisseries",
		origin: "Vallée dorée",
		price: 3.8,
		illustration: "eclair",
		description:
			"Pâte à choux garnie d'une crème au cacao intense, glaçage miroir.",
		tags: [],
	},
	{
		id: "tarte-fruits-rouges",
		name: "Tarte aux fruits rouges",
		category: "patisseries",
		origin: "Verger clair",
		price: 4.5,
		illustration: "tarte",
		description:
			"Sablé pur beurre, crème vanillée et une pluie de fruits rouges du matin.",
		tags: ["populaire"],
		featured: true,
	},
	{
		id: "financier-amande",
		name: "Financier amande",
		category: "patisseries",
		origin: "Atelier Miellune",
		price: 2.0,
		illustration: "financier",
		description: "Petit lingot moelleux au beurre noisette et à l'amande.",
		tags: [],
	},

	// — Douceurs du monde —
	{
		id: "baklava-pistache",
		name: "Baklava aux pistaches",
		category: "monde",
		origin: "Bazar de sable",
		price: 3.2,
		illustration: "baklava",
		description:
			"Fines feuilles croustillantes, pistaches concassées et sirop de miel parfumé.",
		tags: ["signature"],
		featured: true,
	},
	{
		id: "mochi-the-vert",
		name: "Mochi au thé vert",
		category: "monde",
		origin: "Jardin de Koto",
		price: 2.8,
		illustration: "mochi",
		description: "Pâte de riz tendre, cœur de thé vert légèrement amer.",
		tags: ["vegan", "sans-gluten"],
	},
	{
		id: "alfajor-caramel",
		name: "Alfajor au caramel",
		category: "monde",
		origin: "Sierra alta",
		price: 2.5,
		illustration: "alfajor",
		description:
			"Deux sablés fondants réunis par un caramel doux, roulés dans la noix de coco.",
		tags: ["nouveau"],
	},
	{
		id: "churros-cacao",
		name: "Churros & sauce cacao",
		category: "monde",
		origin: "Placeta",
		price: 4.2,
		illustration: "churros",
		description:
			"Bâtonnets dorés roulés au sucre, servis avec une sauce au cacao chaud.",
		tags: ["populaire"],
	},
	{
		id: "gaufre-doree",
		name: "Gaufre dorée",
		category: "monde",
		origin: "Nord doux",
		price: 3.6,
		illustration: "gaufre",
		description:
			"Pâte perlée, cœur moelleux et alvéoles croustillantes caramélisées.",
		tags: [],
	},

	// — Boulangerie —
	{
		id: "pain-levain",
		name: "Pain au levain",
		category: "boulangerie",
		origin: "Fournil lent",
		price: 5.4,
		illustration: "levain",
		description:
			"Levain naturel conduit sur trois jours, croûte épaisse et mie ouverte.",
		tags: ["nouveau"],
		featured: true,
	},
	{
		id: "brioche-tressee",
		name: "Brioche tressée",
		category: "boulangerie",
		origin: "Fournil lent",
		price: 4.8,
		illustration: "brioche",
		description: "Mie filante et beurrée, dorure d'œuf et grains de sucre.",
		tags: [],
	},
	{
		id: "cookie-cacao",
		name: "Cookie triple cacao",
		category: "boulangerie",
		origin: "Atelier Miellune",
		price: 2.6,
		illustration: "cookie",
		description: "Cœur fondant, éclats de trois cacaos, une pincée de sel.",
		tags: ["populaire"],
	},

	// — Gâteaux & entremets —
	{
		id: "cheesecake-vanille",
		name: "Cheesecake vanille",
		category: "gateaux",
		origin: "Atelier Miellune",
		price: 5.2,
		illustration: "cheesecake",
		description:
			"Crémeux à la vanille sur un socle de sablés, coulis de fruits au choix.",
		tags: [],
	},
	{
		id: "foret-cacao",
		name: "Forêt cacao",
		category: "gateaux",
		origin: "Vallée dorée",
		price: 5.8,
		illustration: "foret",
		description:
			"Biscuit cacao, chantilly légère, cerises acidulées et copeaux de chocolat.",
		tags: ["signature"],
		featured: true,
	},
	{
		id: "cupcake-miel-lavande",
		name: "Cupcake miel-lavande",
		category: "gateaux",
		origin: "Atelier Miellune",
		price: 3.4,
		illustration: "cupcake",
		description:
			"Gâteau moelleux au miel, glaçage à la lavande, éclat de sucre doré.",
		tags: ["signature", "populaire"],
		featured: true,
	},
];

export const treatById = (id: string): Treat | undefined =>
	menu.find((t) => t.id === id);
