import { useState } from "react";
import { config } from "../config";
import { applyThemeColors, getInitialThemeId, persistThemeId } from "../theme";

export function useTheme() {
	const [themeId, setThemeId] = useState(getInitialThemeId());

	const setTheme = (id: string) => {
		const theme = config.themes.find((t) => t.id === id);
		if (!theme) return;
		applyThemeColors(theme.colors);
		persistThemeId(id);
		setThemeId(id);
	};

	return { themeId, setTheme, themes: config.themes };
}
