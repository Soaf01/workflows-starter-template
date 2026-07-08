import { aurelia } from "./clients/aurelia";
import type { ClientConfig, Product } from "./types";

/**
 * Active-client resolver. Add a client under ./clients, register it here, and
 * select it at build time with `VITE_CLIENT=<slug>` — everything else adapts.
 */
const clients: Record<string, ClientConfig> = {
	aurelia,
};

const requested =
	((typeof import.meta !== "undefined" && import.meta.env?.VITE_CLIENT) as
		| string
		| undefined) ?? "aurelia";

export const config: ClientConfig = clients[requested] ?? aurelia;

export const productById = (id: string): Product | undefined =>
	config.menu.products.find((p) => p.id === id);

export function money(value: number): string {
	const n = value.toFixed(2);
	return config.currency.position === "before"
		? `${config.currency.symbol}${n}`
		: `${n}${config.currency.symbol}`;
}
