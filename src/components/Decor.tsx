/**
 * Small reusable decorative marks and icons — all inline SVG, no assets.
 */

export function Logo({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 512 512" className={className} role="img" aria-label="Maison Miellune">
			<defs>
				<radialGradient id="logo-honey" cx="38%" cy="30%" r="82%">
					<stop offset="0%" stopColor="#f7d081" />
					<stop offset="55%" stopColor="#eaa945" />
					<stop offset="100%" stopColor="#cf8422" />
				</radialGradient>
				<linearGradient id="logo-drop" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#fbe9b8" />
					<stop offset="45%" stopColor="#f0b64e" />
					<stop offset="100%" stopColor="#d98a26" />
				</linearGradient>
			</defs>
			<rect width="512" height="512" rx="128" fill="url(#logo-honey)" />
			<path
				fillRule="evenodd"
				fill="#fff6e6"
				d="M116 252 a140 140 0 1 0 280 0 a140 140 0 1 0 -280 0 Z
				   M190 230 a126 126 0 1 1 252 0 a126 126 0 1 1 -252 0 Z"
			/>
			<path
				d="M280 150 C280 150 340 232 340 280 a58 58 0 1 1 -116 0 C224 232 280 150 280 150 Z"
				fill="url(#logo-drop)"
				stroke="#b9741d"
				strokeWidth="5"
			/>
			<path d="M162 158 l7 18 18 7 -18 7 -7 18 -7 -18 -18 -7 18 -7 z" fill="#fff7e6" />
		</svg>
	);
}

export function ValueIcon({ name, className }: { name: string; className?: string }) {
	const common = {
		className,
		viewBox: "0 0 48 48",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 2.4,
		strokeLinecap: "round" as const,
		strokeLinejoin: "round" as const,
		role: "img" as const,
		"aria-hidden": true,
	};
	if (name === "whisk") {
		return (
			<svg {...common}>
				<path d="M24 6v10" />
				<path d="M16 40 22 18" />
				<path d="M32 40 26 18" />
				<ellipse cx="24" cy="20" rx="10" ry="14" />
				<path d="M24 6v14M17 8l4 12M31 8l-4 12" />
				<path d="M14 40h20" />
			</svg>
		);
	}
	if (name === "globe") {
		return (
			<svg {...common}>
				<circle cx="24" cy="24" r="17" />
				<path d="M7 24h34M24 7c8 8 8 26 0 34M24 7c-8 8-8 26 0 34" />
				<path d="M11 15c8 5 18 5 26 0M11 33c8-5 18-5 26 0" />
			</svg>
		);
	}
	// leaf
	return (
		<svg {...common}>
			<path d="M10 38C8 22 22 8 40 8c2 16-10 30-26 30-2 0-3 0-4 0Z" />
			<path d="M12 36C20 28 30 18 38 10" />
		</svg>
	);
}

export function Bee({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 64 40" className={className} role="img" aria-hidden="true">
			<path d="M14 20 Q24 6 40 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 4" strokeLinecap="round" opacity="0.5" />
			<ellipse cx="46" cy="22" rx="12" ry="9" fill="#eaa945" />
			<path d="M40 15 a12 9 0 0 0 0 14 M47 13.5 a12 9 0 0 1 0 17" stroke="#3a281d" strokeWidth="2.4" fill="none" />
			<ellipse cx="38" cy="16" rx="7" ry="4" fill="#fff" opacity="0.85" transform="rotate(-24 38 16)" />
			<ellipse cx="44" cy="14" rx="7" ry="4" fill="#fff" opacity="0.85" transform="rotate(-6 44 14)" />
			<circle cx="57" cy="20" r="1.4" fill="#3a281d" />
		</svg>
	);
}

/** A soft wave separator. `flip` mirrors it vertically. */
export function WaveDivider({
	className,
	fill = "currentColor",
	flip = false,
}: {
	className?: string;
	fill?: string;
	flip?: boolean;
}) {
	return (
		<svg
			viewBox="0 0 1440 90"
			preserveAspectRatio="none"
			className={className}
			style={flip ? { transform: "scaleY(-1)" } : undefined}
			aria-hidden="true"
		>
			<path
				d="M0 40 C 240 90 480 90 720 55 C 960 20 1200 20 1440 55 L1440 90 L0 90 Z"
				fill={fill}
			/>
		</svg>
	);
}

export function Sparkle({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" className={className} role="img" aria-hidden="true">
			<path d="M12 2 l2.2 6.2 6.2 2.2 -6.2 2.2 -2.2 6.2 -2.2 -6.2 -6.2 -2.2 6.2 -2.2 z" fill="currentColor" />
		</svg>
	);
}
