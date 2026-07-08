import { useId } from "react";
import type { ReactElement } from "react";
import type { IllustrationKey } from "../types";

/**
 * Hand-authored SVG artwork — no external images.
 * Each entry draws a stylised, recognisable treat on a 120×120 canvas
 * centred on an optional cream "plate". Gradient / mask ids are namespaced
 * with a per-instance uid so the same treat can render many times safely.
 */
type Art = (uid: string) => ReactElement;

const croissant: Art = (u) => (
	<g>
		<defs>
			<linearGradient id={`${u}c`} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stopColor="#f2ce7f" />
				<stop offset="55%" stopColor="#e0a44b" />
				<stop offset="100%" stopColor="#bd7c2c" />
			</linearGradient>
		</defs>
		<path
			d="M38 74 Q30 48 56 40 Q80 33 84 56"
			fill="none"
			stroke={`url(#${u}c)`}
			strokeWidth="16"
			strokeLinecap="round"
		/>
		<path d="M35 76 l-6 5 9 -1 z" fill="#c9852f" />
		<path d="M86 58 l7 -3 -3 8 z" fill="#c9852f" />
		{[
			"M44 50 l7 12",
			"M53 45 l7 13",
			"M63 44 l6 13",
			"M73 47 l5 12",
		].map((d, i) => (
			<path key={i} d={d} stroke="#9c6321" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
		))}
		<path d="M40 64 Q56 47 78 55" fill="none" stroke="#fff0cf" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
	</g>
);

const macaron: Art = (u) => (
	<g>
		<defs>
			<linearGradient id={`${u}s`} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stopColor="#f6b7c8" />
				<stop offset="100%" stopColor="#dd7a95" />
			</linearGradient>
		</defs>
		{/* little one behind */}
		<g transform="translate(80 66) scale(0.62)" opacity="0.9">
			<ellipse cx="0" cy="6" rx="22" ry="13" fill="#e9a24f" />
			<rect x="-22" y="-2" width="44" height="8" rx="4" fill="#fff2da" />
			<ellipse cx="0" cy="-6" rx="22" ry="13" fill="#f0b96a" />
		</g>
		{/* main macaron */}
		<ellipse cx="48" cy="70" rx="27" ry="15" fill={`url(#${u}s)`} />
		<rect x="21" y="58" width="54" height="11" rx="5.5" fill="#fff2da" />
		<ellipse cx="48" cy="56" rx="27" ry="15" fill={`url(#${u}s)`} />
		<ellipse cx="41" cy="50" rx="9" ry="4" fill="#ffd7e1" opacity="0.8" />
		{[26, 34, 42, 50, 58, 66].map((x) => (
			<circle key={x} cx={x} cy={64} r="1.6" fill="#c76684" opacity="0.7" />
		))}
	</g>
);

const eclair: Art = (u) => (
	<g>
		<defs>
			<linearGradient id={`${u}g`} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stopColor="#6a4227" />
				<stop offset="100%" stopColor="#48291a" />
			</linearGradient>
		</defs>
		<rect x="24" y="52" width="72" height="26" rx="13" fill="#eac07a" />
		<rect x="24" y="52" width="72" height="26" rx="13" fill="none" stroke="#cf9a4d" strokeWidth="1.5" />
		<rect x="28" y="49" width="64" height="15" rx="7.5" fill={`url(#${u}g)`} />
		<ellipse cx="44" cy="54" rx="8" ry="2.6" fill="#8a5a38" opacity="0.7" />
		<circle cx="66" cy="55" r="2" fill="#fff" opacity="0.35" />
	</g>
);

const tarte: Art = (u) => (
	<g>
		<defs>
			<radialGradient id={`${u}t`} cx="50%" cy="45%" r="60%">
				<stop offset="0%" stopColor="#fff6e4" />
				<stop offset="100%" stopColor="#ffe7bf" />
			</radialGradient>
		</defs>
		<circle cx="60" cy="60" r="30" fill="#dca44f" />
		<circle cx="60" cy="60" r="25" fill={`url(#${u}t)`} />
		{[
			[54, 52, "#d24a63"],
			[66, 52, "#a83354"],
			[48, 60, "#b83a58"],
			[60, 58, "#d24a63"],
			[72, 60, "#9c2f4e"],
			[54, 68, "#c23f5c"],
			[66, 68, "#d24a63"],
			[60, 46, "#5b3b8c"],
		].map(([x, y, c], i) => (
			<g key={i}>
				<circle cx={x as number} cy={y as number} r="5" fill={c as string} />
				<circle cx={(x as number) - 1.5} cy={(y as number) - 1.5} r="1.5" fill="#fff" opacity="0.5" />
			</g>
		))}
		<circle cx="60" cy="60" r="30" fill="none" stroke="#b9772d" strokeWidth="2" strokeDasharray="2 3" opacity="0.55" />
	</g>
);

