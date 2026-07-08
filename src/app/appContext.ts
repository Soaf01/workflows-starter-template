import { createContext, useContext } from "react";
import type { ScreenId } from "../config/types";
import type { CartApi } from "../hooks/useCart";

export interface AppCtx {
	screen: ScreenId;
	navigate: (id: ScreenId) => void;
	back: () => void;
	canBack: boolean;
	openCart: () => void;
	cart: CartApi;
	toast: (message: string) => void;
}

export const AppContext = createContext<AppCtx | null>(null);

export function useApp(): AppCtx {
	const ctx = useContext(AppContext);
	if (!ctx) throw new Error("useApp must be used within the app shell");
	return ctx;
}
