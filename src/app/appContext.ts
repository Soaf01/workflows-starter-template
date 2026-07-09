import { createContext, useContext } from "react";
import type { ScreenId } from "../config/types";
import type { CartApi } from "../hooks/useCart";
import type { AccountApi } from "../hooks/useAccount";
import type { FavApi } from "../hooks/useFavourites";
import type { OrdersApi } from "../hooks/useOrders";

export interface AppCtx {
	screen: ScreenId;
	navigate: (id: ScreenId) => void;
	back: () => void;
	canBack: boolean;
	openCart: () => void;
	openProduct: (id: string) => void;
	cart: CartApi;
	account: AccountApi;
	fav: FavApi;
	orders: OrdersApi;
	toast: (message: string) => void;
}

export const AppContext = createContext<AppCtx | null>(null);

export function useApp(): AppCtx {
	const ctx = useContext(AppContext);
	if (!ctx) throw new Error("useApp must be used within the app shell");
	return ctx;
}
