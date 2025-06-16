// Central DynamicLayout using useCategory hook
"use client"

import { useApp } from "@/contexts/app-context"
import { useCategory } from "@/hooks/use-category"
import RestaurantLayout from "@/app/restaurant/layout"
import SupermarketLayout from "@/app/supermarket/layout"
import { AppProvider } from "@/contexts/app-provider"

export default function DynamicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <DynamicLayoutContent>{children}</DynamicLayoutContent>
    </AppProvider>
  )
}

function DynamicLayoutContent({ children }: { children: React.ReactNode }) {
  const category = useCategory()
  
  if (!category) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (category === "restaurant") {
    return <RestaurantLayout>{children}</RestaurantLayout>
  }
  
  if (category === "supermarket") {
    return <SupermarketLayout>{children}</SupermarketLayout>
  }
  
  return <div>Unknown category</div>
}
