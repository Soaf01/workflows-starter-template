import { config } from "../../config";
import { Photo } from "../../lib/photo";
import { Icon } from "../../ui/Icon";

export function StoryScreen() {
	const { story, brand } = config;
	return (
		<div className="animate-fade-in">
			<div className="relative">
				<Photo src={story.heroImage} alt={brand.name} width={900} height={700} eager className="h-64 w-full" />
				<div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
				<div className="absolute inset-x-0 bottom-0 p-5">
					<p className="kicker">{story.kicker}</p>
					<h1 className="mt-1 text-balance font-display text-3xl leading-tight text-ink">{story.heading}</h1>
				</div>
			</div>

			<div className="screen-pad space-y-5 pt-6">
				{story.paragraphs.map((p, i) => (
					<p key={i} className="text-[15px] leading-relaxed text-ink/90">{p}</p>
				))}

				<div className="space-y-3 pt-2">
					{story.values.map((v) => (
						<div key={v.title} className="card flex items-start gap-4 p-4">
							<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/12 text-gold">
								<Icon name={v.icon} className="h-5 w-5" />
							</span>
							<div>
								<h3 className="font-display text-lg text-ink">{v.title}</h3>
								<p className="mt-0.5 text-sm text-muted">{v.text}</p>
							</div>
						</div>
					))}
				</div>

				<div className="rounded-app border border-line bg-surface p-4 text-center">
					<p className="font-display text-lg text-gold">{brand.name}</p>
					<p className="text-xs uppercase tracking-[0.3em] text-muted">{brand.established}</p>
				</div>
			</div>
		</div>
	);
}
