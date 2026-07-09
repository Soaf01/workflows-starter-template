import { config } from "../config";

/** Rotating "today's picks" — a stable daily window into the playlist. */
export function dailyTrackIndices(count = 3): number[] {
	const n = config.music.tracks.length;
	if (n === 0) return [];
	const day = Math.floor(Date.now() / 86_400_000); // days since epoch
	const start = ((day % n) + n) % n;
	return Array.from({ length: Math.min(count, n) }, (_, i) => (start + i) % n);
}
