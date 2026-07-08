import type { ClientConfig, DeepPartial, LangCode } from "../types";

/**
 * Per-language CONTENT translations for the Aurelia demo, deep-merged over the
 * English base (arrays merge by index, so order must match the base config).
 * UI chrome strings live separately in src/i18n/strings.ts.
 */
export const aureliaTranslations: Partial<
	Record<LangCode, DeepPartial<ClientConfig>>
> = {
	fr: {
		brand: { tagline: "Cuit lentement, chaque matin" },
		contact: {
			area: "Vieille Ville",
			note: "Coordonnées fictives — à remplacer dans la configuration du client.",
			hours: [
				{ day: "Lundi", value: "Fermé" },
				{ day: "Mar – Ven", value: "7:30 – 19:00" },
				{ day: "Samedi", value: "8:00 – 20:00" },
				{ day: "Dimanche", value: "8:00 – 14:00" },
			],
		},
		home: {
			heroKicker: "Boulangerie artisanale",
			heroTitle: "Le bonheur cuit lentement, chaque matin",
			heroSubtitle:
				"Levain, viennoiseries et gâteaux en petites fournées — faits main et meilleurs tièdes.",
			announcement: "Fournées fraîches sorties du four à 7h30 et 15h00, tous les jours.",
			highlights: [
				{ title: "Petites fournées", text: "Cuit deux fois par jour" },
				{ title: "Fait main", text: "Chaque gramme pesé" },
				{ title: "Le jour même", text: "Livraison & retrait locaux" },
			],
		},
		menu: {
			categories: [
				{ label: "Viennoiseries" },
				{ label: "Gâteaux & parts" },
				{ label: "Biscuits" },
				{ label: "Pains" },
				{ label: "Boissons" },
			],
			products: [
				{ name: "Croissant au beurre", description: "Trente-deux tours de beurre, une croûte qui craque.", tags: ["Best-seller"] },
				{ name: "Pain au chocolat", description: "Deux barres de chocolat noir dans une pâte feuilletée." },
				{ name: "Escargot pistache", description: "Feuilletage roulé, crème de pistache, éclats grillés." },
				{ name: "Noeud cardamome", description: "Parfumé à la cardamome, sucre perlé, coeur moelleux." },
				{ name: "Gâteau vanille", description: "Trois couches, vraie vanille, crème aérienne.", tags: ["Part"] },
				{ name: "Tourte chocolat noir", description: "Sans farine, intense, une pointe de fleur de sel." },
				{ name: "Cheesecake aux fruits", description: "Cheesecake vanille cuit, fruits de saison." },
				{ name: "Gâteau citron-huile d'olive", description: "Vif et moelleux, saupoudré de sucre glace." },
				{ name: "Cookie choco fleur de sel", description: "Coeur fondant, trois cacaos, fleur de sel." },
				{ name: "Sablé pistache", description: "Sablé au beurre et pistache torréfiée." },
				{ name: "Avoine & raisins", description: "Moelleux, légèrement épicé, réconfortant." },
				{ name: "Pain de campagne au levain", description: "Levain de trois jours, croûte cloquée, mie ouverte.", tags: ["Miche"] },
				{ name: "Seigle aux graines", description: "Dense et parfumé, tranché sur demande." },
				{ name: "Briochettes (×4)", description: "Mie filante et beurrée, dessus brillants." },
				{ name: "Flat White", description: "Double ristretto, micro-mousse soyeuse." },
				{ name: "Latte pistache glacé", description: "Pistache maison, lait froid, espresso." },
				{ name: "Chai épicé", description: "Thé noir, cardamome, cannelle, gingembre." },
			],
		},
		music: {
			kicker: "Radio du fournil",
			title: "Aurelia Musique",
			intro: "L'ambiance qui berce le fournil à l'aube — générée en direct, elle ne se répète jamais. Choisissez une humeur et cuisinez.",
		},
		classes: {
			kicker: "École du fournil",
			title: "Cours & ateliers",
			intro: "Petits cours pratiques animés par nos boulangers. Tabliers, ingrédients et café inclus.",
			items: [
				{ title: "Feuilletage du croissant 101", date: "Sam 12 juil · 10:00", duration: "3 heures", level: "Débutant", description: "Maîtrisez le tourage : beurre, tours et cuisson parfaite." },
				{ title: "Le levain de A à Z", date: "Dim 20 juil · 09:30", duration: "4 heures", level: "Tous niveaux", description: "Créez un levain, façonnez une boule et repartez avec un pain." },
				{ title: "Layer cakes & crème au beurre", date: "Sam 26 juil · 14:00", duration: "3 heures", level: "Intermédiaire", description: "Niveler, garnir, masquer et finir comme un pro." },
				{ title: "Club biscuits des enfants", date: "Dim 3 août · 11:00", duration: "1,5 heure", level: "6–11 ans", description: "Rouler, découper, décorer et déguster. Les parents regardent." },
			],
		},
		catering: {
			kicker: "Réceptions",
			title: "Traiteur & plateaux",
			intro: "Petits-déjeuners, tables de desserts et coffrets pour bureaux, mariages et fêtes.",
			packages: [
				{ name: "Coffret viennoiseries", items: ["Croissants & pains au chocolat", "Mini-danoises", "Fruits de saison", "Confitures & beurre"] },
				{ name: "Gâteau de fête", items: ["Trois étages, vos parfums", "Message écrit à la main", "Bougies & boîte de service"] },
				{ name: "Table de desserts", items: ["Gâteaux & tartes variés", "Biscuits & macarons", "Mise en place sur place"] },
			],
		},
		giftCards: {
			kicker: "Cadeaux",
			title: "Cartes cadeaux",
			intro: "Un petit bonheur — par e-mail ou imprimé en boutique, valable sur tout ce que nous cuisons.",
			note: "Les cartes cadeaux numériques sont une démonstration.",
		},
		rewards: {
			kicker: "Fidélité",
			title: "Club Miette",
			intro: "Gagnez une Miette à chaque commande. Échangez-les contre des douceurs et l'accès aux menus de saison.",
			pointsName: "Miettes",
			tiers: [
				{ reward: "Un café filtre offert" },
				{ reward: "Une viennoiserie offerte" },
				{ reward: "Une boîte de parts de gâteau" },
				{ reward: "Réservation prioritaire + 15 %" },
			],
			perks: [
				{ text: "Une gourmandise pour votre anniversaire" },
				{ text: "Retrait sans faire la queue" },
				{ text: "Offres de saison réservées aux membres" },
			],
		},
		story: {
			kicker: "Notre histoire",
			heading: "D'un four maison à la boulangerie de votre quartier",
			paragraphs: [
				"Aurelia est née comme les belles choses — d'un amour têtu du métier et d'une cuisine qui sentait toujours le beurre. Les pains du week-end pour les amis sont devenus un comptoir, puis une file, puis une maison.",
				"Nous cuisons toujours en petites fournées, pesons chaque gramme à la main, et croyons qu'un matin est meilleur avec quelque chose de tiède. Notre farine est moulue localement et rien ne sort du fournil que nous ne servirions à notre table.",
				"Ceci est une vitrine fictive — changez les mots, les photos et la palette, et elle devient la boulangerie de votre choix.",
			],
			values: [
				{ title: "Vrais ingrédients", text: "Farine locale, chocolat équitable, vraie vanille." },
				{ title: "Fait main", text: "Aucun raccourci, aucune plaque d'usine." },
				{ title: "Ancré localement", text: "Un comptoir qui connaît votre commande." },
			],
		},
	},

	es: {
		brand: { tagline: "Horneado lento, cada mañana" },
		contact: {
			area: "Casco Antiguo",
			note: "Datos ficticios — cámbialos en la configuración del cliente.",
			hours: [
				{ day: "Lunes", value: "Cerrado" },
				{ day: "Mar – Vie", value: "7:30 – 19:00" },
				{ day: "Sábado", value: "8:00 – 20:00" },
				{ day: "Domingo", value: "8:00 – 14:00" },
			],
		},
		home: {
			heroKicker: "Horno artesano",
			heroTitle: "Alegría horneada despacio, cada mañana",
			heroSubtitle:
				"Masa madre, bollería y pasteles en pequeñas hornadas — hechos a mano y mejores templados.",
			announcement: "Bandejas recién salidas del horno a las 7:30 y 15:00, cada día.",
			highlights: [
				{ title: "Pequeñas hornadas", text: "Horneado dos veces al día" },
				{ title: "A mano", text: "Cada gramo pesado" },
				{ title: "En el día", text: "Reparto y recogida locales" },
			],
		},
		menu: {
			categories: [
				{ label: "Bollería" },
				{ label: "Pasteles y porciones" },
				{ label: "Galletas" },
				{ label: "Panes" },
				{ label: "Bebidas" },
			],
			products: [
				{ name: "Croissant de mantequilla", description: "Treinta y dos pliegues de mantequilla, corteza crujiente.", tags: ["Más vendido"] },
				{ name: "Napolitana de chocolate", description: "Dos barras de chocolate negro en hojaldre." },
				{ name: "Caracola de pistacho", description: "Hojaldre en espiral, crema de pistacho, frutos tostados." },
				{ name: "Nudo de cardamomo", description: "Aroma de cardamomo, azúcar perlado, centro tierno." },
				{ name: "Pastel de vainilla", description: "Tres capas, vainilla real, crema ligera.", tags: ["Porción"] },
				{ name: "Torta de chocolate negro", description: "Sin harina, intensa, con un toque de sal." },
				{ name: "Tarta de queso y frutos", description: "Tarta de queso al horno con frutos de temporada." },
				{ name: "Bizcocho de limón y aceite", description: "Jugoso y brillante, con azúcar glas." },
				{ name: "Galleta de choco y sal", description: "Centro fundente, tres cacaos, sal en escamas." },
				{ name: "Sablé de pistacho", description: "Mantecado de mantequilla y pistacho tostado." },
				{ name: "Avena y pasas", description: "Tierna, especiada, reconfortante." },
				{ name: "Pan de masa madre", description: "Fermento de tres días, corteza y miga abierta.", tags: ["Hogaza"] },
				{ name: "Centeno con semillas", description: "Denso y sabroso, en rebanadas a petición." },
				{ name: "Bollos brioche (×4)", description: "Miga tierna y mantecosa, superficie brillante." },
				{ name: "Flat White", description: "Doble ristretto, microespuma sedosa." },
				{ name: "Latte de pistacho helado", description: "Pistacho de la casa, leche fría, espresso." },
				{ name: "Chai especiado", description: "Té negro, cardamomo, canela, jengibre." },
			],
		},
		music: {
			kicker: "Radio del horno",
			title: "Aurelia Música",
			intro: "El ambiente que suena en el horno al amanecer — generado en vivo, nunca se repite. Elige un estado y hornea.",
		},
		classes: {
			kicker: "Escuela del horno",
			title: "Clases y talleres",
			intro: "Clases prácticas y reducidas con nuestros panaderos. Delantal, ingredientes y café incluidos.",
			items: [
				{ title: "Hojaldre de croissant 101", date: "Sáb 12 jul · 10:00", duration: "3 horas", level: "Principiante", description: "Domina el plegado: mantequilla, vueltas y horneado perfecto." },
				{ title: "Masa madre desde cero", date: "Dom 20 jul · 09:30", duration: "4 horas", level: "Todos los niveles", description: "Crea un fermento, forma una hogaza y llévate un pan." },
				{ title: "Tartas de capas y crema", date: "Sáb 26 jul · 14:00", duration: "3 horas", level: "Intermedio", description: "Nivela, rellena y decora como un profesional." },
				{ title: "Club de galletas infantil", date: "Dom 3 ago · 11:00", duration: "1,5 horas", level: "6–11 años", description: "Estirar, cortar, decorar y comer. Los adultos miran." },
			],
		},
		catering: {
			kicker: "Eventos",
			title: "Catering y bandejas",
			intro: "Desayunos, mesas de postres y cajas para oficinas, bodas y celebraciones.",
			packages: [
				{ name: "Caja de bollería", items: ["Croissants y napolitanas", "Mini danesas", "Fruta de temporada", "Mermeladas y mantequilla"] },
				{ name: "Pastel de celebración", items: ["Tres pisos, tus sabores", "Mensaje a mano", "Velas y caja de servicio"] },
				{ name: "Mesa de postres", items: ["Pasteles y tartas variados", "Galletas y macarons", "Montaje in situ"] },
			],
		},
		giftCards: {
			kicker: "Regalos",
			title: "Tarjetas regalo",
			intro: "Una cajita de alegría — por correo o impresa en tienda, válida en todo lo que horneamos.",
			note: "Las tarjetas regalo digitales son una demostración.",
		},
		rewards: {
			kicker: "Fidelidad",
			title: "Club Miga",
			intro: "Gana una Miga con cada pedido. Cámbialas por dulces y acceso anticipado a menús de temporada.",
			pointsName: "Migas",
			tiers: [
				{ reward: "Un café de filtro gratis" },
				{ reward: "Cualquier bollo, gratis" },
				{ reward: "Una caja de porciones de pastel" },
				{ reward: "Reserva prioritaria + 15 %" },
			],
			perks: [
				{ text: "Un dulce en tu cumpleaños" },
				{ text: "Recogida sin cola" },
				{ text: "Especiales de temporada solo para socios" },
			],
		},
		story: {
			kicker: "Nuestra historia",
			heading: "De un horno de casa al horno de tu barrio",
			paragraphs: [
				"Aurelia empezó como las cosas buenas — con un amor terco por el oficio y una cocina que siempre olía a mantequilla. Los panes del fin de semana para amigos se hicieron mostrador, luego cola y luego hogar.",
				"Seguimos horneando en pequeñas hornadas, pesando cada gramo a mano, y creemos que la mañana es mejor con algo templado. Nuestra harina se muele localmente y nada sale del obrador que no serviríamos en nuestra mesa.",
				"Es una muestra ficticia — cambia las palabras, las fotos y la paleta, y se convierte en el horno que quieras.",
			],
			values: [
				{ title: "Ingredientes reales", text: "Harina local, chocolate justo, vainilla real." },
				{ title: "Hecho a mano", text: "Sin atajos, sin bandejas de fábrica." },
				{ title: "Arraigado local", text: "Un mostrador que conoce tu pedido." },
			],
		},
	},

	de: {
		brand: { tagline: "Langsam gebacken, jeden Morgen" },
		contact: {
			area: "Altstadt",
			note: "Fiktive Angaben — in der Client-Konfiguration ersetzen.",
			hours: [
				{ day: "Montag", value: "Geschlossen" },
				{ day: "Di – Fr", value: "7:30 – 19:00" },
				{ day: "Samstag", value: "8:00 – 20:00" },
				{ day: "Sonntag", value: "8:00 – 14:00" },
			],
		},
		home: {
			heroKicker: "Handwerksbäckerei",
			heroTitle: "Langsam gebackene Freude, jeden Morgen",
			heroSubtitle:
				"Sauerteig, Feingebäck und Kuchen in kleinen Chargen — von Hand gemacht, am besten warm.",
			announcement: "Frische Bleche um 7:30 und 15:00 Uhr, täglich.",
			highlights: [
				{ title: "Kleine Chargen", text: "Zweimal täglich gebacken" },
				{ title: "Von Hand", text: "Jedes Gramm gewogen" },
				{ title: "Am selben Tag", text: "Lieferung & Abholung vor Ort" },
			],
		},
		menu: {
			categories: [
				{ label: "Feingebäck" },
				{ label: "Kuchen & Stücke" },
				{ label: "Kekse" },
				{ label: "Brote" },
				{ label: "Getränke" },
			],
			products: [
				{ name: "Buttercroissant", description: "Zweiunddreißig Butterlagen, herrlich knusprig.", tags: ["Bestseller"] },
				{ name: "Schokoladencroissant", description: "Zwei Riegel Zartbitter in blättrigem Teig." },
				{ name: "Pistazienschnecke", description: "Gerollter Blätterteig, Pistaziencreme, geröstete Nüsse." },
				{ name: "Kardamomknoten", description: "Kardamom-Aroma, Perlzucker, weicher Kern." },
				{ name: "Vanillekuchen", description: "Drei Schichten, echte Vanille, luftige Creme.", tags: ["Stück"] },
				{ name: "Zartbitter-Torte", description: "Ohne Mehl, intensiv, ein Hauch Meersalz." },
				{ name: "Beeren-Käsekuchen", description: "Gebackener Vanille-Käsekuchen mit Beeren der Saison." },
				{ name: "Zitronen-Olivenöl-Kuchen", description: "Saftig und hell, mit Puderzucker bestäubt." },
				{ name: "Schoko-Salz-Keks", description: "Flüssiger Kern, drei Kakaos, Salzflocken." },
				{ name: "Pistazien-Sablé", description: "Buttermürbeteig mit gerösteter Pistazie." },
				{ name: "Hafer & Rosinen", description: "Zäh, sanft gewürzt, wohltuend." },
				{ name: "Sauerteig-Landbrot", description: "Dreitägiger Sauerteig, rösche Kruste, offene Krume.", tags: ["Laib"] },
				{ name: "Saaten-Roggen", description: "Dicht und nussig, auf Wunsch geschnitten." },
				{ name: "Brioche-Brötchen (×4)", description: "Zarte, buttrige Krume, glänzende Oberseite." },
				{ name: "Flat White", description: "Doppelter Ristretto, seidiger Mikroschaum." },
				{ name: "Eis-Pistazien-Latte", description: "Hauspistazie, kalte Milch, Espresso." },
				{ name: "Gewürz-Chai", description: "Schwarztee, Kardamom, Zimt, Ingwer." },
			],
		},
		music: {
			kicker: "Bäckerei-Radio",
			title: "Aurelia Musik",
			intro: "Die Klangkulisse der Backstube im Morgengrauen — live erzeugt, sie wiederholt sich nie. Wähle eine Stimmung und backe mit.",
		},
		classes: {
			kicker: "Backschule",
			title: "Kurse & Workshops",
			intro: "Kleine Kurse zum Mitmachen mit unseren Bäckern. Schürze, Zutaten und Kaffee inklusive.",
			items: [
				{ title: "Croissant-Tourieren 101", date: "Sa 12. Jul · 10:00", duration: "3 Stunden", level: "Anfänger", description: "Meistere das Tourieren: Butter, Touren und perfekter Ofen." },
				{ title: "Sauerteig von Grund auf", date: "So 20. Jul · 09:30", duration: "4 Stunden", level: "Alle Niveaus", description: "Ansatz führen, Laib formen und ein Brot mitnehmen." },
				{ title: "Torten & Buttercreme", date: "Sa 26. Jul · 14:00", duration: "3 Stunden", level: "Fortgeschritten", description: "Schichten, füllen und dekorieren wie ein Profi." },
				{ title: "Kinder-Keksclub", date: "So 3. Aug · 11:00", duration: "1,5 Stunden", level: "6–11 Jahre", description: "Ausrollen, ausstechen, verzieren und naschen." },
			],
		},
		catering: {
			kicker: "Feiern",
			title: "Catering & Platten",
			intro: "Frühstück, Dessert-Tische und Boxen für Büros, Hochzeiten und Feiern.",
			packages: [
				{ name: "Frühstücks-Gebäckbox", items: ["Croissants & Schokocroissants", "Mini-Plunder", "Obst der Saison", "Marmeladen & Butter"] },
				{ name: "Festtagstorte", items: ["Drei Etagen, deine Sorten", "Handgeschriebene Botschaft", "Kerzen & Servierbox"] },
				{ name: "Dessert-Tafel", items: ["Kuchen & Törtchen", "Kekse & Macarons", "Aufbau vor Ort"] },
			],
		},
		giftCards: {
			kicker: "Schenken",
			title: "Geschenkkarten",
			intro: "Ein kleines Stück Freude — per E-Mail oder im Laden gedruckt, für alles einlösbar, was wir backen.",
			note: "Digitale Geschenkkarten sind eine Demonstration.",
		},
		rewards: {
			kicker: "Treue",
			title: "Krümel-Club",
			intro: "Sammle einen Krümel bei jeder Bestellung. Löse sie gegen Gebäck und früheren Zugang zu Saisonmenüs ein.",
			pointsName: "Krümel",
			tiers: [
				{ reward: "Ein Filterkaffee gratis" },
				{ reward: "Ein Gebäck, gratis" },
				{ reward: "Eine Box Kuchenstücke" },
				{ reward: "Vorrangige Buchung + 15 %" },
			],
			perks: [
				{ text: "Eine Überraschung zum Geburtstag" },
				{ text: "Abholung ohne Anstehen" },
				{ text: "Saison-Specials nur für Mitglieder" },
			],
		},
		story: {
			kicker: "Unsere Geschichte",
			heading: "Vom Heimofen zur Bäckerei im Viertel",
			paragraphs: [
				"Aurelia begann wie die guten Dinge — mit einer sturen Liebe zum Handwerk und einer Küche, die stets nach Butter roch. Aus Wochenendbroten für Freunde wurde eine Theke, dann eine Schlange, dann ein Zuhause.",
				"Wir backen noch in kleinen Chargen, wiegen jedes Gramm von Hand und glauben, dass ein Morgen mit etwas Warmem besser ist. Unser Mehl wird lokal gemahlen, und nichts verlässt die Backstube, das wir nicht selbst servieren würden.",
				"Dies ist ein fiktives Schaufenster — ändere Worte, Fotos und Farben, und es wird zu jeder Bäckerei, die du willst.",
			],
			values: [
				{ title: "Echte Zutaten", text: "Lokales Mehl, fairer Kakao, echte Vanille." },
				{ title: "Von Hand gemacht", text: "Keine Abkürzungen, keine Fabrikbleche." },
				{ title: "Lokal verwurzelt", text: "Eine Theke, die deine Bestellung kennt." },
			],
		},
	},

	ar: {
		brand: { tagline: "مخبوز على مهل، كل صباح" },
		contact: {
			area: "البلدة القديمة",
			note: "بيانات وهمية — استبدلها في إعدادات العميل.",
			hours: [
				{ day: "الإثنين", value: "مغلق" },
				{ day: "الثلاثاء – الجمعة", value: "7:30 – 19:00" },
				{ day: "السبت", value: "8:00 – 20:00" },
				{ day: "الأحد", value: "8:00 – 14:00" },
			],
		},
		home: {
			heroKicker: "مخبز حِرَفي",
			heroTitle: "فرحة مخبوزة على مهل، كل صباح",
			heroSubtitle: "عجين مخمّر ومعجّنات وكعك بكميات صغيرة — تُصنع يدويًا وأطيب ما تكون دافئة.",
			announcement: "صواني طازجة من الفرن الساعة 7:30 و15:00 يوميًا.",
			highlights: [
				{ title: "دفعات صغيرة", text: "يُخبز مرتين يوميًا" },
				{ title: "باليد", text: "كل غرام موزون" },
				{ title: "في نفس اليوم", text: "توصيل واستلام محلي" },
			],
		},
		menu: {
			categories: [
				{ label: "معجّنات" },
				{ label: "كعك وقطع" },
				{ label: "بسكويت" },
				{ label: "خبز" },
				{ label: "مشروبات" },
			],
			products: [
				{ name: "كرواسون بالزبدة", description: "اثنتان وثلاثون طبقة زبدة، قرمشة رائعة.", tags: ["الأكثر مبيعًا"] },
				{ name: "بان أو شوكولا", description: "قطعتا شوكولاتة داكنة في عجين مورّق." },
				{ name: "لفافة الفستق", description: "عجين مورّق ملفوف، كريمة فستق ومكسرات محمّصة." },
				{ name: "عقدة الهيل", description: "بنكهة الهيل، سكر لؤلؤي وقلب طري." },
				{ name: "كعكة الفانيلا", description: "ثلاث طبقات، فانيلا حقيقية وكريمة خفيفة.", tags: ["قطعة"] },
				{ name: "تورتة الشوكولاتة الداكنة", description: "بلا دقيق، غنية، مع لمسة ملح البحر." },
				{ name: "تشيز كيك التوت", description: "تشيز كيك فانيلا مخبوز مع توت الموسم." },
				{ name: "كعكة الليمون وزيت الزيتون", description: "منعشة وطرية، مرشوشة بالسكر الناعم." },
				{ name: "كوكيز الشوكولاتة والملح", description: "قلب سائل، ثلاثة أنواع كاكاو، رقائق ملح." },
				{ name: "سابليه الفستق", description: "بسكويت زبدة هش مع فستق محمّص." },
				{ name: "شوفان وزبيب", description: "طري، بتوابل خفيفة، مريح." },
				{ name: "خبز الريف بالخميرة", description: "خميرة ثلاثة أيام، قشرة مقرمشة وقلب مفتوح.", tags: ["رغيف"] },
				{ name: "خبز الجاودار بالبذور", description: "كثيف وغني، يُقطّع عند الطلب." },
				{ name: "خبز بريوش (×4)", description: "قلب طري بالزبدة وسطح لامع." },
				{ name: "فلات وايت", description: "ريستريتو مزدوج ورغوة حريرية." },
				{ name: "لاتيه الفستق المثلج", description: "فستق البيت، حليب بارد وإسبريسو." },
				{ name: "شاي بالبهارات", description: "شاي أسود، هيل، قرفة وزنجبيل." },
			],
		},
		music: {
			kicker: "راديو المخبز",
			title: "أوريليا ميوزيك",
			intro: "الأجواء التي تصدح في المخبز عند الفجر — تُولّد مباشرةً فلا تتكرر أبدًا. اختر مزاجًا واخبز على إيقاعه.",
		},
		classes: {
			kicker: "مدرسة المخبز",
			title: "دورات وورش",
			intro: "دروس عملية صغيرة يقودها خبّازونا. المريلة والمكونات والقهوة مشمولة.",
			items: [
				{ title: "ترقيق الكرواسون 101", date: "السبت 12 يوليو · 10:00", duration: "3 ساعات", level: "مبتدئ", description: "أتقن الطي: كتل الزبدة واللفات والخَبز المثالي." },
				{ title: "الخميرة من الصفر", date: "الأحد 20 يوليو · 09:30", duration: "4 ساعات", level: "كل المستويات", description: "كوّن خميرة، شكّل رغيفًا وخذ خبزًا معك." },
				{ title: "كعك الطبقات والكريمة", date: "السبت 26 يوليو · 14:00", duration: "3 ساعات", level: "متوسط", description: "سوِّ، احشُ وزيّن كالمحترفين." },
				{ title: "نادي كوكيز الأطفال", date: "الأحد 3 أغسطس · 11:00", duration: "ساعة ونصف", level: "6–11 سنة", description: "رقّ وقصّ وزيّن وكُل. يشاهد الكبار." },
			],
		},
		catering: {
			kicker: "المناسبات",
			title: "الضيافة والصواني",
			intro: "إفطارات وطاولات حلويات وصناديق للمكاتب والأعراس والاحتفالات.",
			packages: [
				{ name: "صندوق معجنات الصباح", items: ["كرواسون وبان أو شوكولا", "دنماركي صغير", "فاكهة الموسم", "مربّى وزبدة"] },
				{ name: "كعكة الاحتفال", items: ["ثلاث طبقات بنكهاتك", "رسالة مكتوبة يدويًا", "شموع وعلبة تقديم"] },
				{ name: "طاولة الحلويات", items: ["كعك وفطائر متنوعة", "بسكويت وماكارون", "تنسيق في الموقع"] },
			],
		},
		giftCards: {
			kicker: "الهدايا",
			title: "بطاقات الهدايا",
			intro: "علبة فرح صغيرة — بالبريد أو مطبوعة في المتجر، تُستبدل بأي شيء نخبزه.",
			note: "بطاقات الهدايا الرقمية للعرض التوضيحي فقط.",
		},
		rewards: {
			kicker: "الولاء",
			title: "نادي الفتات",
			intro: "اكسب فتاتة مع كل طلب. اجمعها لتحصل على مخبوزات مجانية ووصول مبكر لقوائم الموسم.",
			pointsName: "فتات",
			tiers: [
				{ reward: "قهوة مفلترة مجانًا" },
				{ reward: "أي معجّنة مجانًا" },
				{ reward: "علبة قطع كعك" },
				{ reward: "حجز مُفضّل + خصم 15%" },
			],
			perks: [
				{ text: "هدية في عيد ميلادك كل عام" },
				{ text: "استلام بلا طابور" },
				{ text: "عروض موسمية للأعضاء فقط" },
			],
		},
		story: {
			kicker: "قصتنا",
			heading: "من فرن المنزل إلى مخبز حيّك",
			paragraphs: [
				"بدأت أوريليا كما تبدأ الأشياء الجميلة — بحبٍّ عنيد للحِرفة ومطبخٍ تفوح منه رائحة الزبدة دائمًا. تحوّل خبز نهاية الأسبوع للأصدقاء إلى طاولة، ثم طابور، ثم بيت.",
				"ما زلنا نخبز بكميات صغيرة، ونزن كل غرام باليد، ونؤمن أن الصباح أجمل بشيء دافئ. دقيقنا مطحون محليًا، ولا يخرج من المخبز ما لا نقدّمه على مائدتنا.",
				"هذه واجهة وهمية — غيّر الكلمات والصور والألوان لتصبح أي مخبز تريده.",
			],
			values: [
				{ title: "مكونات حقيقية", text: "دقيق محلي، شوكولاتة عادلة، فانيلا حقيقية." },
				{ title: "صُنع يدوي", text: "بلا اختصارات، بلا صواني مصانع." },
				{ title: "متجذّر محليًا", text: "طاولة تعرف طلبك." },
			],
		},
	},
};