const financier: Art = () => (
	<g>
		<rect x="34" y="52" width="52" height="26" rx="8" fill="#e6ab53" />
		<rect x="34" y="52" width="52" height="26" rx="8" fill="none" stroke="#c98a34" strokeWidth="1.5" />
		<rect x="40" y="56" width="40" height="7" rx="3.5" fill="#f6d391" opacity="0.8" />
		<ellipse cx="60" cy="53" rx="10" ry="4.5" fill="#d8b98a" />
		<path d="M60 49 Q64 53 60 57 Q56 53 60 49 Z" fill="#c39b63" />
	</g>
);

const baklava: Art = (u) => (
	<g>
		<defs>
			<linearGradient id={`${u}b`} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stopColor="#f4cd82" />
				<stop offset="100%" stopColor="#cf9642" />
			</linearGradient>
		</defs>
		<path d="M60 40 L88 60 L60 80 L32 60 Z" fill={`url(#${u}b)`} stroke="#b47f30" strokeWidth="1.5" />
		{[48, 56, 64].map((y, i) => (
			<path key={i} d={`M${40 + i * 2} ${y} L${80 - i * 2} ${y}`} stroke="#b98338" strokeWidth="1.4" opacity="0.55" />
		))}
		{[
			[56, 58],
			[64, 60],
			[60, 64],
			[54, 62],
		].map(([x, y], i) => (
			<circle key={i} cx={x} cy={y} r="2.4" fill="#7ba24f" />
		))}
		<path d="M40 56 L60 44 L80 56" fill="none" stroke="#fff1cf" strokeWidth="1.6" opacity="0.6" />
	</g>
);

const mochi: Art = (u) => (
	<g>
		<defs>
			<radialGradient id={`${u}m`} cx="42%" cy="35%" r="70%">
				<stop offset="0%" stopColor="#e2efc9" />
				<stop offset="100%" stopColor="#a9c97e" />
			</radialGradient>
		</defs>
		<path
			d="M60 42 C78 42 84 54 84 63 C84 74 74 80 60 80 C46 80 36 74 36 63 C36 54 42 42 60 42 Z"
			fill={`url(#${u}m)`}
			stroke="#8fb663"
			strokeWidth="1.2"
		/>
		<ellipse cx="50" cy="54" rx="10" ry="6" fill="#fff" opacity="0.35" />
		{[
			[52, 66],
			[60, 70],
			[68, 64],
			[58, 60],
		].map(([x, y], i) => (
			<circle key={i} cx={x} cy={y} r="1" fill="#fff" opacity="0.7" />
		))}
	</g>
);

const alfajor: Art = () => (
	<g>
		<ellipse cx="60" cy="74" rx="26" ry="9" fill="#e7c489" />
		<rect x="34" y="58" width="52" height="14" fill="#c98a45" />
		<ellipse cx="60" cy="58" rx="26" ry="10" fill="#f0d29a" />
		<ellipse cx="60" cy="56" rx="26" ry="9" fill="#f7dcab" />
		<ellipse cx="53" cy="52" rx="8" ry="2.6" fill="#fff" opacity="0.5" />
		{Array.from({ length: 16 }).map((_, i) => {
			const a = (i / 16) * Math.PI * 2;
			return (
				<circle key={i} cx={60 + Math.cos(a) * 26} cy={65 + Math.sin(a) * 8} r="1.6" fill="#fff9f0" />
			);
		})}
	</g>
);

const churros: Art = () => (
	<g>
		{/* chocolate cup */}
		<path d="M70 66 h22 l-3 16 a2 2 0 0 1 -2 2 h-12 a2 2 0 0 1 -2 -2 Z" fill="#7a5030" />
		<ellipse cx="81" cy="66" rx="11" ry="3.5" fill="#4a291a" />
		<ellipse cx="81" cy="66" rx="8" ry="2.2" fill="#341c11" />
		{/* churros sticks */}
		{[
			{ x: 34, r: -18 },
			{ x: 44, r: -8 },
			{ x: 54, r: 2 },
		].map((s, i) => (
			<g key={i} transform={`rotate(${s.r} ${s.x} 60)`}>
				<rect x={s.x - 5} y="38" width="10" height="44" rx="5" fill="#d99a44" />
				<rect x={s.x - 5} y="38" width="10" height="44" rx="5" fill="none" stroke="#b5762c" strokeWidth="1" />
				{[46, 54, 62, 70].map((y) => (
					<line key={y} x1={s.x - 4} y1={y} x2={s.x + 4} y2={y} stroke="#a86a26" strokeWidth="1.2" opacity="0.6" />
				))}
			</g>
		))}
		{[40, 48, 56].map((x, i) => (
			<circle key={i} cx={x} cy={40} r="1.4" fill="#f4d9a0" opacity="0.8" />
		))}
	</g>
);

