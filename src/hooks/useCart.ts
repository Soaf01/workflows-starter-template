import { useCallback, useEffect, useMemo, useState } from "react";
import type { CartLine } from "../types";
import { treatById } from "../data/menu";

const KEY = "miellune-cart-v1";

function load(): CartLine[] {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return [];
		const parsed: unknown = JSON.parse(raw);
		if (Array.isArray(parsed)) {
			return parsed
				.filter(
					(x): x is CartLine =>
						!!x &&
						typeof (x as CartLine).id === "string" &&
						typeof (x as CartLine).quantity === "number",
				)
				.filter((x) => treatById(x.id));
		}
	} catch {
		/* ignore corrupt storage */
	}
	return [];
}

export interface CartApi {
	lines: CartLine[];
	add: (id: string, qty?: number) => void;
	setQty: (id: string, qty: number) => void;
	remove: (id: string) => void;
	clear: () => void;
	count: number;
	total: number;
}

export function useCart(): CartApi {
	const [lines, setLines] = useState<CartLine[]>(load);

	useEffect(() => {
		try {
			localStorage.setItem(KEY, JSON.stringify(lines));
		} catch {
			/* storage may be unavailable */
		}
	}, [lines]);

	const add = useCallback((id: string, qty = 1) => {
		if (!treatById(id)) return;
		setLines((prev) => {
			const found = prev.find((l) => l.id === id);
			if (found) {
				return prev.map((l) =>
					l.id === id ? { ...l, quantity: Math.min(99, l.quantity + qty) } : l,
				);
			}
			return [...prev, { id, quantity: Math.min(99, qty) }];
		});
	}, []);

	const setQty = useCallback((id: string, qty: number) => {
		setLines((prev) =>
			qty <= 0
				? prev.filter((l) => l.id !== id)
				: prev.map((l) =>
						l.id === id ? { ...l, quantity: Math.min(99, qty) } : l,
					),
		);
	}, []);

	const remove = useCallback((id: string) => {
		setLines((prev) => prev.filter((l) => l.id !== id));
	}, []);

	const clear = useCallback(() => setLines([]), []);

	const count = useMemo(
		() => lines.reduce((s, l) => s + l.quantity, 0),
		[lines],
	);
	const total = useMemo(
		() =>
			lines.reduce((s, l) => {
				const t = treatById(l.id);
				return s + (t ? t.price * l.quantity : 0);
			}, 0),
		[lines],
	);

	return { lines, add, setQty, remove, clear, count, total };
}
