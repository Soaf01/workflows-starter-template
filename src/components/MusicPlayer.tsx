import { useState } from "react";
import { useWorldMusic } from "../hooks/useWorldMusic";

function Equalizer({ playing }: { playing: boolean }) {
	const bars = [
		{ x: 2, h: 8, y: 8 },
		{ x: 7, h: 14, y: 2 },
		{ x: 12, h: 10, y: 6 },
		{ x: 17, h: 5, y: 11 },
	];
	return (
		<svg viewBox="0 0 21 18" className="h-4 w-4" aria-hidden="true">
			{bars.map((b, i) => (
				<rect
					key={i}
					x={b.x}
					y={b.y}
					width="3"
					height={b.h}
					rx="1.5"
					fill="currentColor"
				>
					{playing && (
						<animate
							attributeName="height"
							values={`${b.h};3;${b.h - 2};16;${b.h}`}
							dur={`${0.9 + i * 0.25}s`}
							repeatCount="indefinite"
						/>
					)}
					{playing && (
						<animate
							attributeName="y"
							values={`${b.y};${b.y + 6};${b.y + 3};${b.y - 5};${b.y}`}
							dur={`${0.9 + i * 0.25}s`}
							repeatCount="indefinite"
						/>
					)}
				</rect>
			))}
		</svg>
	);
}

export function MusicPlayer() {
	const { playing, regionId, setRegion, volume, setVolume, toggle, regions } =
		useWorldMusic();
	const [open, setOpen] = useState(false);
	const current = regions.find((r) => r.id === regionId) ?? regions[0];

	return (
		<div className="fixed bottom-4 left-4 z-40 print:hidden">
			{/* Expanded panel */}
			<div
				className={`card mb-3 w-[min(20rem,calc(100vw-2rem))] origin-bottom-left overflow-hidden shadow-card transition-all duration-300 ${
					open
						? "pointer-events-auto scale-100 opacity-100"
						: "pointer-events-none translate-y-2 scale-95 opacity-0"
				}`}
			>
				<div className="border-b border-cocoa-900/10 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
					<p className="eyebrow">Ambiance du monde</p>
					<div className="mt-1 flex items-baseline justify-between gap-2">
						<h3 className="font-serif text-lg leading-tight text-cocoa-800 dark:text-cream-100">
							{current.name}
						</h3>
						<span className="text-xs text-cocoa-600/80 dark:text-cream-200/60">
							{current.place}
						</span>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-1.5 p-3">
					{regions.map((r) => {
						const active = r.id === regionId;
						return (
							<button
								key={r.id}
								onClick={() => setRegion(r.id)}
								className={`flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[11px] font-medium transition-all ${
									active
										? "text-white shadow-soft"
										: "bg-cream-200/60 text-cocoa-700 hover:bg-cream-300 dark:bg-white/5 dark:text-cream-200 dark:hover:bg-white/10"
								}`}
								style={active ? { backgroundColor: r.color } : undefined}
								aria-pressed={active}
							>
								<span className="text-base leading-none">{r.glyph}</span>
								<span className="leading-tight">{r.name}</span>
							</button>
						);
					})}
				</div>

				<div className="flex items-center gap-3 px-4 pb-4">
					<button
						onClick={() => toggle()}
						className="btn-primary !px-4 !py-2"
						aria-label={playing ? "Mettre en pause" : "Écouter"}
					>
						{playing ? (
							<svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
								<rect x="6" y="5" width="4" height="14" rx="1.2" />
								<rect x="14" y="5" width="4" height="14" rx="1.2" />
							</svg>
						) : (
							<svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
								<path d="M8 5.5v13l11-6.5z" />
							</svg>
						)}
						{playing ? "Pause" : "Jouer"}
					</button>
					<label className="flex flex-1 items-center gap-2 text-cocoa-600 dark:text-cream-200/70">
						<svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
							<path d="M4 9v6h4l5 5V4L8 9H4z" />
						</svg>
						<input
							type="range"
							min={0}
							max={1}
							step={0.05}
							value={volume}
							onChange={(e) => setVolume(Number(e.target.value))}
							className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-cream-300 accent-honey-500 dark:bg-white/15"
							aria-label="Volume"
						/>
					</label>
				</div>
			</div>

			{/* Trigger pill */}
			<button
				onClick={() => setOpen((o) => !o)}
				className="btn-ghost group !px-4 !py-2.5 shadow-card"
				aria-expanded={open}
				aria-label="Ambiance musicale"
			>
				<span
					className="relative flex h-7 w-7 items-center justify-center rounded-full text-cocoa-900"
					style={{ backgroundColor: current.color }}
				>
					<Equalizer playing={playing} />
				</span>
				<span className="hidden text-sm font-semibold sm:inline">
					{playing ? current.name : "Musique du monde"}
				</span>
				<svg
					viewBox="0 0 24 24"
					className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					strokeWidth="2.4"
					aria-hidden="true"
				>
					<path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</button>
		</div>
	);
}
