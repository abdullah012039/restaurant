'use client'

import React from 'react'
import { useCategory } from "@/hooks/use-category"
import SupermarketHomePage from "@/app/supermarket/page"
import RestaurantHomePage from "@/app/restaurant/page"

export default function HomePage() {
  const category = useCategory()
  if (!category) return null
  if (category === "supermarket") return <SupermarketHomePage />
  if (category === "restaurant") return <RestaurantHomePage />
  return <div>Unknown category</div>
}
