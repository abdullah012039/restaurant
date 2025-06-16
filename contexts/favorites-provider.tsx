// Unified FavoritesProvider
"use client"
import { createContext, useContext, useState, useCallback, ReactNode } from "react"

interface Product {
  id: number;
  // ...other product fields
}

interface FavoritesContextType {
  favoriteItems: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteItems, setFavoriteItems] = useState<Product[]>([]);

  const addFavorite = useCallback((product: Product) => {
    setFavoriteItems((prev) => prev.some((item) => item.id === product.id) ? prev : [...prev, product]);
  }, []);

  const removeFavorite = useCallback((productId: number) => {
    setFavoriteItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const isFavorite = useCallback((productId: number) => {
    return favoriteItems.some((item) => item.id === productId);
  }, [favoriteItems]);

  return (
    <FavoritesContext.Provider value={{ favoriteItems, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within a FavoritesProvider");
  return context;
}
