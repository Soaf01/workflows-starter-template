import { useCallback, useEffect, useState } from "react";
import { config } from "../config";

const KEY = `${config.slug}-account`;

export interface AccountApi {
	member: boolean;
	name: string;
	signIn: (name: string) => void;
	signOut: () => void;
}

interface Stored {
	member: boolean;
	name: string;
}

function load(): Stored {
	try {
		const raw = localStorage.getItem(KEY);
		if (raw) {
			const p = JSON.parse(raw) as Stored;
			if (typeof p?.member === "boolean") return { member: p.member, name: p.name ?? "" };
		}
	} catch {
		/* ignore */
	}
	return { member: false, name: "" };
}

export function useAccount(): AccountApi {
	const [state, setState] = useState<Stored>(load);

	useEffect(() => {
		try {
			localStorage.setItem(KEY, JSON.stringify(state));
		} catch {
			/* ignore */
		}
	}, [state]);

	const signIn = useCallback((name: string) => setState({ member: true, name: name.trim() || "Member" }), []);
	const signOut = useCallback(() => setState({ member: false, name: "" }), []);

	return { member: state.member, name: state.name, signIn, signOut };
}
