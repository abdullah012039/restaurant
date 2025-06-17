"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, Search, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/cart-provider";
import { ThemeToggle } from "./theme-toggle";
import { useApp } from "@/contexts/app-context";
import { getBaseUrl } from "@/lib/api";

export default function SiteHeader() {
	const { getCartItemCount } = useCart();
	const cartItemCount = getCartItemCount();
	const { state } = useApp();
	const { publicData } = state;

	const logo = publicData?.system.logo || "/placeholder.svg";
	const publicTitle = publicData?.system.public_title || "Store";
	const isRestaurant = publicData?.system.category === "restaurant";

	const navLinks = [
		{ href: "/", label: "Home" },
		{ href: isRestaurant ? "/menu" : "/products", label: isRestaurant ? "Menu" : "Products" },
		{ href: "/favorites", label: "Favorites" },
		{ href: "/about", label: "About Us" },
		{ href: "/contact", label: "Contact" },
	];

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-primary">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="container flex h-16 items-center justify-between">
					<Link href="/" className="flex items-center gap-2">
						<div className="flex-shrink-0 rounded-full overflow-hidden">
							<Image
								src={logo  ?  logo : "/placeholder.svg"}
								alt={publicTitle}
								width={30}
								height={30}
								className="h-8 w-auto"
							/>
						</div>
					</Link>

					<nav className="hidden md:flex items-center gap-6 text-sm font-medium">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="text-secondary hover:text-secondary transition-colors"
							>
								{link.label}
							</Link>
						))}
					</nav>

					<div className="flex items-center gap-3">
						<div className="hidden sm:flex items-center gap-2 border border-border bg-slate-50 rounded-md px-2 py-1">
							<Input
								type="search"
								placeholder={isRestaurant ? "Search menu..." : "Search products..."}
								className="h-8 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-sm placeholder:text-muted-secondary text-primary"
							/>
							<Button variant="ghost" size="icon" className="h-8 w-8">
								<Search className="h-4 w-4 text-primary" />
							</Button>
						</div>
						<Button
							variant="ghost"
							size="icon"
							asChild
							className="hidden md:inline-flex text-secondary"
						>
							<Link href="/profile">
								<User className="h-5 w-5" />
								<span className="sr-only">Profile</span>
							</Link>
						</Button>
						<Button
							variant="ghost"
							size="icon"
							asChild
							className="hidden md:inline-flex text-secondary"
						>
							<Link href="/favorites">
								<Heart className="h-5 w-5" />
								<span className="sr-only">Favorites</span>
							</Link>
						</Button>
						<Button
							variant="outline"
							size="icon"
							asChild
							className="relative text-background bg-primary border-secondary"
						>
							<Link href="/cart">
								<ShoppingCart className="h-5 w-5" />
								{cartItemCount > 0 && (
									<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
										{cartItemCount}
									</span>
								)}
								<span className="sr-only">Shopping Cart</span>
							</Link>
						</Button>

						<ThemeToggle />

						<Sheet>
							<SheetTrigger asChild>
								<Button variant="outline" size="icon" className="md:hidden">
									<Menu className="h-5 w-5" />
									<span className="sr-only">Toggle navigation menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent
								side="left"
								className="w-[300px] sm:w-[400px] bg-background"
							>
								<nav className="flex flex-col gap-4 mt-8">
									{navLinks.map((link) => (
										<Link
											key={link.href}
											href={link.href}
											className="text-lg font-medium text-foreground hover:text-primary transition-colors"
										>
											{link.label}
										</Link>
									))}
									<Link
										href="/favorites"
										className="text-lg font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
									>
										<Heart className="h-5 w-5" /> Favorites
									</Link>
									<Link
										href="/cart"
										className="text-lg font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
									>
										<ShoppingCart className="h-5 w-5" /> Cart{" "}
										{cartItemCount > 0 && `(${cartItemCount})`}
									</Link>
									<Link
										href="/profile"
										className="text-lg font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
									>
										<User className="h-5 w-5" /> Profile
									</Link>
								</nav>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</header>
	);
}

SiteHeader.defaultProps = {}; // Required for Next.js
