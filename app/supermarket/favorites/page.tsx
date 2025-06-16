"use client"

import ProductCard from "@/components/product-card"
import { useFavorites } from "@/contexts/favorites-provider"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HeartCrack } from "lucide-react"

export default function FavoritesPage() {
  const { favoriteItems } = useFavorites()

  return (
    <div className="container py-8 md:py-12 bg-background text-foreground">
      <header className="mb-8 md:mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">Your Favorites</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Products you've saved for later. Come back anytime to find your cherished items.
        </p>
      </header>

      {favoriteItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {favoriteItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-lg bg-muted/20">
          <HeartCrack className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
          <h2 className="text-2xl font-semibold mb-3 text-foreground">No Favorites Yet!</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any products to your favorites.
            <br />
            Start exploring and save items you love!
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
