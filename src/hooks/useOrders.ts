import { useCallback, useEffect, useState } from "react";
import { config } from "../config";

const KEY = `${config.slug}-orders`;

export interface Order {
	ref: string;
	items: { name: string; quantity: number }[];
	total: number;
	at: number;
	status: string;
}

export interface OrdersApi {
	list: Order[];
	add: (order: Order) => void;
}

function load(): Order[] {
	try {
		const raw = localStorage.getItem(KEY);
		const p: unknown = raw ? JSON.parse(raw) : [];
		if (Array.isArray(p)) return p as Order[];
	} catch {
		/* ignore */
	}
	return [];
}

export function useOrders(): OrdersApi {
	const [list, setList] = useState<Order[]>(load);

	useEffect(() => {
		try {
			localStorage.setItem(KEY, JSON.stringify(list.slice(0, 20)));
		} catch {
			/* ignore */
		}
	}, [list]);

	const add = useCallback((order: Order) => setList((prev) => [order, ...prev].slice(0, 20)), []);

	return { list, add };
}
