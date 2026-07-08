import type { IconName } from "../config/types";

const PATHS: Record<IconName, string> = {
	home: "M4 11l8-7 8 7M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9",
	bag: "M6 8h12l-1 12H7L6 8zM9 8a3 3 0 0 1 6 0",
	music: "M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm0 0V6l11-2v10m0 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
	book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5zM19 3v16",
	sparkles:
		"M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4zM18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15z",
	gift: "M4 11h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9zM4 8h16v3H4zM12 8v13M12 8S9.5 3 7 5.5 12 8 12 8zM12 8s2.5-5 5-2.5S12 8 12 8z",
	cake: "M4 20h16M5 20v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7M4 15c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2M12 6V3m0 3c-1 0-1.6-.8-1.6-1.6C10.4 3.6 12 2 12 2s1.6 1.6 1.6 2.4C13.6 5.2 13 6 12 6z",
	class: "M3 7l9-4 9 4-9 4-9-4zM7 9v5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V9M21 7v5",
	star: "M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6.1L12 17l-5.4 2.7 1.2-6.1L3.3 9.4l6.1-.8L12 3z",
	phone: "M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
	whatsapp:
		"M4 20l1.4-4.2A8 8 0 1 1 8.5 18.6L4 20zM9 8.5c-.3 0-.6.1-.8.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.8 4.3 3.8 2.1.8 2.6.7 3 .6.6-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.6-.4",
	pin: "M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
	clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
	instagram:
		"M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM17 6.5h.01",
	leaf: "M4 20C2 10 10 4 20 4c0 10-6 16-14 16-1 0-2 0-2 0zM6 18C12 14 16 10 18 6",
	heart: "M12 20S4 14.5 4 9.2A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 8 2.2C20 14.5 12 20 12 20z",
	truck: "M3 6h11v10H3zM14 9h4l3 3v4h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
	store: "M4 9l1.5-5h13L20 9M4 9h16v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9zM4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0M9 20v-5h6v5",
	user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0",
};

export function Icon({
	name,
	className = "h-5 w-5",
	strokeWidth = 1.8,
}: {
	name: IconName;
	className?: string;
	strokeWidth?: number;
}) {
	return (
		<svg
			viewBox="0 0 24 24"
			className={className}
			fill="none"
			stroke="currentColor"
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
			role="img"
			aria-hidden="true"
		>
			<path d={PATHS[name]} />
		</svg>
	);
}
