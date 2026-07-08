import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { bootstrapTheme } from "./theme";

// Apply the saved/default theme + fonts before first paint.
bootstrapTheme();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);

// Fade out the pre-hydration splash.
const splash = document.getElementById("app-splash");
if (splash) {
	requestAnimationFrame(() => {
		splash.style.opacity = "0";
		window.setTimeout(() => splash.remove(), 500);
	});
}

// Service worker for offline support (production only).
if ("serviceWorker" in navigator && import.meta.env.PROD) {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("/sw.js").catch(() => {
			/* progressive enhancement */
		});
	});
}
