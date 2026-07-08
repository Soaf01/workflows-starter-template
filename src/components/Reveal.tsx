import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Fades + lifts its children into view once, when scrolled near.
 * Falls back to visible immediately if IntersectionObserver is missing or
 * the user prefers reduced motion.
 */
export function Reveal({
	children,
	className = "",
	delay = 0,
}: {
	children: ReactNode;
	className?: string;
	delay?: number;
}) {
	const ref = useRef<HTMLDivElement | null>(null);
	const [shown, setShown] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const reduce = window.matchMedia?.(
			"(prefers-reduced-motion: reduce)",
		).matches;
		if (reduce || typeof IntersectionObserver === "undefined") {
			setShown(true);
			return;
		}
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setShown(true);
					io.disconnect();
				}
			},
			{ threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			className={`${className} transition-all duration-700 ease-out will-change-transform ${
				shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
			}`}
			style={{ transitionDelay: `${delay}ms` }}
		>
			{children}
		</div>
	);
}
