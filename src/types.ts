/** Runtime app types (content types live in src/config/types.ts). */

export interface CartLine {
	id: string;
	quantity: number;
}

export interface OrderResult {
	ok: boolean;
	reference?: string;
	itemCount?: number;
	total?: number;
	message?: string;
	error?: string;
}
