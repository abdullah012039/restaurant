'use client';

import React from 'react'
import { useCategory } from "@/hooks/use-category"
import SupermarketFavoritesPage from "@/app/supermarket/favorites/page"
import RestaurantFavoritesPage from "@/app/restaurant/favorites/page"

const FavoritesPage = () => {
  const category = useCategory()
  if (!category) return null
  if (category === "supermarket") return <SupermarketFavoritesPage />
  if (category === "restaurant") return <RestaurantFavoritesPage />
  return <div>Unknown category</div>
}

export default FavoritesPage;
