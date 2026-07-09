import { useState } from "react";
import { useI18n } from "../../i18n/lang";
import { useWorldMusic } from "../../hooks/useWorldMusic";
import { useApp } from "../appContext";
import { Icon } from "../../ui/Icon";
import { dailyTrackIndices } from "../../lib/dailyPicks";

export function MusicScreen() {
	const { t, cfg } = useI18n();
	const { playing, regionId, setRegion, volume, setVolume, toggle, regions } = useWorldMusic();
	const { account, navigate } = useApp();
	const current = regions.find((r) => r.id === regionId) ?? regions[0];
	const [nowPlaying, setNowPlaying] = useState<string | null>(null);

	const tracks = cfg.music.tracks;
	const todays = new Set(dailyTrackIndices(3));

	const playTrack = (index: number, id: string) => {
		const locked = !account.member && !todays.has(index);
		if (locked) {
			navigate("account");
			return;
		}
		setNowPlaying(id);
		if (!playing) toggle();
	};

	return (
		<div className="screen-pad animate-fade-in pt-4">
			<p className="kicker">{cfg.music.kicker}</p>
			<h1 className="mt-1 font-display text-3xl font-bold text-ink">{cfg.music.title}</h1>
			<p className="mt-2 text-sm text-muted">{cfg.music.intro}</p>

			{/* Live ambience disc */}
			<div className="mt-6 flex flex-col items-center">
				<div className={`relative h-40 w-40 rounded-full ${playing ? "animate-[spin_16s_linear_infinite]" : ""}`} style={{ background: "repeating-radial-gradient(circle at center, #0d0a07 0 3px, #14100b 3px 6px)", boxShadow: `0 16px 44px -16px ${current.color}77` }}>
					<div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-display text-xl font-bold text-[#241a10]" style={{ background: `linear-gradient(180deg, ${current.color}, ${current.color}bb)` }}>{cfg.brand.monogram}</div>
					<div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />
				</div>
				<div className="mt-3 text-center">
					<p className="text-xs uppercase tracking-widest text-muted">{t("music.liveAmbience")}</p>
					<p className="font-display text-lg font-semibold text-ink">{current.name}</p>
				</div>
				<div className="mt-3 flex items-center gap-3">
					<button onClick={() => toggle()} className="flex h-12 w-12 items-center justify-center rounded-full text-[#241a10] shadow-gold" style={{ background: "linear-gradient(180deg,var(--gold-soft),var(--gold))" }} aria-label={playing ? t("common.pause") : t("common.play")}>
						{playing ? (
							<svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.2" /><rect x="14" y="5" width="4" height="14" rx="1.2" /></svg>
						) : (
							<svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-0.5" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
						)}
					</button>
					<input type="range" min={0} max={1} step={0.05} value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="h-1.5 w-32 cursor-pointer appearance-none rounded-full bg-white/15 accent-gold" aria-label={t("common.volume")} />
				</div>
			</div>

			{/* Moods */}
			<p className="mt-7 kicker">{t("music.moods")}</p>
			<div className="mt-3 grid grid-cols-3 gap-2">
				{regions.map((r) => {
					const on = r.id === regionId;
					return (
						<button key={r.id} onClick={() => setRegion(r.id)} className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-2.5 text-[11px] font-semibold transition-colors ${on ? "border-transparent text-[#241a10]" : "border-line text-muted"}`} style={on ? { background: `linear-gradient(180deg, ${r.color}, ${r.color}cc)` } : undefined} aria-pressed={on}>
							<span className="text-base leading-none">{r.glyph}</span>
							{r.name}
						</button>
					);
				})}
			</div>

			{/* Playlist */}
			<div className="mt-7 flex items-center justify-between">
				<p className="kicker">{t("music.playlist")}</p>
				{!account.member && <span className="text-[11px] text-muted">{t("music.freeToday")}</span>}
			</div>
			<div className="mt-3 space-y-1.5">
				{tracks.map((track, i) => {
					const locked = !account.member && !todays.has(i);
					const isToday = todays.has(i);
					const active = nowPlaying === track.id && playing;
					return (
						<button key={track.id} onClick={() => playTrack(i, track.id)} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${active ? "border-gold bg-gold/5" : "border-line"} ${locked ? "opacity-70" : ""}`}>
							<span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${active ? "bg-gold text-[#241a10]" : "bg-black/25 text-gold"}`}>
								{locked ? <Icon name="lock" className="h-4 w-4" /> : <Icon name="play" className="h-4 w-4" />}
							</span>
							<span className="min-w-0 flex-1">
								<span className="flex items-center gap-2">
									<span className="truncate text-sm font-semibold text-ink">{track.title}</span>
									{isToday && <span className="shrink-0 rounded-full bg-gold/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-gold">{t("music.today")}</span>}
								</span>
								<span className="truncate text-xs text-muted">{track.artist}</span>
							</span>
							<span className="shrink-0 font-mono text-[11px] text-muted">{track.length}</span>
						</button>
					);
				})}
			</div>
			{!account.member && (
				<button onClick={() => navigate("account")} className="btn-ghost mt-4 w-full"><Icon name="lock" className="h-4 w-4" />{t("music.unlockFull")}</button>
			)}
			<p className="mt-4 text-center text-[11px] text-muted">{t("music.note")}</p>
		</div>
	);
}
