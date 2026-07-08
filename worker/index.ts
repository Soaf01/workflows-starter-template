/**
 * Maison Miellune — Worker entrypoint
 *
 * The app itself is a fully static, offline-capable Progressive Web App. This
 * Worker only exists to (a) serve the built static assets and (b) expose a
 * tiny, dependency-free demo endpoint so the "order" flow has something to talk
 * to. Everything here is generic sample logic — swap it for a real backend
 * (email, database, payment provider) when you adapt the template.
 */

interface OrderItem {
	id: string;
	name: string;
	quantity: number;
	price: number;
}

interface OrderPayload {
	items: OrderItem[];
	name?: string;
	note?: string;
}

// Deterministic, dependency-free pseudo-id (no crypto/Date coupling needed).
function makeReference(seed: number): string {
	const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
	let n = Math.abs(Math.floor(seed)) || 1;
	let out = "";
	for (let i = 0; i < 6; i++) {
		out += alphabet[n % alphabet.length];
		n = Math.floor(n / alphabet.length) + (i + 7);
	}
	return `MM-${out}`;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		// Demo "order" endpoint. Validates the cart shape and echoes a reference.
		if (url.pathname === "/api/order" && request.method === "POST") {
			let body: OrderPayload;
			try {
				body = (await request.json()) as OrderPayload;
			} catch {
				return Response.json(
					{ ok: false, error: "Invalid JSON body." },
					{ status: 400 },
				);
			}

			if (!body || !Array.isArray(body.items) || body.items.length === 0) {
				return Response.json(
					{ ok: false, error: "Your basket is empty." },
					{ status: 400 },
				);
			}

			const total = body.items.reduce(
				(sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
				0,
			);
			const count = body.items.reduce(
				(sum, item) => sum + (Number(item.quantity) || 0),
				0,
			);

			return Response.json({
				ok: true,
				reference: makeReference(total * 100 + count),
				itemCount: count,
				total: Math.round(total * 100) / 100,
				message: "Order received — this is a demo confirmation.",
			});
		}

		if (url.pathname.startsWith("/api/")) {
			return Response.json({ ok: false, error: "Not found" }, { status: 404 });
		}

		// Everything else is a static asset (with SPA fallback to index.html).
		return env.ASSETS.fetch(request);
	},
} satisfies ExportedHandler<Env>;
