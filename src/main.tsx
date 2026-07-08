import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);

// Fade out the pre-hydration splash once the app has mounted.
const splash = document.getElementById("app-splash");
if (splash) {
	requestAnimationFrame(() => {
		splash.style.opacity = "0";
		window.setTimeout(() => splash.remove(), 500);
	});
}

// Register the service worker for offline support (production builds only).
if ("serviceWorker" in navigator && import.meta.env.PROD) {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("/sw.js").catch(() => {
			/* offline support is a progressive enhancement */
		});
	});
}
