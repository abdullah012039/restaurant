"use client"

// تم نقل FavoritesProvider إلى contexts/favorites-provider.tsx
// استخدم المزود من هناك مباشرة

import { createContext, useContext, useState, type ReactNode, useCallback } from "react"
import { MenuItem } from "@/lib/types"

interface FavoritesContextType {
  favoriteItems: MenuItem[]
  addFavorite: (product: MenuItem) => void
  removeFavorite: (productId: number) => void
  isFavorite: (productId: number) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteItems, setFavoriteItems] = useState<MenuItem[]>([])

  const addFavorite = useCallback((product: MenuItem) => {
    setFavoriteItems((prevItems) => {
      if (prevItems.find((item) => item.id === product.id)) {
        return prevItems // Already a favorite
      }
      return [...prevItems, product]
    })
  }, [])

  const removeFavorite = useCallback((productId: number) => {
    setFavoriteItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }, [])

  const isFavorite = useCallback(
    (productId: number) => {
      return favoriteItems.some((item) => item.id === productId)
    },
    [favoriteItems],
  )

  return (
    <FavoritesContext.Provider value={{ favoriteItems, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
