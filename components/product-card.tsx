"use client"

import { useState } from "react";
import Image from "next/legacy/image";
import { ShoppingCart, Heart, Star, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useApp } from "@/contexts/app-context";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useCart } from "@/contexts/cart-provider";
import { useFavorites } from "@/contexts/favorites-provider";

interface BaseItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  is_available: boolean;
  discount_percent: string;
  is_best_deal: boolean;
  is_special: boolean;
  category_name: string;
}

interface ProductCardProps {
  product: BaseItem;
  variant?: "default" | "special" | "deal";
}

export default function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  const { addToCart } = useCart()
  const { addFavorite, removeFavorite, isFavorite: isProdFavorite } = useFavorites()

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        description: product.description,
        is_available: product.is_available,
        category: product.category_name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${product.name} has been ${isFavorite ? "removed from" : "added to"} your favorites.`,
    });
  };

  const isDiscounted = parseFloat(product.discount_percent) > 0;
  const discountedPrice = isDiscounted
    ? parseFloat(product.price) * (1 - parseFloat(product.discount_percent) / 100)
    : parseFloat(product.price);

  const cardVariants = {
    default: "hover:shadow-lg transition-all duration-300",
    special: "hover:shadow-xl transition-all duration-300 border-2 border-primary/20 hover:border-primary",
    deal: "hover:shadow-xl transition-all duration-300 border-2 border-yellow-400/20 hover:border-yellow-400",
  };

  const headerVariants = {
    default: "relative",
    special: "relative bg-gradient-to-b from-primary/5 to-transparent",
    deal: "relative bg-gradient-to-b from-yellow-400/5 to-transparent",
  };

  const badgeVariants = {
    default: "bg-primary",
    special: "bg-primary",
    deal: "bg-yellow-400 text-black",
  };

  const isRestaurant = state.publicData?.system.category === "restaurant";
  const productPath = isRestaurant ? `/menu/${product.id}` : `/products/${product.id}`;

  return (
    <Card className={cn("group overflow-hidden", cardVariants[variant])}>
      <CardHeader className={cn("p-0", headerVariants[variant])}>
        <div className="relative h-[200px] w-full">
          <Link href={productPath} aria-label={`View details for ${product.name}`}>
            <Image
              src={product.image}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/30" />
            
            {/* Special Badge */}
            {product.is_special && (
              <Badge className="absolute left-2 top-2 bg-primary">
                <Star className="mr-1 h-3 w-3" />
                Special
              </Badge>
            )}
            
            {/* Best Deal Badge */}
            {product.is_best_deal && (
              <Badge className="absolute right-2 top-2 bg-yellow-400 text-black">
                <Percent className="mr-1 h-3 w-3" />
                Best Deal
              </Badge>
            )}

            {/* Discount Badge */}
            {isDiscounted && (
              <Badge className="absolute right-2 top-2 bg-red-500">
                {product.discount_percent}% OFF
              </Badge>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 rounded-full bg-white/90 p-2 hover:bg-white"
              onClick={toggleFavorite}
            >
              <Heart
                className={cn("h-5 w-5", isFavorite ? "fill-red-500 text-red-500" : "text-gray-600")}
              />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            {isDiscounted ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-primary">
                ${parseFloat(product.price).toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-sm text-muted-foreground">{product.category_name}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={!product.is_available}
        >
          {product.is_available ? (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          ) : (
            "Not Available"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

ProductCard.defaultProps = {
  product: {
    id: 0,
    name: "Sample Item",
    price: "0.00",
    image: null,
    category_name: "Uncategorized",
    description: "",
    is_available: true,
    discount_percent: "0",
    is_best_deal: false,
    is_special: false
  },
}
