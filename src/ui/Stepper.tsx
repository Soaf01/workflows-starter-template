export function Stepper({
	value,
	onDec,
	onInc,
	size = "md",
}: {
	value: number;
	onDec: () => void;
	onInc: () => void;
	size?: "sm" | "md";
}) {
	const dim = size === "sm" ? "h-7 w-7" : "h-9 w-9";
	return (
		<div className="inline-flex items-center gap-1 rounded-full border border-line bg-black/20 p-1">
			<button
				onClick={onDec}
				className={`flex ${dim} items-center justify-center rounded-full text-ink transition-colors hover:bg-white/10`}
				aria-label="Decrease"
			>
				<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
					<path d="M6 12h12" strokeLinecap="round" />
				</svg>
			</button>
			<span className="min-w-6 text-center font-mono text-sm font-semibold tabular-nums text-ink">
				{value}
			</span>
			<button
				onClick={onInc}
				className={`flex ${dim} items-center justify-center rounded-full text-[#241a10] transition-transform active:scale-90`}
				style={{ background: "linear-gradient(180deg,var(--gold-soft),var(--gold))" }}
				aria-label="Increase"
			>
				<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
					<path d="M12 6v12M6 12h12" strokeLinecap="round" />
				</svg>
			</button>
		</div>
	);
}
