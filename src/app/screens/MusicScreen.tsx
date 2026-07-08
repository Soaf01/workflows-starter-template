import { useI18n } from "../../i18n/lang";
import { useWorldMusic } from "../../hooks/useWorldMusic";

export function MusicScreen() {
	const { t, cfg } = useI18n();
	const { playing, regionId, setRegion, volume, setVolume, toggle, regions } = useWorldMusic();
	const current = regions.find((r) => r.id === regionId) ?? regions[0];

	return (
		<div className="screen-pad animate-fade-in pt-4">
			<p className="kicker">{cfg.music.kicker}</p>
			<h1 className="mt-1 font-display text-3xl font-bold text-ink">{cfg.music.title}</h1>
			<p className="mt-2 text-sm text-muted">{cfg.music.intro}</p>

			<div className="mt-8 flex flex-col items-center">
				<div
					className={`relative h-56 w-56 rounded-full ${playing ? "animate-[spin_16s_linear_infinite]" : ""}`}
					style={{
						background: "repeating-radial-gradient(circle at center, #0d0a07 0 3px, #14100b 3px 6px)",
						boxShadow: `0 20px 60px -18px ${current.color}77`,
					}}
				>
					<div className="absolute inset-0 rounded-full" style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,0.6)" }} />
					<div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-display text-3xl font-bold text-[#241a10]" style={{ background: `linear-gradient(180deg, ${current.color}, ${current.color}bb)` }}>
						{cfg.brand.monogram}
					</div>
					<div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />
				</div>

				<div className="mt-6 text-center">
					<p className="font-display text-xl font-semibold text-ink">{current.name}</p>
					<p className="text-xs uppercase tracking-widest text-muted">{current.place}</p>
				</div>

				<button onClick={() => toggle()} className="mt-5 flex h-16 w-16 items-center justify-center rounded-full text-[#241a10] shadow-gold transition-transform active:scale-95" style={{ background: "linear-gradient(180deg,var(--gold-soft),var(--gold))" }} aria-label={playing ? t("common.pause") : t("common.play")}>
					{playing ? (
						<svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.2" /><rect x="14" y="5" width="4" height="14" rx="1.2" /></svg>
					) : (
						<svg viewBox="0 0 24 24" className="h-7 w-7 translate-x-0.5" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
					)}
				</button>

				<div className="mt-5 flex w-full max-w-xs items-center gap-2 text-muted">
					<svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M4 9v6h4l5 5V4L8 9H4z" /></svg>
					<input type="range" min={0} max={1} step={0.05} value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-gold" aria-label={t("common.volume")} />
				</div>
			</div>

			<p className="mt-8 kicker">{t("music.moods")}</p>
			<div className="mt-3 grid grid-cols-3 gap-2">
				{regions.map((r) => {
					const on = r.id === regionId;
					return (
						<button key={r.id} onClick={() => setRegion(r.id)} className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-xs font-semibold transition-colors ${on ? "border-transparent text-[#241a10]" : "border-line text-muted"}`} style={on ? { background: `linear-gradient(180deg, ${r.color}, ${r.color}cc)` } : undefined} aria-pressed={on}>
							<span className="text-lg leading-none">{r.glyph}</span>
							{r.name}
						</button>
					);
				})}
			</div>
			<p className="mt-4 text-center text-[11px] text-muted">{t("music.note")}</p>
		</div>
	);
}