const gaufre: Art = (u) => (
	<g>
		<defs>
			<linearGradient id={`${u}w`} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stopColor="#f1c777" />
				<stop offset="100%" stopColor="#d69c44" />
			</linearGradient>
		</defs>
		<rect x="36" y="40" width="48" height="42" rx="9" fill={`url(#${u}w)`} stroke="#bd8636" strokeWidth="1.5" />
		{[50, 60, 70].map((v) => (
			<g key={v}>
				<line x1={v} y1="42" x2={v} y2="80" stroke="#b57e30" strokeWidth="2" opacity="0.6" />
				<line x1="38" y1={v} x2="82" y2={v} stroke="#b57e30" strokeWidth="2" opacity="0.6" />
			</g>
		))}
		{[43, 55, 65, 77].flatMap((x) =>
			[46, 55, 65, 75].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="#a86e26" opacity="0.5" />),
		)}
		<path d="M60 40 q10 -6 14 2" fill="none" stroke="#d24a63" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
	</g>
);

const levain: Art = () => (
	<g>
		<circle cx="60" cy="60" r="30" fill="#c88a44" />
		<circle cx="60" cy="60" r="30" fill="none" stroke="#a56a2b" strokeWidth="2" />
		<path d="M46 50 Q60 46 74 50" fill="none" stroke="#7c4d20" strokeWidth="2.5" strokeLinecap="round" />
		<path d="M44 60 Q60 55 76 60" fill="none" stroke="#7c4d20" strokeWidth="2.5" strokeLinecap="round" />
		<path d="M46 70 Q60 66 74 70" fill="none" stroke="#7c4d20" strokeWidth="2.5" strokeLinecap="round" />
		<ellipse cx="52" cy="48" rx="12" ry="5" fill="#f0cd8f" opacity="0.5" />
		{[
			[50, 42],
			[68, 44],
			[74, 66],
			[46, 66],
		].map(([x, y], i) => (
			<circle key={i} cx={x} cy={y} r="1.3" fill="#fdeccb" opacity="0.8" />
		))}
	</g>
);

const brioche: Art = () => (
	<g>
		{/* base with scalloped edge */}
		<path
			d="M32 66 q4 -18 28 -18 q24 0 28 18 q-6 8 -28 8 q-22 0 -28 -8 Z"
			fill="#e3a952"
			stroke="#c1852f"
			strokeWidth="1.5"
		/>
		{[38, 48, 60, 72, 82].map((x) => (
			<path key={x} d={`M${x} 50 q0 12 0 20`} stroke="#c1852f" strokeWidth="1.4" opacity="0.5" />
		))}
		{/* head ball */}
		<circle cx="60" cy="46" r="13" fill="#e9b45f" stroke="#c1852f" strokeWidth="1.5" />
		<ellipse cx="55" cy="42" rx="5" ry="2.6" fill="#fff0cf" opacity="0.6" />
	</g>
);

const cookie: Art = () => (
	<g>
		<circle cx="60" cy="60" r="28" fill="#d59a52" />
		<circle cx="60" cy="60" r="28" fill="none" stroke="#b3782f" strokeWidth="1.5" />
		<ellipse cx="52" cy="52" rx="10" ry="5" fill="#e8b874" opacity="0.6" />
		{[
			[50, 50],
			[68, 48],
			[74, 62],
			[58, 66],
			[46, 66],
			[64, 58],
		].map(([x, y], i) => (
			<g key={i}>
				<circle cx={x} cy={y} r="3.6" fill="#4a291a" />
				<circle cx={x - 1} cy={y - 1} r="1" fill="#6f4128" />
			</g>
		))}
	</g>
);

const cheesecake: Art = () => (
	<g>
		{/* slice, side view */}
		<path d="M34 74 L82 74 L82 58 Q58 50 34 58 Z" fill="#fbedcb" />
		<path d="M34 74 L82 74 L82 66 L34 66 Z" fill="#c98a45" />
		<path d="M34 66 L82 66 L82 58 Q58 50 34 58 Z" fill="#fdf3d9" />
		<path d="M34 58 Q58 50 82 58" fill="none" stroke="#f0dca6" strokeWidth="2" />
		<circle cx="66" cy="55" r="5" fill="#d24a63" />
		<circle cx="64" cy="53" r="1.6" fill="#fff" opacity="0.6" />
		<path d="M60 56 q6 -3 12 0" fill="none" stroke="#b83a58" strokeWidth="2" opacity="0.6" />
	</g>
);

