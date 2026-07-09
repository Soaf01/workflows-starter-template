import { useCallback, useEffect, useState } from "react";
import { config } from "../config";

const KEY = `${config.slug}-favs`;

export interface FavApi {
	ids: string[];
	has: (id: string) => boolean;
	toggle: (id: string) => void;
}

function load(): string[] {
	try {
		const raw = localStorage.getItem(KEY);
		const p: unknown = raw ? JSON.parse(raw) : [];
		if (Array.isArray(p)) return p.filter((x): x is string => typeof x === "string");
	} catch {
		/* ignore */
	}
	return [];
}

export function useFavourites(): FavApi {
	const [ids, setIds] = useState<string[]>(load);

	useEffect(() => {
		try {
			localStorage.setItem(KEY, JSON.stringify(ids));
		} catch {
			/* ignore */
		}
	}, [ids]);

	const has = useCallback((id: string) => ids.includes(id), [ids]);
	const toggle = useCallback(
		(id: string) => setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
		[],
	);

	return { ids, has, toggle };
}
