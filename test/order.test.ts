import { SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";
import { menu, treatById } from "../src/data/menu";

describe("menu data", () => {
	it("has unique ids and positive prices", () => {
		const ids = new Set(menu.map((t) => t.id));
		expect(ids.size).toBe(menu.length);
		expect(menu.every((t) => t.price > 0)).toBe(true);
	});

	it("looks up treats by id", () => {
		expect(treatById(menu[0].id)?.name).toBe(menu[0].name);
		expect(treatById("does-not-exist")).toBeUndefined();
	});
});

describe("/api/order", () => {
	it("accepts a valid basket and returns a reference", async () => {
		const res = await SELF.fetch("https://example.com/api/order", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				items: [
					{ id: "croissant-beurre", name: "Croissant", quantity: 2, price: 2.2 },
				],
			}),
		});
		expect(res.status).toBe(200);
		const data = (await res.json()) as {
			ok: boolean;
			reference: string;
			itemCount: number;
			total: number;
		};
		expect(data.ok).toBe(true);
		expect(data.reference).toMatch(/^MM-/);
		expect(data.itemCount).toBe(2);
		expect(data.total).toBeCloseTo(4.4, 2);
	});

	it("rejects an empty basket", async () => {
		const res = await SELF.fetch("https://example.com/api/order", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ items: [] }),
		});
		expect(res.status).toBe(400);
	});

	it("404s unknown api routes", async () => {
		const res = await SELF.fetch("https://example.com/api/nope");
		expect(res.status).toBe(404);
	});
});