const foret: Art = () => (
	<g>
		{/* layered cake slice */}
		<path d="M36 76 L84 76 L84 46 L36 58 Z" fill="#5a3220" />
		<path d="M36 58 L84 46 L84 52 L36 64 Z" fill="#fff4e0" />
		<path d="M36 64 L84 52 L84 58 L36 70 Z" fill="#6f3f27" />
		<path d="M36 70 L84 58 L84 64 L36 76 Z" fill="#fff4e0" />
		<path d="M36 58 L84 46 L84 42 Q60 36 36 44 Z" fill="#fff8ec" />
		{[46, 60, 74].map((x, i) => (
			<circle key={i} cx={x} cy={40 - i * 0} r="4" fill="#c0293f" />
		))}
		{[46, 60, 74].map((x, i) => (
			<circle key={i} cx={x - 1.3} cy={38.7} r="1.2" fill="#fff" opacity="0.6" />
		))}
		{[42, 54, 66, 78].map((x, i) => (
			<rect key={i} x={x} y={44} width="2" height="6" rx="1" fill="#3a2013" transform={`rotate(${i % 2 ? 18 : -14} ${x} 47)`} />
		))}
	</g>
);

const cupcake: Art = (u) => (
	<g>
		<defs>
			<linearGradient id={`${u}f`} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stopColor="#f7c0d0" />
				<stop offset="100%" stopColor="#e089a4" />
			</linearGradient>
		</defs>
		{/* wrapper */}
		<path d="M42 62 L78 62 L73 82 a2 2 0 0 1 -2 2 H49 a2 2 0 0 1 -2 -2 Z" fill="#e3a952" />
		{[50, 56, 62, 68, 74].map((x) => (
			<line key={x} x1={x} y1="63" x2={x + (x < 60 ? 1.5 : -1.5)} y2="83" stroke="#c1852f" strokeWidth="1.3" opacity="0.6" />
		))}
		{/* frosting swirl */}
		<path
			d="M40 62 Q42 50 52 50 Q54 40 62 44 Q72 40 72 52 Q82 52 78 62 Z"
			fill={`url(#${u}f)`}
			stroke="#d47a97"
			strokeWidth="1"
		/>
		<ellipse cx="54" cy="52" rx="6" ry="3" fill="#fff" opacity="0.4" />
		<circle cx="60" cy="42" r="4" fill="#c0293f" />
		<circle cx="58.7" cy="40.7" r="1.2" fill="#fff" opacity="0.6" />
		{[[48, 58, "#7fa867"], [66, 56, "#e0b03a"], [58, 60, "#5b3b8c"]].map(([x, y, c], i) => (
			<rect key={i} x={x as number} y={y as number} width="4" height="1.8" rx="0.9" fill={c as string} transform={`rotate(${i * 40 - 20} ${x} ${y})`} />
		))}
	</g>
);

const ART: Record<IllustrationKey, Art> = {
	croissant,
	macaron,
	eclair,
	tarte,
	financier,
	baklava,
	mochi,
	alfajor,
	churros,
	gaufre,
	levain,
	brioche,
	cheesecake,
	foret,
	cupcake,
	cookie,
};

export function TreatArt({
	art,
	plate = true,
	className,
}: {
	art: IllustrationKey;
	plate?: boolean;
	className?: string;
}) {
	const raw = useId();
	const uid = "a" + raw.replace(/[^a-zA-Z0-9]/g, "");
	return (
		<svg viewBox="0 0 120 120" className={className} role="img" aria-hidden="true">
			{plate && (
				<>
					<defs>
						<radialGradient id={`${uid}plate`} cx="50%" cy="40%" r="62%">
							<stop offset="0%" stopColor="#fffdf8" />
							<stop offset="72%" stopColor="#f6ecd8" />
							<stop offset="100%" stopColor="#ecdcbf" />
						</radialGradient>
					</defs>
					<ellipse cx="60" cy="98" rx="38" ry="6" fill="#4a3527" opacity="0.12" />
					<circle cx="60" cy="60" r="50" fill={`url(#${uid}plate)`} stroke="#e7d4af" strokeWidth="1.5" />
					<circle cx="60" cy="60" r="42" fill="none" stroke="#efe0c2" strokeWidth="1" />
				</>
			)}
			{ART[art](uid)}
		</svg>
	);
}
