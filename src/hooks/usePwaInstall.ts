import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Wraps the `beforeinstallprompt` flow so the UI can offer a custom
 * "install app" button. Silently degrades on browsers that don't support it
 * (e.g. iOS Safari, where the user installs via the share sheet).
 */
export function usePwaInstall() {
	const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
		null,
	);
	const [installed, setInstalled] = useState(false);

	useEffect(() => {
		const onPrompt = (e: Event) => {
			e.preventDefault();
			setDeferred(e as BeforeInstallPromptEvent);
		};
		const onInstalled = () => {
			setInstalled(true);
			setDeferred(null);
		};
		window.addEventListener("beforeinstallprompt", onPrompt);
		window.addEventListener("appinstalled", onInstalled);

		const standalone =
			window.matchMedia?.("(display-mode: standalone)").matches ||
			// iOS
			(window.navigator as unknown as { standalone?: boolean }).standalone ===
				true;
		if (standalone) setInstalled(true);

		return () => {
			window.removeEventListener("beforeinstallprompt", onPrompt);
			window.removeEventListener("appinstalled", onInstalled);
		};
	}, []);

	const promptInstall = async () => {
		if (!deferred) return;
		await deferred.prompt();
		await deferred.userChoice;
		setDeferred(null);
	};

	return { canInstall: !!deferred && !installed, installed, promptInstall };
}
