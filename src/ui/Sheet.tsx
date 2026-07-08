import { useEffect } from "react";
import type { ReactNode } from "react";

/** Bottom sheet modal, sized to the phone frame it lives in. */
export function Sheet({
	open,
	onClose,
	title,
	children,
	footer,
}: {
	open: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	footer?: ReactNode;
}) {
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	return (
		<div
			className={`absolute inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
			aria-hidden={!open}
		>
			<div
				onClick={onClose}
				className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
					open ? "opacity-100" : "opacity-0"
				}`}
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={title}
				className={`absolute inset-x-0 bottom-0 flex max-h-[88%] flex-col rounded-t-[28px] border-t border-line bg-bg-elevated shadow-card transition-transform duration-300 ease-out ${
					open ? "translate-y-0" : "translate-y-full"
				}`}
			>
				<div className="flex flex-col items-center pt-3">
					<span className="h-1.5 w-10 rounded-full bg-white/15" />
				</div>
				{title && (
					<div className="flex items-center justify-between px-5 pb-2 pt-3">
						<h2 className="font-display text-xl text-ink">{title}</h2>
						<button
							onClick={onClose}
							className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted hover:text-ink"
							aria-label="Close"
						>
							<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
								<path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
							</svg>
						</button>
					</div>
				)}
				<div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-4">{children}</div>
				{footer && <div className="border-t border-line px-5 py-4 safe-b">{footer}</div>}
			</div>
		</div>
	);
}
