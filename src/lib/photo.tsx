import { useState } from "react";

/**
 * Photo resolution for the white-label template.
 *
 * A config `image` value can be:
 *   - a full URL (https://…) or absolute path (/img/…)  → used verbatim
 *   - a keyword string ("butter croissant, pastry")     → resolved to a
 *     royalty-free stock photo (LoremFlickr, Creative-Commons), with an
 *     automatic Picsum fallback so an image is NEVER broken.
 *
 * For a real client you'd drop professional/AI photos into /public/img/ and
 * point the config at them — no code changes.
 */

function hash(s: string): number {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return Math.abs(h);
}

function isDirect(src: string): boolean {
	return /^(https?:|\/|data:)/.test(src);
}

function primarySrc(src: string, w = 800, h = 800): string {
	if (isDirect(src)) return src;
	const kw = encodeURIComponent(src.replace(/\s+/g, ""));
	const lock = (hash(src) % 900) + 1;
	return `https://loremflickr.com/${w}/${h}/${kw}?lock=${lock}`;
}

function fallbackSrc(src: string, w = 800, h = 800): string {
	const seed = encodeURIComponent(src).slice(0, 32) || "photo";
	return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

export function Photo({
	src,
	alt,
	className = "",
	width = 800,
	height = 800,
	rounded = "",
	eager = false,
}: {
	src: string;
	alt: string;
	className?: string;
	width?: number;
	height?: number;
	rounded?: string;
	eager?: boolean;
}) {
	const [stage, setStage] = useState<0 | 1>(0); // 0 = primary, 1 = fallback
	const [loaded, setLoaded] = useState(false);
	const url = stage === 0 ? primarySrc(src, width, height) : fallbackSrc(src, width, height);

	return (
		<span
			className={`relative block overflow-hidden bg-gradient-to-br from-[var(--surface-alt)] to-[var(--bg-elevated)] ${rounded} ${className}`}
			aria-hidden={false}
		>
			{/* subtle placeholder glyph until the photo paints */}
			<span
				className={`pointer-events-none absolute inset-0 flex items-center justify-center text-[var(--gold-soft)] transition-opacity duration-500 ${
					loaded ? "opacity-0" : "opacity-40"
				}`}
			>
				<svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
					<rect x="3" y="4" width="18" height="16" rx="2" />
					<circle cx="8.5" cy="9.5" r="1.6" />
					<path d="M4 17l5-5 4 4 3-3 4 4" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</span>
			<img
				src={url}
				alt={alt}
				loading={eager ? "eager" : "lazy"}
				decoding="async"
				onLoad={() => setLoaded(true)}
				onError={() => {
					if (stage === 0) {
						setStage(1);
					}
				}}
				className={`h-full w-full object-cover transition-opacity duration-700 ${
					loaded ? "opacity-100" : "opacity-0"
				}`}
			/>
		</span>
	);
}
