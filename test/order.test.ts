import { SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";
import { config, productById } from "../src/config";

describe("client config", () => {
	it("has unique product ids and positive prices", () => {
		const ids = new Set(config.menu.products.map((p) => p.id));
		expect(ids.size).toBe(config.menu.products.length);
		expect(config.menu.products.every((p) => p.price > 0)).toBe(true);
	});

	it("looks up products by id", () => {
		const first = config.menu.products[0];
		expect(productById(first.id)?.name).toBe(first.name);
		expect(productById("nope")).toBeUndefined();
	});

	it("every featured id resolves to a product", () => {
		expect(config.home.featuredIds.every((id) => productById(id))).toBe(true);
	});
});

describe("/api/order", () => {
	it("accepts a valid basket and returns a reference", async () => {
		const res = await SELF.fetch("https://example.com/api/order", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				items: [{ id: "croissant", name: "Butter Croissant", quantity: 2, price: 3.5 }],
			}),
		});
		expect(res.status).toBe(200);
		const data = (await res.json()) as { ok: boolean; itemCount: number; total: number };
		expect(data.ok).toBe(true);
		expect(data.itemCount).toBe(2);
		expect(data.total).toBeCloseTo(7.0, 2);
	});

	it("rejects an empty basket", async () => {
		const res = await SELF.fetch("https://example.com/api/order", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ items: [] }),
		});
		expect(res.status).toBe(400);
	});
});
