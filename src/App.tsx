import { useEffect, useState } from "react";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Menu } from "./components/Menu";
import { Story } from "./components/Story";
import { Gallery } from "./components/Gallery";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Cart } from "./components/Cart";
import { MusicPlayer } from "./components/MusicPlayer";
import { useCart } from "./hooks/useCart";
import { usePwaInstall } from "./hooks/usePwaInstall";

function App() {
	const cart = useCart();
	const install = usePwaInstall();
	const [cartOpen, setCartOpen] = useState(false);
	const openCart = () => setCartOpen(true);

	// Honour the ?section= deep-links declared as manifest shortcuts.
	useEffect(() => {
		const section = new URLSearchParams(window.location.search).get("section");
		if (!section) return;
		if (section === "commander") {
			setCartOpen(true);
			return;
		}
		const el = document.getElementById(section);
		el?.scrollIntoView({ behavior: "smooth" });
	}, []);

	return (
		<div className="relative">
			<Nav cart={cart} onOpenCart={openCart} install={install} />
			<main>
				<Hero onCompose={openCart} />
				<Menu cart={cart} />
				<Story />
				<Gallery />
				<Contact onOpenCart={openCart} />
			</main>
			<Footer install={install} />
			<Cart open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} />
			<MusicPlayer />
		</div>
	);
}

export default App;
