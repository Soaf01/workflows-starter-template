import { LangProvider } from "./i18n/lang";
import { AppShell } from "./app/AppShell";

export default function App() {
	return (
		<LangProvider>
			<AppShell />
		</LangProvider>
	);
}
